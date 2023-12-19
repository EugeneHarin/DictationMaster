// Import necessary hooks and components
import React from 'react';
import { DictationWithTeacher } from "@/app/lib/definitions";
import { StartDictation } from "../action-buttons";
import { UserCircleIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { getCurrentUserRole } from "@/app/lib/user-actions";

export default async function ViewDictationForm({
  dictationWithTeacher,
  audioFileUrl
}: {
  dictationWithTeacher: DictationWithTeacher,
  audioFileUrl: string
}) {
  const role = await getCurrentUserRole();

  return (
    <div className="rounded-md bg-gray-50 p-4 md:p-6 flex flex-col gap-6">
      {/* Teacher Name */}
      <div>
        <div className="mb-2 block text-sm font-medium">
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
        <div className="mb-2 block text-sm font-medium">
          Dictation title
        </div>
        <div className="relative mt-2 rounded-md">
          <div className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
            {dictationWithTeacher?.title}
          </div>
          <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 focus:text-gray-900" />
        </div>
      </div>

      {role == 'teacher' && (
        <div>
          <div className="mb-2 block text-sm font-medium">
            Dictation content
          </div>
          <div className="relative mt-2 rounded-md">
            <div className="block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500">
              {dictationWithTeacher.content}
            </div>
          </div>
        </div>
      )}

      {role == 'teacher' && (
        <div>
          <div className="mb-2 block text-sm font-medium">
            Dictation audio
          </div>
          <audio className="mt-2" controls>
            <source src={audioFileUrl} type="audio/mp3" />
          </audio>
        </div>
      )}

      {role == 'student' && (
        <StartDictation id={dictationWithTeacher.id} />
      )}

    </div>
  );
}
