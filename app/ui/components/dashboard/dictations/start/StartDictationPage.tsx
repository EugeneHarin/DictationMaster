import { fetchDictationWithTeacher } from "@/app/lib/dictation-functions/fetch";
import { notFound } from "next/navigation";
import { retrieveAudioFileUrl } from "@/app/lib/google-cloud-actions";
import { WriteDictationForm } from "@/app/ui/components/dashboard/dictations/start/WriteDictationForm";
import LoadingBox from "../../LoadingBox";
import { UserCircleIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { Suspense } from "react";
import { DictationWithTeacher } from "@/app/lib/definitions";

export async function StartDictationPage({ dictationId }: { dictationId: string }) {
  const dictationWithTeacher = await fetchDictationWithTeacher(dictationId);
  if (!dictationWithTeacher) notFound();
  const audioFileUrl = await retrieveAudioFileUrl(dictationWithTeacher.id, dictationWithTeacher.content);

  if (!audioFileUrl) notFound();

  return(
    <div className="rounded-md bg-gray-50 p-4 md:p-6 flex flex-col gap-6">
      {/* Teacher Name */}
      <div>
        <label htmlFor="teacher" className="mb-2 block text-sm font-medium">
          Teacher Name
        </label>
        <div className="relative">
          <div className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
            {dictationWithTeacher.name}
          </div>
          <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Dictation Title */}
      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-medium">
          Dictation title
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <div className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
              {dictationWithTeacher.title}
            </div>
            <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
      </div>

      <WriteDictationForm dictationId={dictationWithTeacher.id} audioFileUrl={audioFileUrl} />

    </div>
  );
}
