'use server'

import z from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';
import { deleteAudioFromGCS } from "../google-cloud-actions";
import { deleteCachedAudioUrl } from "../cache";
import { DICTATION_SPEEDS, Dictation, LANGUAGE_CODES } from "../definitions";

const DICTATION_SPEEDS_STRINGS: readonly [string, ...string[]] = DICTATION_SPEEDS.map(speed => speed.toString()) as [string, ...string[]];

export type State = {
  errors?: {
    teacherId?: string[];
    title?: string[];
    language_code?: string[];
    content?: string[];
    status?: string[];
    speed?: string[];
    databaseError?: string[];
  };
  message?: string | null;
};

const speedSchema = z.union([
  z.literal(0.5),
  z.literal(0.6),
  z.literal(0.7),
  z.literal(0.8),
  z.literal(0.9),
  z.literal(1)
]).refine((data) => {
  // Check if the data is one of the valid speeds
  return DICTATION_SPEEDS.includes(data);
}, {
  // Custom error message
  message: "Invalid speed. Speed must be one of 0.5, 0.6, 0.7, 0.8, 0.9, 1",
});

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
  speed: z
    .enum(['0.5', '0.6', '0.7', '0.8', '0.9', '1'], {
      invalid_type_error: 'Invalid speed value.',
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
  noStore();
  const validatedFields = CreateDictation.safeParse({
    teacherId: formData.get('teacherId'),
    title: formData.get('title'),
    language_code: formData.get('language_code'),
    content: formData.get('content'),
    status: formData.get('status'),
    speed: formData.get('speed'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Dictation',
    }
  }

  const { teacherId, title, language_code, content, status, speed } = validatedFields.data;
  const date = new Date().toISOString();

  let wordsCount = 0;
  if (language_code == 'en-US') {
    wordsCount = content.match(/\b\w+\b/g)?.length || 0;
  } else if (language_code == 'uk-UA') {
    wordsCount = content.match(/[\u0400-\u04FF]+(?:['’-][\u0400-\u04FF]+)*/g)?.length || 0;
  }

  try {
    sql`
      INSERT INTO dictations(teacher_id, title, language_code, content, status, speed, words_count, date)
      VALUES (${teacherId},${title},${language_code},${content},${status},${speed},${wordsCount},${date})
    `;
  } catch (error: any) {
    throw new Error('Error Creating dictation', {cause: error});

  }

  revalidatePath('/dashboard/dictations');
  redirect('/dashboard/dictations');
}

export async function getDictation(id: string) {
  noStore();
  try {
    const data = await sql`
      SELECT *
      FROM dictations
      WHERE dictations.id = ${id}
    `;
    const dictation = data.rows[0] as Dictation;
    return dictation;

  } catch (error: any) {
    throw new Error('Error Getting dictation', {cause: error});
  }
}

export async function updateDictation(id: string, prevState: State, formData: FormData) {
  noStore();
  const validatedFields = UpdateDictation.safeParse({
    teacherId: formData?.get('teacherId'),
    title: formData?.get('title'),
    language_code: formData.get('language_code'),
    content: formData?.get('content'),
    status: formData?.get('status'),
    speed: formData.get('speed'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Dictation.',
    };
  }
  const { teacherId, title, language_code, content, status, speed } = validatedFields.data;
  const { content: oldDictationContent, language_code: oldDictationLanguageCode, speed: oldDictationSpeed } = (await getDictation(id));

  let wordsCount = 0;
  if (language_code == 'en-US') {
    wordsCount = content.match(/\b\w+\b/g)?.length || 0;
  } else if (language_code == 'uk-UA') {
    wordsCount = content.match(/[\u0400-\u04FF]+(?:['’-][\u0400-\u04FF]+)*/g)?.length || 0;
  }

  try {
    await sql`
      UPDATE dictations
      SET
        teacher_id = ${teacherId},
        title = ${title},
        content = ${content},
        status = ${status},
        words_count = ${wordsCount},
        language_code = ${language_code},
        speed = ${speed}
      WHERE id = ${id}
    `;
  } catch (error: unknown) {
    throw new Error('Error Updating dictation', {cause: error});
  }

  console.log(oldDictationSpeed.toString());
  console.log(speed);

  if (oldDictationContent !== content || oldDictationLanguageCode !== language_code || oldDictationSpeed.toString() !== speed) {
    deleteAudioFromGCS(id);
    deleteCachedAudioUrl(id);
  }

  revalidatePath('/dashboard/dictations');
  redirect('/dashboard/dictations');
}

export async function deleteDictation(id: string) {
  noStore();
  try {
    sql`DELETE FROM dictations WHERE id = ${id}`;
    deleteAudioFromGCS(id);
    deleteCachedAudioUrl(id);
    revalidatePath('/dashboard/dictations');
    return { message: 'Deleted Dictation.' };
  } catch (error: unknown) {
    throw new Error('Error Deleting dictation', {cause: error});
  }
}
