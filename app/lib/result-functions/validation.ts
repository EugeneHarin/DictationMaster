import type DiffMatchPatch from 'diff-match-patch';
import { HTTPResponseError } from '../definitions';

export type State = {
  errorsCount?: number | null;
  message?: string | null;
};

export async function validateDictation(dictationId: string, userInput: string, callback: (resultId: string) => void | undefined = (data) => {}) {
  const body = {
    dictationId: dictationId,
    userInput: userInput,
  }
  try {
    fetch('/api/validate-dictation', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then((error: HTTPResponseError) => {
            console.error(error.message, error.cause);
            throw new Error('Error validating dictation', { cause: error.cause });
          });
        }
        return response.json();
      })
      .then(({ result }: { result: string }) => {
          callback(result);
          return (result);
      })
  } catch (error) {
    throw new Error(`Failed to validate dictation: ${error}`);
  }
}
