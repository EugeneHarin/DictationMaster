import type DiffMatchPatch from 'diff-match-patch';

export type State = {
  errorsCount?: number | null;
  message?: string | null;
};

export async function validateDictation(dictationId: string, userInput: string, callback: (html: string, errors: DiffMatchPatch.Diff[], resultId: string) => void | undefined = (data) => {}) {
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
      .then(response => response.json())
      .then(
        ({html, errors, resultId}: {
          html: string,
          errors: DiffMatchPatch.Diff[],
          resultId: string
        }) => {
          callback(html, errors, resultId);
          return ({ html, errors, resultId });
        })
  } catch (error) {
    throw new Error(`Failed to validate dictation: ${error}`);
  }
}
