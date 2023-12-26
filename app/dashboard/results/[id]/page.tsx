import { retrieveAudioFileUrl } from "@/app/lib/google-cloud-actions";
import fetchResultData from "@/app/lib/result-functions/fetch";
import { getResultErrorsHtml } from "@/app/lib/utils";
import Breadcrumbs from '@/app/ui/components/dashboard/Breadcrumbs';
import DictationAudio from "@/app/ui/components/dashboard/dictations/DictationAudio";
import { DocumentTextIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Dictation',
};

export default async function Page({ params }: { params: { id: string } }) {

  const resultId = params.id;
  const dictationResultData = await fetchResultData(resultId);
  if (!dictationResultData) notFound();
  const audioUrl = await retrieveAudioFileUrl(dictationResultData.dictation_id, dictationResultData.dictation_content);
  const resultWithErrorsHtml = getResultErrorsHtml(dictationResultData.result_errors);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Results', href: '/dashboard/results' },
          {
            label: dictationResultData.dictation_title,
            href: `/dashboard/dictations/${resultId}/edit`,
            active: true,
          },
        ]}
      />

      <div className="rounded-md bg-gray-50 p-4 md:p-6 flex flex-col gap-6">
        {/* Student Name */}
        <div>
          <div className="text-sm font-medium">
            Student Name
          </div>
          <div className="relative">
            <div className="peer w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
              {dictationResultData.student_name}
            </div>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Dictation Title */}
        <div>
          <div className="text-sm font-medium">
            Dictation title
          </div>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <div className="peer w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
                {dictationResultData.dictation_title}
              </div>
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Dictation audio */}
        <div>
          <div className="text-sm font-medium">
            Dictation audio
          </div>
          <DictationAudio url={audioUrl}/>
        </div>

        {/* Dictation Content */}
        <div>
          <div className="text-sm font-medium">
            Dictation text
          </div>
          <div className="relative mt-2 rounded-md">
            <div className="peer w-full rounded-md border border-gray-200 p-4 text-base outline-2 placeholder:text-gray-500">
              {dictationResultData.dictation_content}
            </div>
          </div>
        </div>

        {/* User Input Errors */}
        <div>
          <div className="text-sm font-medium">
            Your input
          </div>
          <div className="relative mt-2 rounded-md">
            <div className="peer w-full rounded-md border border-gray-200 p-4 text-base outline-2 placeholder:text-gray-500" dangerouslySetInnerHTML={{__html: resultWithErrorsHtml}}></div>
          </div>
        </div>

        {/* User Errors Number */}
        <div>
          {dictationResultData.errors_count > 0 ?
            <div className="py-2 px-4 rounded-full bg-red-200 text-base font-medium inline-block">
              You have <span className="bg-red-500 text-white px-1.5">{dictationResultData.errors_count}</span> errors
            </div>
          :
            <div className="py-2 px-4 rounded-full bg-green-200 inline-block">
              Congratulations, you have no errors!
            </div>
          }
        </div>

        <div>

        </div>

      </div>

    </main>
  );
}
