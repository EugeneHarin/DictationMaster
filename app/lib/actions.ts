'use server';

import z from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ErrorCallback } from 'typescript';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

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

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

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

// export async function createInvoice(prevState: State, formData: FormData) {
//   // Validate form using Zod
//   const validatedFields = CreateInvoice.safeParse({
//     customerId: formData.get('customerId'),
//     amount: formData.get('amount'),
//     status: formData.get('status'),
//   });

//   // If form validation fails, return errors early. Otherwise, continue.
//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Create Invoice.',
//     };
//   }

//   // Prepare data for insertion into the database
//   const { customerId, amount, status } = validatedFields.data;
//   const amountInCents = amount * 100;
//   const date = new Date().toISOString().split('T')[0];

//   // Insert data into the database
//   try {
//     await sql`
//       INSERT INTO invoices (customer_id, amount, status, date)
//       VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
//     `;
//   } catch (error) {
//     // If a database error occurs, return a more specific error.
//     return {
//       message: 'Database Error: Failed to Create Invoice.',
//     };
//   }

//   // Revalidate the cache for the invoices page and redirect the user.
//   revalidatePath('/dashboard/invoices');
//   redirect('/dashboard/invoices');
// }

// export async function updateInvoice(id: string, prevState: State, formData: FormData) {

//   const validatedFields = UpdateInvoice.safeParse({
//     customerId: formData.get('customerId'),
//     amount: formData.get('amount'),
//     status: formData.get('status'),
//   });

//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Update Invoice.',
//     };
//   }

//   const { customerId, amount, status } = validatedFields.data;
//   const amountInCents = amount * 100;

//   try {
//     await sql`
//       UPDATE invoices
//       SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
//       WHERE id = ${id}
//     `;
//   } catch (error) {
//     return {
//       message: 'Database Error: Failed to Update Invoice.',
//     };
//   }

//   revalidatePath('/dashboard/invoices');
//   redirect('/dashboard/invoices');
// }

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

  revalidatePath('/dashboard/dictations');
  redirect('/dashboard/dictations');
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error: any) {
    return {
      errors: {
        databaseError: error.message
      },
      message: 'Database Error: Failed to Delete Invoice.',
    };
  }
}

export async function deleteDictation(id: string) {}

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
