'use server'

import z from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { deleteAudioFromGCS } from "../google-cloud-actions";
import { deleteCachedAudioUrl } from "../cache";
import { Dictation, LANGUAGE_CODES } from "../definitions";

export type State = {
  errors?: {
    teacherId?: string[];
    title?: string[];
    language_code?: string[];
    content?: string[];
    status?: string[];
    databaseError?: string[];
  };
  message?: string | null;
};

const FormSchema = z.object({
  id: z.string(),
  teacherId: z
    .string({
      invalid_type_error: 'Please select a teacher.',
    })
    .trim(),
  title: z
    .string()
    .trim()
    .min(1, 'Dictation title can not be empty.'),
  content: z
    .string()
    .trim()
    .min(1, 'Dictation content can not be empty.')
    .min(50, 'Dictation content should be at least 50 characters long.'),
  status: z
    .enum(['draft', 'published'], {
      invalid_type_error: 'Please select an dictation status.',
    }),
  language_code: z
    .enum(LANGUAGE_CODES, {
      invalid_type_error: 'Please select the language code.',
    }),
  date: z
    .string(),
});

const CreateDictation = FormSchema.omit({ id: true, date: true });
const UpdateDictation = FormSchema.omit({ id: true, date: true });

export async function createDictation(prevState: State, formData: FormData) {
  const validatedFields = CreateDictation.safeParse({
    teacherId: formData.get('teacherId'),
    title: formData.get('title'),
    language_code: formData.get('language_code'),
    content: formData.get('content'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Dictation',
    }
  }

  const { teacherId, title, language_code, content, status } = validatedFields.data;
  const date = new Date().toISOString();

  let wordsCount = 0;
  if (language_code == 'en-US') {
    wordsCount = content.match(/\b\w+\b/g)?.length || 0;
  } else if (language_code == 'uk-UA') {
    wordsCount = content.match(/[\u0400-\u04FF]+(?:['’-][\u0400-\u04FF]+)*/g)?.length || 0;
  }

  try {
    sql`
      INSERT INTO dictations(teacher_id, title, language_code, content, status, words_count, date)
      VALUES (${teacherId},${title},${language_code},${content},${status},${wordsCount},${date})
    `;
  } catch (error: any) {
    return {
      errors: {
        databaseError: error.message
      },
      message: 'Database Error: Failed to Create Dictation.',
    };
  }

  revalidatePath('/dashboard/dictations');
  redirect('/dashboard/dictations');
}

export async function getDictation(id: string) {
  try {
    const data = await sql`
      SELECT *
      FROM dictations
      WHERE dictations.id = ${id}
    `;
    const dictation = data.rows[0] as Dictation;
    return dictation;

  } catch (error: any) {
    console.error(error);
    throw error;
  }
}

export async function updateDictation(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateDictation.safeParse({
    teacherId: formData?.get('teacherId'),
    title: formData?.get('title'),
    language_code: formData.get('language_code'),
    content: formData?.get('content'),
    status: formData?.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Dictation.',
    };
  }
  const { teacherId, title, language_code, content, status } = validatedFields.data;
  const { content: oldDictationContent, language_code: oldDictationLanguageCode } = (await getDictation(id));

  let wordsCount = 0;
  if (language_code == 'en-US') {
    wordsCount = content.match(/\b\w+\b/g)?.length || 0;
  } else if (language_code == 'uk-UA') {
    wordsCount = content.match(/[\u0400-\u04FF]+(?:['’-][\u0400-\u04FF]+)*/g)?.length || 0;
  }

  try {
    await sql`
      UPDATE dictations
      SET teacher_id = ${teacherId},
      title = ${title},
      content = ${content},
      status = ${status},
      words_count = ${wordsCount},
      language_code = ${language_code}
      WHERE id = ${id}
    `;
  } catch (error: any) {
    return {
      errors: {
        databaseError: error.message
      },
      message: 'Database Error: Failed to Update Dictation.',
    };
  }

  if (oldDictationContent !== content || oldDictationLanguageCode !== language_code) {
    deleteAudioFromGCS(id);
    deleteCachedAudioUrl(id);
  }

  revalidatePath('/dashboard/dictations');
  redirect('/dashboard/dictations');
}

export async function deleteDictation(id: string) {
  try {
    sql`DELETE FROM dictations WHERE id = ${id}`;
    deleteAudioFromGCS(id);
    deleteCachedAudioUrl(id);
    revalidatePath('/dashboard/dictations');
    return { message: 'Deleted Dictation.' };
  } catch (error: any) {
    return {
      errors: {
        databaseError: error.message
      },
      message: 'Database Error: Failed to Delete Dictation.',
    };
  }
}
