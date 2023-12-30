'use client'

import { Dictation } from "@/app/lib/definitions";
import { getAIDictationReview } from "@/app/lib/google-cloud-actions";
import clsx from "clsx";
import { useState } from "react";
import { Button } from "../Button";
import LoadingBox from "../LoadingBox";

export default function AIReviewButton({
  originalText,
  studentInput,
  languageCode
} : {
  originalText: string,
  studentInput: string,
  languageCode: Dictation['language_code'],
}) {

  const [AIReview, setAIReview] = useState(<></>);
  const [buttonIsDisabled, setButtonIsDisabled] = useState(languageCode !== 'en-US');

  const generateAIReview = async () => {
    // Run only once
    if (buttonIsDisabled) return;
    setButtonIsDisabled(true);
    const errorMessageForUser = 'Error happened during generation of the AI review';
    setAIReview(<LoadingBox className="w-fit" text="" />);
    const AIReviewResponse = await getAIDictationReview(originalText, studentInput, languageCode);
    switch (AIReviewResponse._t) {
      case 'success':
        setAIReview(<pre>{AIReviewResponse.result}</pre>);
        break;

      case 'create-instance-error':
        console.error(AIReviewResponse.message);
        setAIReview(<pre>{errorMessageForUser}</pre>);
        break;

      case 'prediction-result-error':
        console.error(AIReviewResponse.message);
        setAIReview(<pre>{errorMessageForUser}</pre>);
        break;

      case 'unsupported-language-error':
        console.error(AIReviewResponse.message);
        setAIReview(<pre>{AIReviewResponse.message}</pre>);
        break;

      case 'unknown-error':
        console.error(AIReviewResponse.error);
        setAIReview(<pre>{errorMessageForUser}</pre>);
        break;
    }
  }

  return (
    <>
      <div className="flex gap-4 items-center">
        <Button disabled={buttonIsDisabled} type="button" onClick={generateAIReview} className="w-fit">Generate AI Review</Button>
        {languageCode !== 'en-US' && <span className="opacity-75">Unfortunately, languages other than English are not supported</span> }
      </div>
      <div className={clsx((!buttonIsDisabled || languageCode !== 'en-US') && 'hidden', 'peer w-full rounded-md border border-gray-200 py-6 px-8 text-sm outline-2 bg-white')}>
        {AIReview}
      </div>
    </>
  )
}
