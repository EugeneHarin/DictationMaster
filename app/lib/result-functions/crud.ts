import { sql } from "@vercel/postgres";
import type DiffMatchPatch from 'diff-match-patch';
import { revalidatePath } from "next/cache";
import { getCurrentUserData } from "../user-actions";
import { DictationResult } from "../definitions";

export async function createDictationResult(dictationId: string, resultErrors: DiffMatchPatch.Diff[], resultHtml: string) {
  const date = new Date().toISOString();
  const userData = await getCurrentUserData();
  const studentId = userData.id;
  const resultErrorsJSON = JSON.stringify(resultErrors);

  try {
    const response = await sql`
      INSERT INTO results(student_id, dictation_id, result_errors, result_html, date)
      VALUES (${studentId},${dictationId},${resultErrorsJSON},${resultHtml},${date})
      RETURNING id;
    `;
    const resultId = response.rows[0].id;
    revalidatePath('/dashboard/results');
    return resultId;
  } catch (error: any) {
    return {
      errors: {
        databaseError: error.message
      },
      message: 'Database Error: Failed to Create Dictation.',
    };
  }
}

export async function getDictationResult(dictationId: string, studentId: string) {
  try {
    const data = await sql`
      SELECT *
      FROM results
      WHERE
        result.dictation_id = ${dictationId} AND
        result.student_id = ${studentId};
    `;
    const results = data.rows as DictationResult[];
    return results;

  } catch (error: any) {
    throw new Error(`Error getting results`, error);
  }
}
