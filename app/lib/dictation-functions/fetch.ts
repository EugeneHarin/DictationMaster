import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import {
  Dictation,
  DictationForm,
  User,
  DictationWithTeacher,
} from '../definitions';

const DICTATIONS_PER_PAGE = 6;

export async function fetchDictationWithTeacher(id: string) {
  try {
    const dictations = await sql<DictationWithTeacher>`
      SELECT
        dictations.*,
        users.name,
        users.image_url
      FROM dictations
      JOIN users ON dictations.teacher_id = users.id
      WHERE
        dictations.id = ${id} AND
        users.role = 'teacher'
    `;

    return dictations.rows[0];
  } catch (error) {
    console.error('Failed to fetch dictation with teacher. Database Error:', error);
    return false;
  }
}

export async function fetchFilteredDictations(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * DICTATIONS_PER_PAGE;

  type FilteredDictations = Dictation & Pick<User, 'name' | 'image_url'>;

  try {
    const dictations = await sql<FilteredDictations>`
      SELECT
        dictations.id,
        dictations.title,
        dictations.content,
        dictations.words_count,
        dictations.status,
        dictations.date,
        users.name,
        users.image_url
      FROM dictations
      JOIN users ON dictations.teacher_id = users.id
      WHERE
        users.role = 'teacher' AND (
          users.name ILIKE ${`%${query}%`} OR
          dictations.title ILIKE ${`%${query}%`} OR
          dictations.words_count::text ILIKE ${`%${query}%`} OR
          dictations.status ILIKE ${`%${query}%`}
        )
      ORDER BY dictations.date DESC
      LIMIT ${DICTATIONS_PER_PAGE} OFFSET ${offset}
    `;

    return dictations.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch dictations.');
  }
}

export async function fetchDictationsPages(query: string) {
  noStore();
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM dictations JOIN users ON users.id = dictations.teacher_id
      WHERE
        users.role = 'teacher' AND (
          users.name ILIKE ${`%${query}%`} OR
          dictations.title ILIKE ${`%${query}%`} OR
          dictations.words_count::text ILIKE ${`%${query}%`} OR
          dictations.status ILIKE ${`%${query}%`}
        )
    `;
    const totalPages = Math.ceil(Number(count.rows[0].count) / DICTATIONS_PER_PAGE);
    return totalPages;
  } catch (error) {
    throw new Error(`Failed to fetch total number of dictations`, {
      cause: error
    });
  }
}

export async function fetchDictationById(id: string) {
  noStore();
  try {
    const dictation = await sql<DictationForm>`
      SELECT
        dictations.id,
        dictations.teacher_id,
        dictations.title,
        dictations.content,
        dictations.status
      FROM dictations
      WHERE dictations.id = ${id};
    `;

    return dictation.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch dictation.');
  }
}
