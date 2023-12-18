import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { TeachersTable } from '../definitions';

export async function fetchAllTeachers() {
  noStore();
  try {
    const data = await sql<Pick<TeachersTable, 'id' | 'name'>>`
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
