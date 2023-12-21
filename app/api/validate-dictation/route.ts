import { getDictation } from "@/app/lib/dictation-functions/crud";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // const team = params.id // '1'
  // console.log(params);

  const data = await request.json();
  const userInput = data.userInput;
  const dictationId = data.dictationId;
  if (!dictationId || !userInput) return NextResponse.json({ error: 'Error validating dictation' }, { status: 500 });

  const originalText = (await getDictation(dictationId))?.content;

  const verificationResults = compareTexts(originalText, userInput);

  return NextResponse.json({ result: verificationResults }, { status: 200 });
}

function compareTexts(originalText: string, userInput: string) {
  let errors = [];
  let maxLength = Math.max(originalText.length, userInput.length);

  let userInputOffset = 0;
  for (let i = 0; i < maxLength; i++) {
    const originalTextLetter = originalText[i];
    const userInputLetter = userInput[i + userInputOffset];

    // if (i == 0 || originalText[i - 1] == ' ') {
    //   console.log(`current word: "${getWordAtPosition(originalText, i)}"`);
    // }
    // console.log('current letter Text:', originalTextLetter);
    // console.log('current letter User:', userInputLetter);

    if (originalTextLetter !== userInputLetter) {
      // console.log('expected:', originalTextLetter);
      // console.log('get:', userInputLetter);
      // console.log(`word original: "${getWordAtPosition(originalText, i)}"`);
      // console.log(`word user: "${getWordAtPosition(userInput, i)}"`);
      errors.push({
        position: i + userInputOffset,
        expected: originalTextLetter,
        get: userInputLetter,
        word: getWordAtPosition(originalText, i + userInputOffset),
      });

      const userInputLetterPosition = checkForTheFollowingLetterInWord(userInput, i + userInputOffset, originalTextLetter);
      // In cases when user word is longer than original
      if (userInputLetterPosition) {
        const invalidLettersCount = userInputLetterPosition - (i + userInputOffset);
        for (let j = 0; j < invalidLettersCount; j++) {
          errors.push({
            position: i + j + userInputOffset,
            expected: originalText[i+j],
            get: userInput[i+j],
            word: getWordAtPosition(originalText, i + j),
          });
        }

        userInputOffset = invalidLettersCount;
        // In cases when user have redundant spaces
      } else if (userInput[i + userInputOffset] == ' ') {
        const invalidSpacesCount = countFollowingSpaces(userInput, i + userInputOffset);
        // Add that one space which was already added to errors object eralier
        userInputOffset++;
        for (let j = 0; j < invalidSpacesCount; j++) {
          errors.push({
            position: i + userInputOffset,
            expected: originalText[i],
            get: userInput[i + userInputOffset],
            word: getWordAtPosition(originalText, i),
          });
          userInputOffset++;
        }
        // In cases when user word is shorter than original
      } else userInputOffset--;

      // console.log('userInputOffset', userInputOffset);
    }
  }

  return errors;
}

/**
 * @returns letter position `number` if it was found
 * @returns `false` - if letter wasn't found
 */
function checkForTheFollowingLetterInWord(text: string, position: number, letter: string) {
  let i = position;
  while (text[i] !== ' ' && i < text.length) {
    if (text[i] == letter) return(i);
    i++;
  }
  return false;
}

function countFollowingSpaces(text: string, position: number) {
  let spacesCount = 0;
  let i = position + 1;
  while (text[i] == ' ' && i < text.length) {
    spacesCount++;
    i++;
  }
  return spacesCount;
}

/**
 * @returns `string` - word that was found at the given position
 * @returns `string` - empty string if there is no word at the given position
 */
function getWordAtPosition(text: string, position: number) {
  const words = text.split(/\s+/); // Split the sentence into words
  let currentIndex = 0;

  for (let word of words) {
      const wordEnd = currentIndex + word.length;
      if (position >= currentIndex && position < wordEnd) {
          return word;
      }
      currentIndex = wordEnd + 1; // Adding 1 for the space
  }

  return '';
}
