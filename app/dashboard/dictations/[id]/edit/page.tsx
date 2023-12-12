import Form from '@/app/ui/dictations/edit-form';
import Breadcrumbs from '@/app/ui/dictations/breadcrumbs';
import { fetchTeachers, fetchDictationById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Dictation',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id,
    [ dictation, teachers ] = await Promise.all([
      fetchDictationById(id),
      fetchTeachers(),
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
