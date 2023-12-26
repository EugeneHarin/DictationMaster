import { fetchResultPages } from "@/app/lib/result-functions/fetch";
import Breadcrumbs from "@/app/ui/components/dashboard/Breadcrumbs";
import Search from "@/app/ui/components/dashboard/Search";
import { CreateDictation } from "@/app/ui/components/dashboard/dictations/action-buttons";
import Pagination from "@/app/ui/components/dashboard/dictations/pagination";
import ResultsTable from "@/app/ui/components/dashboard/results/ResultsTable";
import { lusitana } from "@/app/ui/fonts";
import { DictationsTableSkeleton } from "@/app/ui/skeletons";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'Results',
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
  const totalPages: number = await fetchResultPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Results</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search dictations..." />
      </div>
       <Suspense key={query + currentPage} fallback={<DictationsTableSkeleton />}>
        <ResultsTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}
