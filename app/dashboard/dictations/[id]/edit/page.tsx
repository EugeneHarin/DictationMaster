import Form from '@/app/ui/dictations/EditDictationForm';
import Breadcrumbs from '@/app/ui/dictations/Breadcrumbs';
import { fetchAllTeachers } from "@/app/lib/teacher-functions/fetch";
import { fetchDictationById } from '@/app/lib/dictation-functions/fetch';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Dictation',
};

export default async function Page({ params }: { params: { id: string } }) {

  const id = params.id,
    [ dictation, teachers ] = await Promise.all([
      fetchDictationById(id),
      fetchAllTeachers(),
    ]);

    if (!dictation) {
      notFound();
    }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Dictations', href: '/dashboard/dictations' },
          {
            label: 'Edit Dictation',
            href: `/dashboard/dictations/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form dictation={dictation} teachers={teachers} />
    </main>
  );
}
