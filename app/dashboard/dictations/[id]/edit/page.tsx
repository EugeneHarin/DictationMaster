import Form from '@/app/ui/components/dashboard/dictations/edit/EditDictationForm';
import Breadcrumbs from '@/app/ui/components/dashboard/Breadcrumbs';
import { fetchAllTeachers } from "@/app/lib/teacher-functions/fetch";
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getDictation } from "@/app/lib/dictation-functions/crud";

export const metadata: Metadata = {
  title: 'Edit Dictation',
};

export default async function Page({ params }: { params: { id: string } }) {

  const id = params.id,
    [ dictation, teachers ] = await Promise.all([
      getDictation(id),
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
