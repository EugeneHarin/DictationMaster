import Breadcrumbs from "@/app/ui/components/dashboard/Breadcrumbs";
import { Metadata } from "next";
import { StartDictationPage } from "@/app/ui/components/dashboard/dictations/start/StartDictationPage";
import { Suspense } from "react";
import LoadingBox from "@/app/ui/components/dashboard/LoadingBox";

export const metadata: Metadata = {
  title: 'Start Dictation',
};

export default async function Page({ params }: { params: { id: string } }) {
  return(
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Dictations', href: '/dashboard/dictations' },
          {
            label: 'Start Dictation',
            href: `/dashboard/dictations/${params.id}/start`,
            active: true,
          },
        ]}
      />
      <Suspense key={params.id} fallback={<LoadingBox />}>
        <StartDictationPage id={params.id} />
      </Suspense>
    </main>
  );
};
