import { FETCH_BATCH_POKEMON_COUNT, API_URL } from '@config';
import { Pokemon, PokemonActionType } from '@store/pokemon/pokemon.types';
import { PokemonAction } from './pokemon.actions';
import { idToIdx } from './pokemon.utils';

export type SinglePokemonState = {
  readonly id: string;
  readonly pokemon: Pokemon | null;
  readonly isLoading: boolean;
  readonly error: Error | null;
};

const createSinglePokemonState = (id: string): SinglePokemonState => ({
  id,
  pokemon: null,
  isLoading: true,
  error: null
});

export type PokemonState = {
  readonly allPokemonList: SinglePokemonState[]; // list of all fetched Pokemon
  readonly displayedPokemonList: SinglePokemonState[]; // List of Pokemon that are currently displayed
  readonly error: Error | null; // Error that happened while fetching a list of pokemon
  readonly nextUrl: string | null; // Url to fetch next Pokemon list
  readonly isLoading: boolean; // Indicates that single Pokemon or Pokemon list is being fetched
  readonly areAllDisplayed: boolean; // Indicates whether all fetched Pokemon are being displayed or if the results are limited to Pokemon with only specific ids
};

const INITIAL_STATE: PokemonState = {
  allPokemonList: [],
  displayedPokemonList: [],
  error: null,
  nextUrl: `${API_URL}/pokemon?offset=0&limit=${FETCH_BATCH_POKEMON_COUNT}`,
  isLoading: false,
  areAllDisplayed: true
};

const getUpdatedDisplayedPokemonList = (
  allPokemonList: SinglePokemonState[],
  displayedPokemonList: SinglePokemonState[],
  ids: string[]
) => {
  const tempList: SinglePokemonState[] = [];

  // Rewrite currently displayed Pokemon
  displayedPokemonList.forEach(
    pokemonState => (tempList[idToIdx(pokemonState.id)] = pokemonState)
  );

  // Store updated Pokemon states in the tempList (allPokemonList must have been updated before)
  ids.forEach(id => {
    const idx = idToIdx(id);
    tempList[idx] = allPokemonList[idx];
  });

  // Crate the new array of displayed pokemon maintaining the order of Pokemon
  const newIdSet = new Set(ids);
  const resultsList: SinglePokemonState[] = [];
  displayedPokemonList.forEach(({ id }) => {
    if (!newIdSet.has(id)) resultsList.push(tempList[idToIdx(id)]);
  });
  ids.forEach(id => resultsList.push(tempList[idToIdx(id)]));
  return resultsList;
};

const getUpdatedPokemonData = (
  state: PokemonState,
  data: { [key: string]: Partial<SinglePokemonState> },
  updateIdsOrder: string[],
  updateDisplayed: boolean
) => {
  const allPokemonList = [...state.allPokemonList];

  Object.entries(data).map(([id, pokemonData]) => {
    const idx = idToIdx(id);
    allPokemonList[idx] = {
      ...allPokemonList[idx],
      ...pokemonData
    };
  });

  return {
    allPokemonList,
    displayedPokemonList: updateDisplayed
      ? getUpdatedDisplayedPokemonList(
          allPokemonList,
          state.displayedPokemonList,
          updateIdsOrder
        )
      : state.displayedPokemonList
  };
};

const handleFetchBatchStart = (
  state: PokemonState,
  { ids, updateDisplayed }: { ids: string[]; updateDisplayed: boolean }
): PokemonState => {
  const allPokemonList = [...state.allPokemonList];

  ids.forEach(id => {
    const idx = idToIdx(id);
    // Create single Pokemon states only for Pokemon that haven't been fetched before
    if (allPokemonList[idx]) return;
    allPokemonList[idx] = createSinglePokemonState(id);
  });

  return {
    ...state,
    allPokemonList,
    displayedPokemonList: updateDisplayed
      ? getUpdatedDisplayedPokemonList(
          allPokemonList,
          state.displayedPokemonList,
          ids
        )
      : state.displayedPokemonList,
    isLoading: true
  };
};

