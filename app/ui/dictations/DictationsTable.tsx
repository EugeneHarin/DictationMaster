import Image from 'next/image';
import { UpdateDictation, DeleteDictation, ViewDictation, StartDictation } from '@/app/ui/dictations/buttons';
import DictationStatus from '@/app/ui/dictations/DictationStatus';
import { formatDateToLocal, } from '@/app/lib/utils';
import { fetchFilteredDictations } from '@/app/lib/dictation-functions/fetch';
import { getCurrentUserRole } from "@/app/lib/user-actions";

export default async function DictationsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const dictations = await fetchFilteredDictations(query, currentPage);
  const userRole = await getCurrentUserRole();

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {dictations?.map((dictation) => (
              <div
                key={dictation.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    {dictation.image_url && (
                      <div className="mb-2 flex items-center">
                        <Image
                          src={dictation.image_url}
                          className="mr-2 rounded-full"
                          width={28}
                          height={28}
                          alt={`${dictation.name}'s profile picture`}
                        />
                        <p>{dictation.name}</p>
                      </div>
                    )}
                    <p className="text-sm text-gray-500"><b>{dictation.title}</b></p>
                  </div>
                  <DictationStatus status={dictation.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {dictation.words_count}
                    </p>
                    <p>{formatDateToLocal(dictation.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    {userRole == 'teacher' && (
                      <>
                      <ViewDictation id={dictation.id} />
                      <UpdateDictation id={dictation.id} />
                      <DeleteDictation id={dictation.id} />
                      </>
                    )}
                    {userRole == 'student' && (
                      <>
                      <StartDictation id={dictation.id} />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Author
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
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {dictations?.map((dictation) => (
                <tr
                  key={dictation.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {dictation.image_url && (
                      <div className="flex items-center gap-3">
                        <Image
                          src={dictation.image_url}
                          className="rounded-full"
                          width={28}
                          height={28}
                          alt={dictation.name}
                        />
                        <p>{dictation.name}</p>
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <b>{dictation.title}</b>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {dictation.words_count}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(dictation.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <DictationStatus status={dictation.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                    {userRole == 'teacher' && (
                      <>
                      <ViewDictation id={dictation.id} />
                      <UpdateDictation id={dictation.id} />
                      <DeleteDictation id={dictation.id} />
                      </>
                    )}
                    {userRole == 'student' && (
                      <>
                      <StartDictation id={dictation.id} />
                      </>
                    )}
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
