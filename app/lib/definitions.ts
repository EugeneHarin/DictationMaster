export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'teacher' | 'student';
};

export type DictationsTable = {
  id: string;
  teacher_id: string;
  title: string;
  content: string
  words_count: number;
  audio_file_url: string | null;
  audio_file_exp_date: string | null;
  status: 'draft' | 'published';
  date: string;
};
export type DictationWithTeacher = DictationsTable & Pick<TeachersTable, 'name' | 'image_url'>;

export type TeachersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string | null;
};

export type ResultsTable = {
  id: string;
  student_id: string;
  dictation_id: string;
  result_errors: JSON;
  result_html: string;
  date: string;
};

export type DictationForm = {
  id: string;
  teacher_id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
};

export type AudioFileDataField = {
  audio_file_url: string | null;
  audio_file_exp_date: string | null;
}

export type DictationValidationResult = {
  position: number;
  expectedLetter: string;
  receivedLetter: string;
  inWord: string;
}
