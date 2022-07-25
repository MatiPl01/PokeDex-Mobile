import { createSelector } from 'reselect';
import { RootState } from '@store';
import { SearchState } from './search.reducer';

const selectSearchState = (state: RootState): SearchState => state.search;

export const selectSearchItemsList = createSelector(
  [selectSearchState],
  ({ searchItems }) => searchItems
);

export const selectSearchIsLoading = createSelector(
  [selectSearchState],
  ({ isLoading }) => isLoading
);

export const selectSearchError = createSelector(
  [selectSearchState],
  ({ error }) => error
);
