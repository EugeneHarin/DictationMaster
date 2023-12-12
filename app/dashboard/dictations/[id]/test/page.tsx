import { fetchDictationById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/dictations/breadcrumbs";
import TestDictationForm from "@/app/ui/dictations/test-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Test Dictation',
};

export default async function page({ params }: { params: { id: string } }) {
  const id = params.id;
  const dictation = await fetchDictationById(id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/dictations' },
          {
            label: 'Test Invoice',
            href: `/dashboard/dictations/${id}/test`,
            active: true,
          },
        ]}
      />
      <TestDictationForm dictation={dictation} />
      <div>Test Dictation</div>
    </main>
  );
};
