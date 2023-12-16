export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type DictationsTable = {
  id: string;
  teacher_id: string;
  image_url: string;
  name: string;
  title: string;
  content: string
  words_count: number;
  status: 'draft' | 'published';
  date: string;
};

export type TeacherField = {
  id: string;
  name: string;
};

export type DictationForm = {
  id: string;
  teacher_id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
};
