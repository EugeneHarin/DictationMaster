import { getDictation } from "@/app/lib/dictation-functions/crud";
import { NextRequest, NextResponse } from 'next/server';
import DiffMatchPatch from 'diff-match-patch';

export async function POST(request: NextRequest) {
  const data = await request.json();
  const userInput = data.userInput;
  const dictationId = data.dictationId;
  if (!dictationId || !userInput) return NextResponse.json({ error: 'Error validating dictation' }, { status: 500 });

  const originalText = (await getDictation(dictationId))?.content;

  const dmp = new DiffMatchPatch();
  const verificationErrors = dmp.diff_main(originalText, userInput);
  const verificatedTextHtml = dmp.diff_prettyHtml(verificationErrors);

  return NextResponse.json({ html: verificatedTextHtml, errors: verificationErrors }, { status: 200 });
}
