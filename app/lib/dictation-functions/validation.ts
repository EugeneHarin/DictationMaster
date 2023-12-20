import { DictationWithTeacher, DictationsTable } from "../definitions";

export type State = {
  errorsCount?: number | null;
  message?: string | null;
};

export async function validateDictation(id: string, prevState: State, formData: FormData) {

  const validationData = fetch('/api/validate-dictation', {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log('returned data', data);
    })

  return {
    isValidated: true,
    errorsCount: 0,
    message: 'my message',
  }
}
