import Breadcrumbs from "@/app/ui/components/dashboard/Breadcrumbs";
import ViewDictationPage from "@/app/ui/components/dashboard/dictations/view/ViewDictationPage";
import LoadingBox from "@/app/ui/components/dashboard/LoadingBox";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'View Dictation',
};

export default async function page({ params }: { params: { id: string } }) {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Dictations', href: '/dashboard/dictations' },
          {
            label: 'View Dictation',
            href: `/dashboard/dictations/${params.id}`,
            active: true,
          },
        ]}
      />
      <Suspense key={params.id} fallback={<LoadingBox />}>
        <ViewDictationPage id={params.id} />
      </Suspense>
    </main>
  );
};
