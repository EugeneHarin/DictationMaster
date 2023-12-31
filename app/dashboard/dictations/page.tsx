import Pagination from '@/app/ui/components/dashboard/dictations/pagination';
import Search from '@/app/ui/components/dashboard/Search';
import Table from '@/app/ui/components/dashboard/dictations/DictationsTable';
import { CreateDictation } from '@/app/ui/components/dashboard/dictations/action-buttons';
import { lusitana } from '@/app/ui/fonts';
import { DictationsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchDictationsPages } from '@/app/lib/dictation-functions/fetch';
import { Metadata } from 'next';
import { getCurrentUserRole } from "@/app/lib/user-actions";

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
  const query: string = searchParams?.query || '';
  const currentPage: number = Number(searchParams?.page) || 1;
  const userRole = await getCurrentUserRole();
  const totalPages: number = await (userRole == 'student' ? fetchDictationsPages(query, 'published') : fetchDictationsPages(query));

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
