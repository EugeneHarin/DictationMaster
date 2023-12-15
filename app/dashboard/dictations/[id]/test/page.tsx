import { fetchDictationById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/dictations/breadcrumbs";
import TestDictationForm from "@/app/ui/dictations/test-form";
import LoadingBox from "@/app/ui/loading-box";
import { Metadata } from "next";
import { Suspense } from "react";

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
          { label: 'Dictations', href: '/dashboard/dictations' },
          {
            label: 'Test Dictation',
            href: `/dashboard/dictations/${id}/test`,
            active: true,
          },
        ]}
      />
      <Suspense key={id} fallback={<LoadingBox />}>
        <TestDictationForm dictation={dictation} />
      </Suspense>
    </main>
  );
};
