import type DiffMatchPatch from 'diff-match-patch';

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
      .then(response => response.json())
      .then(
        ({ resultId }: { resultId: string }) => {
          callback(resultId);
          return (resultId);
        })
  } catch (error) {
    throw new Error(`Failed to validate dictation: ${error}`);
  }
}
