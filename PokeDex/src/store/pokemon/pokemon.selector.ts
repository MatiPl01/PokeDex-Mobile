import { createSelector } from 'reselect';
import { PokemonState } from './pokemon.reducer';
import { RootState } from './../store';
import { Pokemon } from './pokemon.types';

const selectPokemonState = (state: RootState): PokemonState => state.pokemon;

export const selectPokemonList = createSelector(
  [selectPokemonState],
  ({ pokemonList }) => pokemonList
);

export const selectPokemonWithId = (id: number) =>
  createSelector([selectPokemonState], ({ pokemonList }): Pokemon | undefined =>
    pokemonList.find(pokemon => pokemon.id === id)
  );

export const selectPokemonIsLoading = createSelector(
  [selectPokemonState],
  ({ isLoading }) => isLoading
);

export const selectNextPokemonFetchUrl = createSelector(
  [selectPokemonState],
  ({ nextUrl }) => nextUrl
);
