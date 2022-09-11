export const kebabCaseToCamelCase = (value: string): string =>
  value
    .split(/-/g)
    .map((part, index) =>
      index === 0 ? part : `${part[0].toUpperCase()}${part.slice(1)}`
    )
    .join('');

export const camelCaseToWordList = (value: string): string[] => {
  const words = [];

  let startIdx = 0;
  for (let endIdx = 0; endIdx < value.length; endIdx++) {
    const charCode = value.charCodeAt(endIdx);
    if (65 <= charCode && charCode <= 90) {
      // Check if the letter at endIdx is uppercase
      if (startIdx === endIdx) continue;
      words.push(value.slice(startIdx, endIdx));
      startIdx = endIdx;
    }
  }

  words.push(value.slice(startIdx));
  return words.map(word => word.toLowerCase());
};

export const camelCaseToWordsString = (value: string): string => camelCaseToWordList(value).join(' ');
