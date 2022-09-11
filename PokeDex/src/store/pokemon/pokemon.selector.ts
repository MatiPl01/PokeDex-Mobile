import { createSelector } from 'reselect';
import { idToIdx } from '@utils/data';
import { RootState } from '@store';

const selectPokemonState = (state: RootState) => state.pokemon;

export const selectAllPokemonList = createSelector(
  selectPokemonState,
  ({ allPokemonList }) => allPokemonList // this array can have empty slots
);

export const selectDisplayedPokemonList = createSelector(
  selectPokemonState,
  ({ displayedPokemonList }) => displayedPokemonList
);

export const selectSinglePokemonStateById = createSelector(
  [selectAllPokemonList, (state: RootState, id: string) => id],
  (pokemonList, id) => pokemonList[idToIdx(id)]
);

export const selectPokemonStateListByIds = createSelector(
  [
    selectAllPokemonList,
    (state: RootState, ids: string[], allowEmpty = false) => ({
      ids,
      allowEmpty
    })
  ],
  (pokemonList, { ids, allowEmpty }) => {
    const pokemonStates = ids.map(id => pokemonList[idToIdx(id)]);
    if (allowEmpty) return pokemonStates;
    return pokemonStates.filter(Boolean);
  }
);

export const selectPokemonReachedEnd = createSelector(
  selectPokemonState,
  ({ nextUrl }) => !nextUrl
);

export const selectPokemonAreAllDisplayed = createSelector(
  selectPokemonState,
  ({ areAllDisplayed }) => areAllDisplayed
);
