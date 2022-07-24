import { SearchAction } from './search.actions';
import { PokemonSearchItem, SearchActionType } from './search.types';

export type SearchState = {
  readonly searchItems: PokemonSearchItem[];
  readonly isLoading: boolean;
  readonly error: Error | null;
};

const INITIAL_STATE: SearchState = {
  searchItems: [],
  isLoading: false,
  error: null
};

// TODO - improve Redux types
const searchReducer = (
  state = INITIAL_STATE,
  action: SearchAction
): SearchState => {
  switch (action.type) {
    case SearchActionType.FETCH_SEARCH_ITEMS_START:
      return { ...state, isLoading: true };
    case SearchActionType.FETCH_SEARCH_ITEMS_SUCCESS:
      return { ...state, isLoading: false, searchItems: action.payload };
    case SearchActionType.FETCH_SEARCH_ITEMS_FAILURE:
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export default searchReducer;
