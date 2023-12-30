import { sql } from "@vercel/postgres";
import type DiffMatchPatch from 'diff-match-patch';
import { unstable_noStore as noStore } from "next/cache";
import { DictationResult } from "../definitions";
import { getCurrentUserData } from "../user-actions";

export async function createDictationResult(dictationId: string, resultErrors: DiffMatchPatch.Diff[], originalText: string) {
  noStore();
  try {
    const date = new Date().toISOString();
    const userData = await getCurrentUserData();
    const studentId = userData.id;
    const resultErrorsJSON = JSON.stringify(resultErrors);
    const wrongCharsCount = resultErrors.reduce((errCounter, currentElement) => currentElement[0] !== 0 ? errCounter += currentElement[1].length : errCounter, 0);
    const errorsCount = resultErrors.reduce((errCounter, currentElement, i, errorsArray) =>
      errorsArray[i][0] !== 0 && (!errorsArray[i+1] || errorsArray[i+1] && errorsArray[i+1][0] == 0)
      ? errCounter += 1
      : errCounter, 0);
    const correctnessPercentage = 100 - (wrongCharsCount * 100 / originalText.length);

    const response = await sql`
      INSERT INTO results(student_id, dictation_id, result_errors, errors_count, wrong_characters_count, correctness_percentage, date)
      VALUES (${studentId},${dictationId},${resultErrorsJSON},${errorsCount}, ${wrongCharsCount}, ${correctnessPercentage}, ${date})
      RETURNING id;
    `;
    const resultId: string = response.rows[0].id;
    // Will not work if called from API route for some reason
    // revalidatePath('/dashboard/results');
    return resultId;
  } catch (error: any) {
    throw new Error('Failed to Create result', {cause: error});
  }
}

export async function getDictationResult(dictationId: string, studentId: string) {
  noStore();
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
    throw new Error('Failed to get the results', {cause: error});
  }
}
