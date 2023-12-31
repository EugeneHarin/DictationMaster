import { sql } from "@vercel/postgres";
import type { QueryResult, QueryResultRow } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { Dictation, DictationResult, DictationResultAllData, User } from "../definitions";
import { getCurrentUserData } from "../user-actions";

const RESULTS_PER_PAGE = 6;

export default async function fetchResultData(resultId: string) {
  noStore();
  try {
    const data = await sql<DictationResultAllData>`
      SELECT
        results.id AS result_id,
        results.student_id,
        results.dictation_id,
        results.result_errors::json,
        results.errors_count,
        results.wrong_characters_count,
        results.correctness_percentage,
        results.date AS result_date,
        dictations.title AS dictation_title,
        dictations.language_code,
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
    return data.rows[0];
  } catch (error: any) {
    throw new Error(`Error getting results`, {cause: error})
  }
}

export async function fetchResultPages(query: string) {
  noStore();
  try {
    const currentUserData = await getCurrentUserData();
    let data: QueryResult<QueryResultRow>;
    if (currentUserData.role == 'student') {
      data = await sql`
        SELECT COUNT(*)
        FROM results
        JOIN users ON users.id = results.student_id
        JOIN dictations ON dictations.id = results.dictation_id
        WHERE
          users.name = ${currentUserData.name} AND
          users.role = 'student' AND (
            users.name ILIKE ${`%${query}%`} OR
            dictations.title ILIKE ${`%${query}%`} OR
            dictations.words_count::text ILIKE ${`%${query}%`}
          )
      `;
    } else {
      data = await sql`
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
    }
    const totalPages = Math.ceil(Number(data.rows[0].count) / RESULTS_PER_PAGE);
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

  type FilteredResult = {
    id: DictationResult['id'];
    student_image_url: User['image_url'];
    student_name: User['name'];
    dictation_title: Dictation['title'];
    words_count: Dictation['words_count'];
    result_date: DictationResult['date'];
    correctness_percentage: DictationResult['correctness_percentage'];
  };

  try {
    const offset = (currentPage - 1) * RESULTS_PER_PAGE;
    const currentUserData = await getCurrentUserData();
    let data: QueryResult<FilteredResult>;
    if (currentUserData.role == 'student') {

      data = await sql`
        SELECT
          results.id,
          users.image_url AS student_image_url,
          users.name AS student_name,
          dictations.title AS dictation_title,
          dictations.words_count,
          results.date AS result_date,
          results.result_errors,
          results.correctness_percentage
        FROM results
        JOIN users ON results.student_id = users.id
        JOIN dictations ON results.dictation_id = dictations.id
        WHERE
          users.name = ${currentUserData.name} AND (
            dictations.title ILIKE ${`%${query}%`} OR
            dictations.words_count::text ILIKE ${`%${query}%`}
          )
        ORDER BY results.date DESC
        LIMIT ${RESULTS_PER_PAGE} OFFSET ${offset}
      `;
    } else {
      data = await sql`
        SELECT
          results.id,
          users.image_url AS student_image_url,
          users.name AS student_name,
          dictations.title AS dictation_title,
          dictations.words_count,
          results.date AS result_date,
          results.result_errors,
          results.correctness_percentage
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
    }
    return data.rows;
  } catch (error) {
    throw new Error('Failed to fetch results.', {cause: error});
  }
}
