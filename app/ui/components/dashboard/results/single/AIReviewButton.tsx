'use client'

import { Dictation } from "@/app/lib/definitions";
import { getAIDictationReview } from "@/app/lib/google-cloud-modules/text-analysis";
import clsx from "clsx";
import { useState, useMemo } from "react";
import { Button } from "../../Button";
import LoadingBox from "../../LoadingBox";
import { time } from 'console';

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

  async function generateAIReview() {
    // Run only once
    if (buttonIsDisabled) return;
    setButtonIsDisabled(true);
    const errorMessageForUser = 'Error happened during generation of the AI review';
    setAIReview(<LoadingBox className="w-fit" text="" />);

    try {
      const AIReviewResponse = await Promise.race([
        getAIDictationReview(originalText, studentInput, languageCode),
        timeout(9000),
      ])

      if (AIReviewResponse?._t == undefined) {
        console.error('Error: AIReviewResponse doesn\'t have property _t');
        setAIReview(<pre>{errorMessageForUser}</pre>);
        return;
      }

      switch (AIReviewResponse._t) {
        case 'success':
          setAIReview(<pre>{AIReviewResponse.result}</pre>);
          break;

        case 'create-instance-error':
        case 'prediction-result-error':
        case 'project-id-not-found':
          console.error(AIReviewResponse.message);
          setAIReview(<pre>{errorMessageForUser}</pre>);
          break;

        case 'unknown-error':
          console.error(AIReviewResponse.error);
          setAIReview(<pre>{errorMessageForUser}</pre>);
          break;

        case 'unsupported-language-error':
          console.error(AIReviewResponse.message);
          setAIReview(<pre>{AIReviewResponse.message}</pre>);
          break;
      }
    } catch (error: unknown) {
      const message = (error instanceof Error) ? error.message : 'Unhandled error generating AI review';
      console.error(message);
      setAIReview(<pre>{errorMessageForUser}</pre>);
    }
  }

  return (
    <>
      <div className="flex gap-4 items-center">
        <Button disabled={buttonIsDisabled} type="button" onClick={generateAIReview} className="w-fit">Generate AI Review</Button>
        {languageCode !== 'en-US' && <span className="opacity-75">Unfortunately, languages other than English are not supported</span> }
      </div>
      <div className={clsx((!buttonIsDisabled || languageCode !== 'en-US') && 'hidden', 'peer w-full rounded-md border border-gray-200 py-6 px-8 text-sm outline-2 bg-white [&>pre]:text-wrap')}>
        {AIReview}
      </div>
    </>
  )
}

function timeout(ms: number): Promise<never> {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          reject(new Error('Generation of the AI review timed out'));
      }, ms);
  });
}
