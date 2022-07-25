import { PokemonListItem } from './pokemon.types';
import { createSelector } from 'reselect';
import { RootState } from '@store';

const selectPokemonState = (state: RootState) => state.pokemon;

export const selectPokemonMap = createSelector(
  [selectPokemonState],
  ({ pokemonMap }) => pokemonMap
);

export const selectPokemonList = createSelector(
  [selectPokemonMap],
  (pokemonMap): PokemonListItem[] => {
    const idNumbers = Object.keys(pokemonMap).map(id => +id);
    // This ensures that the array will always have pokemon stored in the same order
    idNumbers.sort((a, b) => a - b);
    console.log(idNumbers);
    const ids = idNumbers.map(id => String(id));
    return ids.map(id => ({ id, ...pokemonMap[id] }));
  }
);

export const selectPokemonIsFetchingList = createSelector(
  [selectPokemonState],
  ({ isFetchingList }) => isFetchingList
);

export const selectSinglePokemon = createSelector(
  [selectPokemonMap, (pokemonMap, id: string) => id],
  (pokemonMap, id) => pokemonMap[id]
);

export const selectSinglePokemonIsLoading = createSelector(
  [selectPokemonMap, (pokemonMap, id: string) => id],
  (pokemonMap, id) => pokemonMap[id].isLoading
);
