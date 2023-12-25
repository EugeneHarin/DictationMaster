import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import {
  DictationsTable,
  DictationForm,
  UsersTable,
  DictationWithTeacher,
} from '../definitions';

const DICTATIONS_PER_PAGE = 6;

export async function fetchDictationWithTeacher(id: string) {
  try {
    const dictations = await sql<DictationWithTeacher>`
      SELECT
        dictations.*,
        teachers.name,
        teachers.image_url
      FROM dictations
      JOIN teachers ON dictations.teacher_id = teachers.id
      WHERE dictations.id = ${id}
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

  type FilteredDictations = DictationsTable & Pick<UsersTable, 'name' | 'image_url'>;

  try {
    const dictations = await sql<FilteredDictations>`
      SELECT
        dictations.id,
        dictations.title,
        dictations.content,
        dictations.words_count,
        dictations.status,
        dictations.date,
        teachers.name,
        teachers.image_url
      FROM dictations
      JOIN teachers ON dictations.teacher_id = teachers.id
      WHERE
        teachers.name ILIKE ${`%${query}%`} OR
        dictations.title ILIKE ${`%${query}%`} OR
        dictations.words_count::text ILIKE ${`%${query}%`} OR
        dictations.status ILIKE ${`%${query}%`}
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
      FROM dictations JOIN teachers ON teachers.id = dictations.teacher_id
      WHERE
        teachers.name ILIKE ${`%${query}%`} OR
        dictations.title ILIKE ${`%${query}%`} OR
        dictations.words_count::text ILIKE ${`%${query}%`} OR
        dictations.status ILIKE ${`%${query}%`}
    `;
    const totalPages = Math.ceil(Number(count.rows[0].count) / DICTATIONS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of dictations');
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
