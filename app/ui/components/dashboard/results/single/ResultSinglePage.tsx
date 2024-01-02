'use server'

import { retrieveAudioFileUrl } from "@/app/lib/google-cloud-modules/cloud-storage";
import { getResultErrorsHtml } from "@/app/lib/utils";
import { UserCircleIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import DictationAudio from "../../dictations/DictationAudio";
import AIReviewButton from "./AIReviewButton";
import fetchResultData from "@/app/lib/result-functions/fetch";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import LoadingBox from "../../LoadingBox";

export default async function ResultSinglePage({ resultId }: { resultId: string }) {
  const dictationResultData = await fetchResultData(resultId);
  if (!dictationResultData) notFound();

  const audioUrl = await retrieveAudioFileUrl(dictationResultData.dictation_id, dictationResultData.dictation_content, dictationResultData.language_code, dictationResultData.speed);
  const resultWithErrorsHtml = getResultErrorsHtml(dictationResultData.result_errors);
  const dictationIsPassed = dictationResultData.correctness_percentage > 90;
  const resultErrorsArray = [
    {
      message: 'You have',
      value: dictationResultData.errors_count,
      additionalText: 'errors',
    },
    {
      message: 'There is',
      value: dictationResultData.wrong_characters_count,
      additionalText: 'wrong characters in your text',
    },
    {
      message: 'Your accuracy is',
      value: dictationResultData.correctness_percentage + '%',
      additionalText: '',
    },
  ];

  const studentInput = dictationResultData.result_errors.reduce((resultText, currentElement) => currentElement[0] !== -1 ? resultText += currentElement[1] : resultText, '');


  return (
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
            <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-foc  :text-gray-900" />
          </div>
        </div>
      </div>

      {/* Dictation audio */}
      <div>
        <div className="text-sm font-medium">
          Dictation audio
        </div>
        <Suspense key={dictationResultData.dictation_id} fallback={<LoadingBox className="w-fit mt-2" text="" />}>
          <DictationAudio id={dictationResultData.dictation_id} content={dictationResultData.dictation_content} language_code={dictationResultData.language_code} speed={dictationResultData.speed}/>
        </Suspense>
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

      {/* Errors overview */}
      <div className="flex flex-col gap-3">
        {resultErrorsArray.map((error, index) => (
          <div key={index} className={
            clsx(dictationIsPassed
              ? 'py-2 px-4 rounded-full bg-green-200 inline-block'
              : 'py-2 px-4 rounded-full bg-red-200 text-base font-medium inline-block'
            , 'w-fit')
          }>
            <span>{error.message} </span>
            <span className={
              clsx(dictationIsPassed
                ? 'bg-green-500 text-white px-1.5'
                : 'bg-red-500 text-white px-1.5'
              )
            }>
              {error.value}
            </span>
            {error.additionalText &&
              <span> {error.additionalText}</span>
            }
          </div>
        ))}
      </div>

      {/* AI Review */}
      <AIReviewButton originalText={dictationResultData.dictation_content} studentInput={studentInput} languageCode={dictationResultData.language_code} />

    </div>
  )
}
