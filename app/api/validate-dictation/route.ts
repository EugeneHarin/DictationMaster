import { getDictation } from "@/app/lib/dictation-functions/crud";
import { NextRequest, NextResponse } from 'next/server';
import DiffMatchPatch from 'diff-match-patch';
import { createDictationResult } from "@/app/lib/result-functions/crud";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const userInput = data.userInput;
    const dictationId = data.dictationId;
    const originalText = (await getDictation(dictationId))?.content;

    const dmp = new DiffMatchPatch();
    const verificationErrors = dmp.diff_main(originalText, userInput);
    const resultId = await createDictationResult(dictationId, verificationErrors, originalText);

    return NextResponse.json({ resultId: resultId }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Error validating dictation.', cause: error }, { status: 500 });
  }
}
