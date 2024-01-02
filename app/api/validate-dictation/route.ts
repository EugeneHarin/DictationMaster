import { getDictation } from "@/app/lib/dictation-functions/crud";
import { NextRequest, NextResponse } from 'next/server';
import DiffMatchPatch from 'diff-match-patch';
import { createDictationResult } from "@/app/lib/result-functions/crud";
import { HTTPResponseError } from '@/app/lib/definitions';

export async function POST(request: NextRequest): Promise<NextResponse<HTTPResponseError | { result: string }>> {
  try {
    const response = NextResponse.next();
    const data = await request.json();
    const userInput = data.userInput;
    const dictationId = data.dictationId;
    const originalText = (await getDictation(dictationId))?.content;

    const dmp = new DiffMatchPatch();
    const verificationErrors = dmp.diff_main(originalText, userInput);
    const createDictationResultResponse = await createDictationResult(dictationId, verificationErrors, originalText);

    if (createDictationResultResponse._t !== 'success')
      console.error(`${createDictationResultResponse.message}:\n${createDictationResultResponse.cause}`);

    switch (createDictationResultResponse._t) {
      case 'success':
        return NextResponse.json({ result: createDictationResultResponse.result }, { status: 200 });

      case 'neon-db-error':
      case 'undefined-result-id-error':
      case 'user-data-undefined-error':
      case 'unknown-error':
        return NextResponse.json({ message: createDictationResultResponse.message }, { status: 500 });

      default:
        return NextResponse.json({ message: 'Unhandled error creating dictation result' }, { status: 500 });
    }
  } catch (error: unknown) {
    const errorMessage = 'Unhandled error validating dictation';
    console.error(`${errorMessage}:\n${error}`);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
