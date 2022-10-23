export enum SearchActionType {
  SET_SEARCH_VALUE = 'search/SET_SEARCH_VALUE',
  OPEN_SEARCHBAR = 'search/OPEN_SEARCHBAR',
  CLOSE_SEARCHBAR = 'search/CLOSE_SEARCHBAR',
  FETCH_SEARCH_ITEMS_START = 'search/FETCH_SEARCH_ITEMS_START',
  FETCH_SEARCH_ITEMS_SUCCESS = 'search/FETCH_SEARCH_ITEMS_SUCCESS',
  FETCH_SEARCH_ITEMS_FAILURE = 'search/FETCH_SEARCH_ITEMS_FAILURE'
}

export type PokemonSearchItemResponse = {
  name: string;
  url: string;
};

export type PokemonSearchItemsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonSearchItemResponse[];
};
