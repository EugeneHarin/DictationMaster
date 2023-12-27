import { QueryResult, QueryResultRow, sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import {
  Dictation,
  DictationWithTeacher,
  User,
} from '../definitions';

const DICTATIONS_PER_PAGE = 6;

export async function fetchDictationWithTeacher(id: string) {
  noStore();
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
  status?: Dictation['status'],
) {
  noStore();
  const offset = (currentPage - 1) * DICTATIONS_PER_PAGE;
  type FilteredDictations = Dictation & Pick<User, 'name' | 'image_url'>;
  try {
    let dictations: QueryResult<FilteredDictations>;
    if (status !== undefined) {
      dictations = await sql`
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
          dictations.status = ${status} AND
          users.role = 'teacher' AND (
            users.name ILIKE ${`%${query}%`} OR
            dictations.title ILIKE ${`%${query}%`} OR
            dictations.words_count::text ILIKE ${`%${query}%`} OR
            dictations.status ILIKE ${`%${query}%`}
          )
        ORDER BY dictations.date DESC
        LIMIT ${DICTATIONS_PER_PAGE} OFFSET ${offset}
      `;
    } else {
      dictations = await sql`
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
    }

    return dictations.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch dictations.');
  }
}

export async function fetchDictationsPages(query: string, status?: Dictation['status']) {
  noStore();
  try {
    let data: QueryResult<QueryResultRow>;
    if (status !== undefined) {
      data = await sql`
        SELECT COUNT(*)
        FROM dictations JOIN users ON users.id = dictations.teacher_id
        WHERE
          dictations.status = ${status} AND
          users.role = 'teacher' AND (
            users.name ILIKE ${`%${query}%`} OR
            dictations.title ILIKE ${`%${query}%`} OR
            dictations.words_count::text ILIKE ${`%${query}%`} OR
            dictations.status ILIKE ${`%${query}%`}
          )
      `;
    } else {
      data = await sql`
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
    }
    const totalPages = Math.ceil(Number(data.rows[0].count) / DICTATIONS_PER_PAGE);
    return totalPages;
  } catch (error) {
    throw new Error(`Failed to fetch total number of dictations`, {
      cause: error
    });
  }
}
