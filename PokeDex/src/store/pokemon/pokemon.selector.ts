import { SinglePokemonState } from './pokemon.reducer';
import { createSelector } from 'reselect';
import { RootState } from '@store';
import { idToIdx } from './pokemon.utils';

const selectPokemonState = (state: RootState) => state.pokemon;

export const selectPokemonList = createSelector(
  selectPokemonState,
  ({ pokemonList }) => pokemonList
);

export const selectPokemonIsFetchingList = createSelector(
  selectPokemonState,
  ({ isFetchingList }) => isFetchingList
);

export const selectPokemonFetchingListError = createSelector(
  selectPokemonState,
  ({ fetchingListError }) => fetchingListError
);

export const selectSinglePokemonState = createSelector(
  [selectPokemonList, (state: RootState, id: string) => id],
  (pokemonList, id): SinglePokemonState | undefined => pokemonList[idToIdx(id)]
);
