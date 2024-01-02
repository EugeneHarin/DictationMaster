'use server'

import { LANGUAGE_CODES } from "@/app/lib/definitions";
import { fetchDictationWithTeacher } from "@/app/lib/dictation-functions/fetch";
import { getCurrentUserRole } from "@/app/lib/user-actions";
import { ChatBubbleBottomCenterTextIcon, DocumentTextIcon, LanguageIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { notFound } from "next/navigation";
import { Suspense } from 'react';
import LoadingBox from "../../LoadingBox";
import DictationAudio from "../DictationAudio";
import { StartDictation } from "../action-buttons";

export default async function ViewDictationPage({ id }: { id: string }) {
  const dictationWithTeacher = await fetchDictationWithTeacher(id);
  if (!dictationWithTeacher) notFound();

  const role = await getCurrentUserRole();

  return (
    <div className="rounded-md bg-gray-50 p-4 md:p-6 flex flex-col gap-6">
      {/* Teacher Name */}
      <div>
        <div className="text-sm font-medium">
          Teacher Name
        </div>
        <div className="relative">
          <div className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
            {dictationWithTeacher?.name}
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
          <div className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
            {dictationWithTeacher?.title}
          </div>
          <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 focus:text-gray-900" />
        </div>
      </div>

      {/* Dictation Language */}
      <div className="mb-2">
        <label htmlFor="title" className="text-sm font-medium">
          Dictation language
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <select disabled defaultValue={dictationWithTeacher.language_code} aria-describedby="language-code-error" name="language_code" id="language_code" className="peer block rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
              {LANGUAGE_CODES.map(language_code =>
                  <option value={language_code} key={language_code}>{language_code}</option>
              )}
            </select>
            <LanguageIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
      </div>

      {/* Number of words */}
      <div>
        <div className="text-sm font-medium">
          Number of words
        </div>
        <div className="relative mt-2 rounded-md">
          <div className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
            {dictationWithTeacher?.words_count}
          </div>
          <ChatBubbleBottomCenterTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 focus:text-gray-900" />
        </div>
      </div>

      {/* Dictation Speed */}
      <div className="mb-4">
        <label htmlFor="speed" className="mb-2 block text-sm font-medium">
          Dictation speed
        </label>
        <div className="mt-2 rounded-md">
          <input disabled type="range" min="0.5" max="1" step="0.1" id="speed" name="speed" defaultValue={dictationWithTeacher.speed} aria-describedby="content-speed"/>
          <div>{dictationWithTeacher.speed}</div>
        </div>
      </div>

      {role == 'teacher' && (
        <div>
          <div className="text-sm font-medium">
            Dictation content
          </div>
          <div className="relative mt-2 rounded-md">
            <div className="block w-full rounded-md border border-gray-200 py-2 px-4 text-sm outline-2 placeholder:text-gray-500">
              {dictationWithTeacher.content}
            </div>
          </div>
        </div>
      )}

      {role == 'teacher' && (
        <div>
          <div className="text-sm font-medium">
            Dictation audio
          </div>
          <Suspense key={dictationWithTeacher.id} fallback={<LoadingBox className="w-fit mt-2" text="" />}>
            <DictationAudio id={dictationWithTeacher.id} content={dictationWithTeacher.content} language_code={dictationWithTeacher.language_code} speed={dictationWithTeacher.speed} />
          </Suspense>
        </div>
      )}

      {role == 'student' && (
        <StartDictation id={dictationWithTeacher.id} />
      )}

    </div>
  );
}
