import Breadcrumbs from "@/app/ui/components/dashboard/Breadcrumbs";
import LoadingBox from "@/app/ui/components/dashboard/LoadingBox";
import ResultsOverviewPage from "@/app/ui/components/dashboard/results/ResultsOverviewPage";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'Results',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Results', href: '/dashboard/results', active: true },
        ]}
      />
      <Suspense fallback={<LoadingBox />}>
        <ResultsOverviewPage />
      </Suspense>
    </main>
  )
}
