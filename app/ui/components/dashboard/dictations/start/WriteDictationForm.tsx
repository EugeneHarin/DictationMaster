'use client'

import { clearCachesByServerAction } from "@/app/lib/google-cloud-modules/cache";
import { validateDictation } from "@/app/lib/result-functions/validation";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from "react";
import { Button } from "../../Button";
import DictationAudio from "../DictationAudio";

export function WriteDictationForm({
  dictationId,
  audioFileUrl
}: {
  dictationId: string;
  audioFileUrl: string;
}){
  const router = useRouter();
  const [submitButtonDisabledState, setSubmitButtonDisabledState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [textareaDisabledState, setTextareaDisabledState] = useState(false);

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (false == submitButtonDisabledState) {
      const formData = new FormData(event.currentTarget);
      const textareaValue = formData.get('content') as string;
      if (textareaValue.length) {
        setTextareaDisabledState(true);
        setSubmitButtonDisabledState(true);
        setLoading(true);
        validateDictation(dictationId, textareaValue, afterValidation);
      } else {
        setErrorMessage('Cannot submit empty dictation');
      }
    }
  }

  function afterValidation (resultId: string) {
    setLoading(false);
    // clearing client cache for the Results page here because it doesn't work in the API route
    clearCachesByServerAction('/dashboard/results');
    router.push(`/dashboard/results/${resultId}`);
  }

  return(
    <form onSubmit={handleFormSubmit} className="rounded-md bg-gray-50 flex flex-col gap-6">

      <div>
        <div className="mb-2 block text-sm font-medium">
          Dictation audio
        </div>
        <DictationAudio url={audioFileUrl} />
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
              onKeyUp={event => errorMessage.length && setErrorMessage('')}
              disabled={textareaDisabledState}
            />
          </div>
        </div>
        <div className="mt-2 text-red-500">{errorMessage}</div>
      </div>

      <Button type="submit" className="max-w-full w-32 flex justify-center" aria-disabled={submitButtonDisabledState}>
        {loading
        ? <>
            Loading
            <svg className="animate-spin ml-auto h-5 w-5 text-gray-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </>
        : <>
            Submit <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </>
        }
      </Button>

    </form>
  );
}
