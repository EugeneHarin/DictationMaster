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
  content: string
  words_count: number;
  audio_file_url: string | null;
  audio_file_exp_date: string | null;
  status: 'draft' | 'published';
  date: string;
};
export type DictationWithTeacher = Dictation & Pick<User, 'name' | 'image_url'>;

export type DictationResult = {
  id: string;
  student_id: string;
  dictation_id: string;
  result_errors: Array<[Number, string]>;
  errors_number: number;
  result_html: string;
  date: string;
};

export type DictationResultAllData = {
  result_id: DictationResult['id'];
  student_id: DictationResult['student_id'];
  dictation_id: DictationResult['dictation_id'];
  result_errors: DictationResult['result_errors'];
  result_html: DictationResult['result_html'];
  result_date: DictationResult['date'];
  dictation_title: Dictation['title'],
  dictation_content: Dictation['content'],
  dictation_status: Dictation['status'],
  student_name: User['name'],
  user_email: User['email'],
  user_image_url: User['image_url'],
}

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
