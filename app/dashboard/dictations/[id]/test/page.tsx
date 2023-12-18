import { fetchDictationById } from "@/app/lib/dictation-functions/fetch";
import Breadcrumbs from "@/app/ui/components/dashboard/Breadcrumbs";
import ViewDictationForm from "@/app/ui/components/dashboard/dictations/test/ViewDictationForm";
import LoadingBox from "@/app/ui/components/dashboard/LoadingBox";
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
        <ViewDictationForm dictation={dictation} />
      </Suspense>
    </main>
  );
};
