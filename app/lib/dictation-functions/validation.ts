import { DictationWithTeacher, DictationsTable } from "../definitions";

export type State = {
  errorsCount?: number | null;
  message?: string | null;
};

export async function validateDictation(dictation: DictationWithTeacher | undefined, prevState: State, formData: FormData) {

  return {
    errorsCount: 0,
    message: 'my message',
  }
}
