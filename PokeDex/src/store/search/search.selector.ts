import { createSelector } from 'reselect';
import { SearchState } from './search.reducer';
import { RootState } from '@store';
import {
  PokemonSearchItem,
  PokemonSearchItemsMap
} from '@store/search/search.types';

const selectSearchState = (state: RootState): SearchState => state.search;

export const selectSearchItemsList = createSelector(
  [selectSearchState],
  ({ searchItems }) => searchItems
);

// TODO - maybe remove this selector (idk if will be useful)
export const selectSearchItemsMap = createSelector(
  [selectSearchItemsList],
  (searchItems: PokemonSearchItem[]): PokemonSearchItemsMap =>
    searchItems.reduce((result, { id, name, url }) => {
      result[id] = { name, url };
      return result;
    }, {} as PokemonSearchItemsMap)
);

export const selectSearchIsLoading = createSelector(
  [selectSearchState],
  ({ isLoading }) => isLoading
);

export const selectSearchError = createSelector(
  [selectSearchState],
  ({ error }) => error
);
