import { SinglePokemonState } from './pokemon.reducer';
import { createSelector } from 'reselect';
import { RootState } from '@store';
import { idToIdx } from './pokemon.utils';

const selectPokemonState = (state: RootState) => state.pokemon;

export const selectAllPokemonList = createSelector(
  selectPokemonState,
  ({ allPokemonList }) => allPokemonList // this array can have empty slots
);

export const selectDisplayedPokemonList = createSelector(
  selectPokemonState,
  ({ displayedPokemonList }) => displayedPokemonList
);

export const selectSinglePokemonState = createSelector(
  [selectAllPokemonList, (state: RootState, id: string) => id],
  (pokemonList, id): SinglePokemonState | undefined => pokemonList[idToIdx(id)]
);

export const selectPokemonReachedEnd = createSelector(
  selectPokemonState,
  ({ nextUrl }) => !nextUrl
);

export const selectPokemonAreAllDisplayed = createSelector(
  selectPokemonState,
  ({ areAllDisplayed }) => areAllDisplayed
);
