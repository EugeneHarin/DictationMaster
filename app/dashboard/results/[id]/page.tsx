'use server'

import Breadcrumbs from '@/app/ui/components/dashboard/Breadcrumbs';
import ResultSinglePage from "@/app/ui/components/dashboard/results/single/ResultSinglePage";
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Edit Dictation',
  }
}

export default async function Page({ params }: { params: { id: string } }) {

  const resultId = params.id;
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Results', href: '/dashboard/results' },
          {
            label: 'Single Dictation',
            href: `/dashboard/dictations/${resultId}/edit`,
            active: true,
          },
        ]}
      />
      <ResultSinglePage resultId={resultId} />
    </main>
  );
}
