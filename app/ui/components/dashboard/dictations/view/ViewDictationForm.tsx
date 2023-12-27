// Import necessary hooks and components
import React, { Suspense } from 'react';
import { DictationWithTeacher, LANGUAGE_CODES } from "@/app/lib/definitions";
import { StartDictation } from "../action-buttons";
import { UserCircleIcon, DocumentTextIcon, LanguageIcon, ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import { getCurrentUserRole } from "@/app/lib/user-actions";
import { retrieveAudioFileUrl } from "@/app/lib/google-cloud-actions";
import LoadingBox from "../../LoadingBox";
import DictationAudio from "../DictationAudio";

export default async function ViewDictationForm({
  dictationWithTeacher,
}: {
  dictationWithTeacher: DictationWithTeacher,
}) {
  const role = await getCurrentUserRole();
  const audioUrl = await retrieveAudioFileUrl(dictationWithTeacher.id, dictationWithTeacher.language_code, dictationWithTeacher.content);

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
            <select disabled aria-describedby="language-code-error" name="language_code" id="language_code" className="peer block rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
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
        <Suspense key={dictationWithTeacher.id} fallback={<LoadingBox />}>
          <div>
            <div className="text-sm font-medium">
              Dictation audio
            </div>
            <Suspense key={dictationWithTeacher.id} fallback={<LoadingBox />}>
              <DictationAudio url={audioUrl} />
            </Suspense>
          </div>
        </Suspense>
      )}

      {role == 'student' && (
        <StartDictation id={dictationWithTeacher.id} />
      )}

    </div>
  );
}
