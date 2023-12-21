'use client'

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "../../Button";
import { validateDictation } from "@/app/lib/dictation-functions/validation";
import DictationAudio from "../DictationAudio";
import { FormEvent, useState } from "react";
import { DictationValidationResult } from "@/app/lib/definitions";
import { useRouter } from 'next/navigation'
import LoadingBox from "../../LoadingBox";

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

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (false == submitButtonDisabledState) {
      const formData = new FormData(event.currentTarget);
      const textareaValue = formData.get('content') as string;
      setSubmitButtonDisabledState(true);
      setLoading(true);
      validateDictation(dictationId, textareaValue, afterValidation);
    }
  }

  const afterValidation = () => {
    setLoading(false);
    router.push(`dashboard/dictations/${dictationId}/result`);
  }

  if (loading) return (<LoadingBox />)
  else return(
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
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="max-w-full w-32 flex justify-center" aria-disabled={submitButtonDisabledState}>
        Submit <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
      </Button>

    </form>
  );
}
