import Pagination from '@/app/ui/dictations/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/dictations/table';
import { CreateDictation } from '@/app/ui/dictations/buttons';
import { lusitana } from '@/app/ui/fonts';
import { DictationsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchDictationsPages } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dictations',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string,
    page?: string,
  };
}) {
  const query: string = searchParams?.query || '',
        currentPage: number = Number(searchParams?.page) || 1,
        totalPages: number = await fetchDictationsPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Dictations</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search dictations..." />
        <CreateDictation />
      </div>
       <Suspense key={query + currentPage} fallback={<DictationsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
