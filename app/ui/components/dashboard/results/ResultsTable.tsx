import { fetchFilteredResultsData } from "@/app/lib/result-functions/fetch";
import { formatDateToLocal, } from '@/app/lib/utils';
import { ViewResult } from '@/app/ui/components/dashboard/dictations/action-buttons';
import clsx from "clsx";
import Image from 'next/image';

export default async function ResultsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const filteredResultsData = await fetchFilteredResultsData(query, currentPage);

  if (filteredResultsData.length == 0) return (
    <div className="my-4 text-lg">Nothing found</div>
  );

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {filteredResultsData?.map(result => (
              <div
                key={result.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    {result.student_image_url && (
                      <div className="mb-2 flex items-center">
                        <Image
                          src={result.student_image_url}
                          className="mr-2 rounded-full"
                          width={28}
                          height={28}
                          alt={`${result.student_name}'s profile picture`}
                        />
                        <p>{result.student_name}</p>
                      </div>
                    )}
                    <p className="text-sm text-gray-500"><b>{result.dictation_title}</b></p>
                  </div>
                  <div>
                    <div className="mb-3">Accuracy</div>
                    <div className={clsx(result.correctness_percentage < 90 ? 'text-red-600 font-bold' : 'text-green-600 font-bold')}>
                      {result.correctness_percentage}%
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {result.words_count} <span className="md:hidden">words</span>
                    </p>
                    <p>{formatDateToLocal(result.result_date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <ViewResult resultId={result.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Student
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Title
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Words Count
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Accuracy
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredResultsData?.map(result => (
                <tr
                  key={result.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {result.student_image_url && (
                      <div className="flex items-center gap-3">
                        <Image
                          src={result.student_image_url}
                          className="rounded-full"
                          width={28}
                          height={28}
                          alt={result.student_name}
                        />
                        <p>{result.student_name}</p>
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <b>{result.dictation_title}</b>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {result.words_count} <span className="md:hidden">words</span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(result.result_date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className={clsx(result.correctness_percentage < 90 ? 'text-red-600 font-bold' : 'text-green-600 font-bold')}>
                      {result.correctness_percentage}%
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <ViewResult resultId={result.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
