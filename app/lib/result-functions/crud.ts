import { sql } from "@vercel/postgres";
import type DiffMatchPatch from 'diff-match-patch';
import { revalidatePath } from "next/cache";
import { getCurrentUserData } from "../user-actions";
import { DictationResult } from "../definitions";

export async function createDictationResult(dictationId: string, resultErrors: DiffMatchPatch.Diff[]) {
  const date = new Date().toISOString();
  const userData = await getCurrentUserData();
  const studentId = userData.id;
  const resultErrorsJSON = JSON.stringify(resultErrors);
  const errorsCount = resultErrors.reduce((errCounter, currentElement) => currentElement[0] !== 0 ? errCounter += currentElement[1].length : errCounter, 0);

  try {
    const response = await sql`
      INSERT INTO results(student_id, dictation_id, result_errors, errors_count, date)
      VALUES (${studentId},${dictationId},${resultErrorsJSON},${errorsCount},${date})
      RETURNING id;
    `;
    const resultId = response.rows[0].id as string;
    revalidatePath('/dashboard/results');
    return resultId;
  } catch (error: any) {
    throw new Error('Database Error: Failed to Create result', {cause: error});
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
    throw new Error('Database Error: Failed to get the results', {cause: error});
  }
}
