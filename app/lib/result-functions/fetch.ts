import { sql } from "@vercel/postgres";
import { DictationResultAllData } from "../definitions";

export default async function fetchResultData(resultId: string) {
  try {
    const data = await sql`
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
    const results = data.rows[0] as DictationResultAllData;
    return results;
  } catch (error: any) {
    throw new Error(`Error getting results`, {cause: error})
  }
}
