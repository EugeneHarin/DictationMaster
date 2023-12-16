'use server';

import z from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { deleteAudioFromGCS } from "./google-cloud-actions";
import { DictationsTable } from "./definitions";
import { deleteCachedAudioUrl } from "./cache";

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
  date: z
    .string(),
});

const CreateDictation = FormSchema.omit({ id: true, date: true });
const UpdateDictation = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    teacherId?: string[];
    title?: string[];
    content?: string[];
    status?: string[];
    databaseError?: string[];
  };
  message?: string | null;
};

export async function createDictation(prevState: State, formData: FormData) {
  const validatedFields = CreateDictation.safeParse({
    teacherId: formData.get('teacherId'),
    title: formData.get('title'),
    content: formData.get('content'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Dictation',
    }
  }

  const { teacherId, title, content, status } = validatedFields.data;
  const wordsCount = content.match(/\b\w+\b/g)?.length || 0;
  const date = new Date().toISOString();

  try {
    sql`
      INSERT INTO dictations(teacher_id, title, content, status, words_count, date)
      VALUES (${teacherId},${title},${content},${status},${wordsCount},${date})
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

export async function updateDictation(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateDictation.safeParse({
    teacherId: formData?.get('teacherId'),
    title: formData?.get('title'),
    content: formData?.get('content'),
    status: formData?.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Dictation.',
    };
  }
  const { teacherId, title, content, status } = validatedFields.data;
  const wordsCount = content.match(/\b\w+\b/g)?.length || 0;
  let oldDictationContent = null;

  try {
    // Get old Dictation Content value to decide if we need to replace the cached Audio file
    const data = await sql<Pick<DictationsTable, 'content'>>`
      SELECT content
      FROM dictations
      WHERE dictations.id = ${id}
    `
    oldDictationContent = data.rows[0].content;

  } catch (error: any) {
    return {
      errors: {
        databaseError: error.message
      },
      message: 'Database Error: Failed to Get Dictation Data.',
    };
  }

  try {
    await sql`
      UPDATE dictations
      SET teacher_id = ${teacherId},
      title = ${title},
      content = ${content},
      status = ${status},
      words_count = ${wordsCount}
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

  if (oldDictationContent !== content) {
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

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
