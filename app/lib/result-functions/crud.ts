import { sql } from "@vercel/postgres";
import type DiffMatchPatch from 'diff-match-patch';
import { unstable_noStore as noStore } from "next/cache";
import { DictationResult, HTTPResponseError } from "../definitions";
import { getCurrentUserData } from "../user-actions";

type UnknownError = HTTPResponseError & { _t: 'unknown-error' };
type NeonDbError = HTTPResponseError & { _t: 'neon-db-error' };
type UserDataUndefinedError = HTTPResponseError & { _t: 'user-data-undefined-error'};
type CreateDictationResultSuccess = { _t: 'success', result: string }
type UndefinedResultIdError = HTTPResponseError & { _t: 'undefined-result-id-error'};
type CreateDictationResultResult =
  | UnknownError
  | NeonDbError
  | UserDataUndefinedError
  | CreateDictationResultSuccess
  | UndefinedResultIdError

export async function createDictationResult(dictationId: string, resultErrors: DiffMatchPatch.Diff[], originalText: string): Promise<CreateDictationResultResult> {
  try {
    noStore();
    const date = new Date().toISOString();
    const userData = await getCurrentUserData();
    if (userData === undefined) return { _t: "user-data-undefined-error", message: 'User data is undefined' };
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
    // revalidatePath Will not work if called from API route for some reason
    // revalidatePath('/dashboard/results');
    const resultId: string | undefined = response?.rows?.[0]?.id;
    if (resultId === undefined) return { _t: "undefined-result-id-error", message: 'Result ID is undefined after DB INSERT query' };
    return { _t: "success", result: resultId };
  } catch (error: unknown) {
    if (typeof error == 'object' && error !== null && 'name' in error && error.name == 'NeonDbError') {
      const errorCodeText = 'code' in error && error?.code && typeof error.code == 'string' ? ' Error code: ' + error.code : '';
      return {
        _t: "neon-db-error",
        message: 'Database error creating dictation result',
        cause: 'message' in error && error?.message && typeof error.message == 'string' ? error.message + errorCodeText : 'Unknown NeonDbError Error' + errorCodeText
      };
    }
    return { _t: "unknown-error", message: 'Unknown error creating dictation result', cause: error };
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
