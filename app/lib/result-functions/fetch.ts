import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from 'next/cache';
import { Dictation, DictationResult, DictationResultAllData, User } from "../definitions";
import { Result } from "postcss";

const RESULTS_PER_PAGE = 6;

export default async function fetchResultData(resultId: string) {
  try {
    const data = await sql<DictationResultAllData>`
      SELECT
        results.id AS result_id,
        results.student_id,
        results.dictation_id,
        results.result_errors::json,
        results.result_html,
        results.date AS result_date,
        dictations.title AS dictation_title,
        dictations.content AS dictation_content,
        dictations.status AS dictation_status,
        users.name AS student_name,
        users.email AS user_email,
        users.image_url AS user_image_url
      FROM results
      JOIN dictations ON results.dictation_id = dictations.id
      JOIN users ON results.student_id = users.id
      WHERE results.id = ${resultId}
    `;
    const resultData = data.rows[0];
    return resultData;
  } catch (error: any) {
    throw new Error(`Error getting results`, {cause: error})
  }
}

export async function fetchResultPages(query: string) {
  noStore();
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM results
      JOIN users ON users.id = results.student_id
      JOIN dictations ON dictations.id = results.dictation_id
      WHERE
        users.role = 'student' AND (
          users.name ILIKE ${`%${query}%`} OR
          dictations.title ILIKE ${`%${query}%`} OR
          dictations.words_count::text ILIKE ${`%${query}%`}
        )
    `;
    const totalPages = Math.ceil(Number(count.rows[0].count) / RESULTS_PER_PAGE);
    return totalPages;
  } catch (error) {
    throw new Error('Failed to fetch total number of dictations', {cause: error});
  }
}


export async function fetchFilteredResultsData(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * RESULTS_PER_PAGE;

  type FilteredResult = {
    id: DictationResult['id'];
    student_image_url: User['image_url'];
    student_name: User['name'];
    dictation_title: Dictation['title'];
    words_count: Dictation['words_count'];
    result_date: DictationResult['date'];
    errors_number: DictationResult['errors_number'];
  };

  try {
    const results = await sql<FilteredResult>`
      SELECT
        results.id,
        users.image_url AS student_image_url,
        users.name AS student_name,
        dictations.title AS dictation_title,
        dictations.words_count,
        results.date AS result_date,
        results.result_errors
      FROM results
      JOIN users ON results.student_id = users.id
      JOIN dictations ON results.dictation_id = dictations.id
      WHERE
        users.name ILIKE ${`%${query}%`} OR
        dictations.title ILIKE ${`%${query}%`} OR
        dictations.words_count::text ILIKE ${`%${query}%`}
      ORDER BY results.date DESC
      LIMIT ${RESULTS_PER_PAGE} OFFSET ${offset}
    `;

    return results.rows;
  } catch (error) {
    throw new Error('Failed to fetch results.', {cause: error});
  }
}
