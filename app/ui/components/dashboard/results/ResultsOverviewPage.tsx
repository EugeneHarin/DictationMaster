import { fetchResultPages } from "@/app/lib/result-functions/fetch";
import { DictationsTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import Search from "../Search";
import Pagination from "../dictations/pagination";
import ResultsTable from "./ResultsTable";

export default async function ResultsOverviewPage({
  searchParams,
}: {
  searchParams?: {
    query?: string,
    page?: string,
  };
}) {

  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchResultPages(query);

  return(
    <>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search dictations..." />
      </div>
        <Suspense key={query + currentPage} fallback={<DictationsTableSkeleton />}>
        <ResultsTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
