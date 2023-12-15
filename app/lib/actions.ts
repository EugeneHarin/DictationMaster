'use server';

import z from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { deleteAudioFromGCS } from "./google-cloud-actions";

const FormSchema = z.object({
  id: z.string(),
  teacherId: z.string({
    invalid_type_error: 'Please select a teacher.',
  }),
  title: z.string({
    required_error: 'Dictation title can not be empty.',
  }).min(1),
  content: z.string({
    required_error: 'Dictation content can not be empty.',
  }).min(10),
  status: z.enum(['draft', 'published'], {
    invalid_type_error: 'Please select an dictation status.',
  }),
  date: z.string(),
});

const CreateDictation = FormSchema.omit({ id: true, date: true });
const UpdateDictation = FormSchema.omit({ id: true, date: true });

export async function createDictation() {
  return;
}

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

export async function updateDictation(id: string, prevState: State, formData: FormData) {

  const validatedFields = UpdateDictation.safeParse({
    teacherId: formData.get('teacherId'),
    title: formData.get('title'),
    content: formData.get('content'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Dictation.',
    };
  }

  const { teacherId, title, content, status } = validatedFields.data;
  const wordsCount = content.match(/\b\w+\b/g)?.length || 0;

  try {
    sql`
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

  deleteAudioFromGCS(id);

  revalidatePath('/dashboard/dictations');
  redirect('/dashboard/dictations');
}

export async function deleteDictation(id: string) {
  try {
    await sql`DELETE FROM dictations WHERE id = ${id}`;
    await deleteAudioFromGCS(id);
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
