import type DiffMatchPatch from 'diff-match-patch';

export const LANGUAGE_CODES = ['en-US', 'uk-UA'] as const;
export const DICTATION_SPEEDS = [0.5, 0.6, 0.7, 0.8, 0.9, 1] as const;

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'teacher' | 'student';
  image_url: string | null;
};

export type Dictation = {
  id: string;
  teacher_id: string;
  title: string;
  language_code: typeof LANGUAGE_CODES[number];
  content: string
  words_count: number;
  audio_file_url: string | null;
  audio_file_exp_date: string | null;
  status: 'draft' | 'published';
  speed: typeof DICTATION_SPEEDS[number];
  date: string;
};
export type DictationWithTeacher = Dictation & Pick<User, 'name' | 'image_url'>;

export type DictationResult = {
  id: string;
  student_id: string;
  dictation_id: string;
  result_errors: DiffMatchPatch.Diff[];
  errors_count: number;
  wrong_characters_count: number;
  correctness_percentage: number;
  date: string;
};

export type DictationResultAllData = {
  result_id: DictationResult['id'];
  student_id: DictationResult['student_id'];
  dictation_id: DictationResult['dictation_id'];
  result_errors: DictationResult['result_errors'];
  errors_count: DictationResult['errors_count'];
  wrong_characters_count: DictationResult['wrong_characters_count'];
  correctness_percentage: DictationResult['correctness_percentage'];
  result_date: DictationResult['date'];
  dictation_title: Dictation['title'];
  language_code: Dictation['language_code'];
  dictation_content: Dictation['content'];
  dictation_status: Dictation['status'];
  speed: Dictation['speed'];
  student_name: User['name'];
  user_email: User['email'];
  user_image_url: User['image_url'];
}

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
