import { createSelector } from 'reselect';
import { RootState } from '@store';

const selectFavoritesState = (state: RootState) => state.favorites;

export const selectFavoritePokemonIdsList = createSelector(
  selectFavoritesState,
  ({ favoritesIdsList }) => favoritesIdsList
);

export const selectPokemonIsFavourite = createSelector(
  [selectFavoritePokemonIdsList, (state: RootState, id: string) => id],
  (pokemonList, id) => pokemonList.indexOf(id) >= 0
);
