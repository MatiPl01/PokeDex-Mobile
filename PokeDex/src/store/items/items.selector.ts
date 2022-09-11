import { createSelector } from 'reselect';
import { RootState } from '@store';
import { idToIdx } from '@utils/data';

const selectItemsState = (state: RootState) => state.items;

export const selectItemsList = createSelector(
  selectItemsState,
  ({ itemsList }) => itemsList
);

export const selectItemStatesByIds = createSelector(
  [selectItemsList, (state: RootState, ids: string[]) => ids],
  (itemsList, ids) => ids.map(id => itemsList[idToIdx(id)]).filter(Boolean)
);
