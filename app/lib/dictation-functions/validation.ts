import { DictationValidationResult } from "../definitions";

export type State = {
  errorsCount?: number | null;
  message?: string | null;
};

export async function validateDictation(dictationId: string, userInput: string, callback: () => void | undefined = () => {}) {
  const body = {
    dictationId: dictationId,
    userInput: userInput,
  }
  try {
    const validationData = fetch('/api/validate-dictation', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((data: DictationValidationResult) => {
        callback();
        return(data);
      })
  } catch (error) {
    throw new Error(`Failed to validate dictation: ${error}`);
  }

  return({position: 0, expectedLetter: '', receivedLetter: '', inWord: ''});
}
