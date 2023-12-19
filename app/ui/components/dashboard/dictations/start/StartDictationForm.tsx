'use client'

import { UserCircleIcon, DocumentTextIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "../../Button";
import { validateDictation } from "@/app/lib/dictation-functions/validation";
import { DictationWithTeacher } from "@/app/lib/definitions";

export function StartDictationForm({
  dictationWithTeacher,
  audioFileUrl
}: {
  dictationWithTeacher: DictationWithTeacher,
  audioFileUrl: string
}){
  const initialState = { errorsCount: null, message: null };
  const validateDictationWithId = validateDictation.bind(null, dictationWithTeacher);
  const [state, dispatch] = useFormState(validateDictationWithId, initialState);

  return(
    <form action={dispatch} className="rounded-md bg-gray-50 p-4 md:p-6 flex flex-col gap-6">
      {/* Teacher Name */}
      <div>
        <label htmlFor="teacher" className="mb-2 block text-sm font-medium">
          Teacher Name
        </label>
        <div className="relative">
          <div className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500">
            {dictationWithTeacher?.name}
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
              {dictationWithTeacher?.title}
            </div>
            <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
      </div>

      <div>
        <audio controls>
          <source src={audioFileUrl} type="audio/mp3" />
        </audio>
      </div>

      {/* Field to write dictation */}
      <div className="mb-4">
        <label htmlFor="content" className="mb-2 block text-sm font-medium">
          Write a content
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <textarea
              id="content"
              name="content"
              rows={5}
              placeholder="Write dictation here"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="content-error"
            />
          </div>
        </div>
      </div>

      <SubmitButton />

    </form>
  );
}

function SubmitButton() {
  'use client'

  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="max-w-full w-32 flex justify-center" aria-disabled={pending}>
      Submit <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
