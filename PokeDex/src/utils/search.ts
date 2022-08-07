export type SearchItem = { id: string; value: string };
export type SearchSuggestionItem = {
  item: SearchItem;
  prefix: string;
  infix: string;
  suffix: string;
};

export const getSearchSuggestions = (
  searchValue: string,
  items: SearchItem[]
): SearchSuggestionItem[] => {
  if (!searchValue) return [];
  const suggestionsMap: {
    [key: number]: SearchSuggestionItem[];
  } = {};

  items.forEach(item => {
    const index = item.value
      .toLocaleLowerCase()
      .indexOf(searchValue.toLocaleLowerCase());
    if (index < 0) return;
    if (!suggestionsMap[index]) suggestionsMap[index] = [];
    const value = item.value;
    suggestionsMap[index].push({
      item,
      prefix: value.slice(0, index),
      infix: value.slice(index, index + searchValue.length),
      suffix: value.slice(index + searchValue.length)
    });
  });

  const sortedKeys = Object.keys(suggestionsMap);
  sortedKeys.sort();

  return sortedKeys.reduce((suggestions, key) => {
    suggestions.push(...suggestionsMap[key as never as number]);
    return suggestions;
  }, [] as SearchSuggestionItem[]);
};
