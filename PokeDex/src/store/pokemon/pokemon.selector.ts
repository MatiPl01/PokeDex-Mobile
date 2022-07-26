import { createSelector } from 'reselect';
import { PokemonListItem } from './pokemon.types';
import { RootState } from '@store';

const selectPokemonState = (state: RootState) => state.pokemon;

export const selectPokemonMap = createSelector(
  selectPokemonState,
  ({ pokemonMap }) => pokemonMap
);

export const selectPokemonList = createSelector(
  selectPokemonMap,
  (pokemonMap): PokemonListItem[] => {
    const idNumbers = Object.keys(pokemonMap).map(id => +id);
    // This ensures that the array will always have pokemon stored in the same order
    idNumbers.sort((a, b) => a - b);
    const ids = idNumbers.map(id => String(id));
    return ids.map(id => ({ id, ...pokemonMap[id] }));
  }
);

export const selectPokemonIsFetchingList = createSelector(
  selectPokemonState,
  ({ isFetchingList }) => isFetchingList
);

export const selectSinglePokemonState = createSelector(
  [selectPokemonMap, (state: RootState, id: string) => id],
  (pokemonMap, id) => pokemonMap[id]
);