const handleFetchBatchSuccess = (
  state: PokemonState,
  {
    pokemonMap,
    updateIdsOrder,
    updateDisplayed
  }: {
    pokemonMap: { [key: string]: Pokemon };
    updateIdsOrder: string[];
    updateDisplayed: boolean;
  }
): PokemonState => ({
  ...state,
  ...getUpdatedPokemonData(
    state,
    Object.fromEntries(
      Object.entries(pokemonMap).map(([id, pokemon]) => [
        id,
        { pokemon, isLoading: false }
      ])
    ),
    updateIdsOrder,
    updateDisplayed
  ),
  isLoading: false
});

const handleFetchBatchFailure = (
  state: PokemonState,
  {
    errorsMap,
    updateIdsOrder,
    updateDisplayed
  }: {
    errorsMap: { [key: string]: Error };
    updateIdsOrder: string[];
    updateDisplayed: boolean;
  }
): PokemonState => ({
  ...state,
  ...getUpdatedPokemonData(
    state,
    Object.fromEntries(
      Object.entries(errorsMap).map(([id, error]) => [
        id,
        { error, isLoading: false }
      ])
    ),
    updateIdsOrder,
    updateDisplayed
  ),
  isLoading: false
});

const handleFetchNextPokemonUrlsStart = (
  state: PokemonState
): PokemonState => ({ ...state, isLoading: true });

const handleFetchNextPokemonUrlsSuccess = (
  state: PokemonState,
  nextUrl: string | null
): PokemonState => ({ ...state, isLoading: false, nextUrl });

const handleFetchNextPokemonUrlsFailure = (
  state: PokemonState,
  error: Error
): PokemonState => ({ ...state, isLoading: false, error });

const handleDisplayAllPokemon = (state: PokemonState): PokemonState => {
  const displayedPokemonList: SinglePokemonState[] = [];

  // Display only pokemon that have no empty slots between
  for (const pokemonState of state.allPokemonList) {
    if (!pokemonState) break;
    displayedPokemonList.push(pokemonState);
  }

  return {
    ...state,
    displayedPokemonList,
    areAllDisplayed: true
  };
};

const handleSetDisplayedPokemonWithIds = (
  state: PokemonState,
  ids: string[]
): PokemonState => ({
  ...state,
  displayedPokemonList: ids
    .map(id => state.allPokemonList[idToIdx(id)])
    .filter(Boolean), // Display only Pokemon that have been fetched before
  areAllDisplayed: false
});

const pokemonReducer = (
  state = INITIAL_STATE,
  action: PokemonAction
): PokemonState => {
  switch (action.type) {
    case PokemonActionType.FETCH_BATCH_START:
      console.log('FETCH_BATCH_START');
      return handleFetchBatchStart(state, action.payload);
    case PokemonActionType.FETCH_BATCH_SUCCESS:
      console.log('FETCH_BATCH_SUCCESS');
      return handleFetchBatchSuccess(state, action.payload);
    case PokemonActionType.FETCH_BATCH_FAILURE:
      console.log('FETCH_BATCH_FAILURE');
      return handleFetchBatchFailure(state, action.payload);
    case PokemonActionType.FETCH_NEXT_URLS_START:
      console.log('FETCH_NEXT_URLS_START');
      return handleFetchNextPokemonUrlsStart(state);
    case PokemonActionType.FETCH_NEXT_URLS_SUCCESS:
      console.log('FETCH_NEXT_URLS_SUCCESS');
      return handleFetchNextPokemonUrlsSuccess(state, action.payload);
    case PokemonActionType.FETCH_NEXT_URLS_FAILURE:
      console.log('FETCH_NEXT_URLS_FAILURE');
      return handleFetchNextPokemonUrlsFailure(state, action.payload);
    case PokemonActionType.DISPLAY_ALL_POKEMON:
      console.log('DISPLAY_ALL_POKEMON');
      return handleDisplayAllPokemon(state);
    case PokemonActionType.SET_DISPLAYED_POKEMON_WIDTH_IDS:
      console.log('SET_DISPLAYED_POKEMON_WIDTH_IDS');
      return handleSetDisplayedPokemonWithIds(state, action.payload);
    case PokemonActionType.RESET_POKEMON_STATE:
      console.log('RESET_POKEMON_STATE');
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default pokemonReducer;
