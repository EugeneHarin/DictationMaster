import type DiffMatchPatch from 'diff-match-patch';

export const getResultErrorsHtml = (errorsArray: DiffMatchPatch.Diff[]) => {
  let resultHtml = '';
  errorsArray.map(([number, text]) => {
    if (number == 0) resultHtml += `<span>${text}</span>`;
    else if (number > 0) resultHtml += `<del class="bg-red-200">${text}</del>`;
    else resultHtml += `<ins class="bg-green-200">${text}</ins>`
  });

  return resultHtml
}

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export const convertAndRepeatSentences = (text: string, numberOfRepeats: number) => {
  const sentenceRegex = /(?<=[.!?])\s/;
  const sentences = text.split(sentenceRegex);

  // Repeat each sentence the specified number of times, adding the break string between repetitions
  const repeatedText = '<speak>' + sentences.map(sentence => {
    let repeatedSentence = sentence.trim();
    for (let i = 1; i < numberOfRepeats; i++) {
      if (repeatedSentence.length > 20) repeatedSentence += '<break time="2s"/>' + sentence.trim();
    }
    return repeatedSentence;
  }).join('<break time="3s"/>') + '</speak>';

  return repeatedText;
}
