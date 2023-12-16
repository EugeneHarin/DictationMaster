import Form from '@/app/ui/dictations/CreateDictationForm';
import Breadcrumbs from '@/app/ui/dictations/Breadcrumbs';
import { fetchAllTeachers } from '@/app/lib/teacher-functions/fetch';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Dictation',
};


export default async function Page() {
  const teachers = await fetchAllTeachers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Dictation', href: '/dashboard/dictations' },
          {
            label: 'Create Dictation',
            href: '/dashboard/dictations/create',
            active: true,
          },
        ]}
      />
      <Form teachers={teachers} />
    </main>
  );
}
