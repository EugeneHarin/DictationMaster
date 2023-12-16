import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import {
  User,
  DictationsTable,
  DictationForm,
  TeacherField,
  AudioFileDataField,
} from './definitions';

const DICTATIONS_PER_PAGE = 6;

export async function fetchFilteredDictations(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * DICTATIONS_PER_PAGE;

  try {
    const dictations = await sql<DictationsTable>`
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

export async function fetchTeachers() {
  noStore();
  try {
    const data = await sql<TeacherField>`
      SELECT
        id,
        name
      FROM teachers
      ORDER BY name ASC
    `;

    const teachers = data.rows;
    return teachers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all teachers.');
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getCachedAudioUrl(id: string) {
  try {
    const data = await sql<AudioFileDataField>`
      SELECT
        audio_file_url,
        audio_file_exp_date
      FROM dictations
      WHERE dictations.id = ${id};
    `;

    const audioFileData = data.rows[0];
    return audioFileData;
  } catch (error) {
    console.error('Failed to fetch cached audio URL:', error);
    throw new Error('Failed to fetch cached audio URL');
  }
}

export async function setCachedAudioUrl(id: string, audioFileUrl: string, audioFileExpDate: string) {
  try {
    const data = await sql<AudioFileDataField>`
      UPDATE dictations
      SET audio_file_url = ${audioFileUrl},
      audio_file_exp_date = ${audioFileExpDate}
      WHERE dictations.id = ${id};
    `;
    return true;
  } catch (error) {
    console.error('Failed to update cached audio URL:', error);
    throw new Error('Failed to update cached audio URL');
  }
}

export async function deleteCachedAudioUrl(id: string) {
  try {
    const data = await sql<AudioFileDataField>`
      UPDATE dictations
      SET audio_file_url = null,
      audio_file_exp_date = null
      WHERE dictations.id = ${id};
    `;
    return true;
  } catch (error) {
    console.error('Failed to delete cached audio URL:', error);
    throw new Error('Failed to delete cached audio URL');
  }
}
