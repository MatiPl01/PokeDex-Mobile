import { SearchItem } from '@utils/search';
import { SearchAction } from './search.actions';
import { SearchActionType } from './search.types';

export type SearchState = {
  readonly searchValue: string;
  readonly searchItems: SearchItem[];
  readonly isLoading: boolean;
  readonly isSearchBarOpen: boolean;
  readonly error: Error | null;
};

const INITIAL_STATE: SearchState = {
  searchValue: '',
  searchItems: [],
  isLoading: false,
  isSearchBarOpen: false,
  error: null
};

// TODO - improve Redux types
const searchReducer = (
  state = INITIAL_STATE,
  action: SearchAction
): SearchState => {
  switch (action.type) {
    case SearchActionType.SET_SEARCH_VALUE:
      return { ...state, searchValue: action.payload };
    case SearchActionType.OPEN_SEARCHBAR:
      return { ...state, isSearchBarOpen: true };
    case SearchActionType.CLOSE_SEARCHBAR:
      return { ...state, isSearchBarOpen: false };
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
