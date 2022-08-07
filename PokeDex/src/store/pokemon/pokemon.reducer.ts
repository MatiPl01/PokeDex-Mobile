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
};

const INITIAL_STATE: PokemonState = {
  allPokemonList: [],
  displayedPokemonList: [],
  error: null,
  nextUrl: `${API_URL}/pokemon?offset=0&limit=${FETCH_BATCH_POKEMON_COUNT}`,
  isLoading: false
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

  // Filter out empty slots in the array
  return tempList.filter(Boolean);
};

const getUpdatedPokemonData = (
  state: PokemonState,
  data: { [key: string]: Partial<SinglePokemonState> },
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
          Object.keys(data)
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
    updateDisplayed
  }: {
    pokemonMap: { [key: string]: Pokemon };
    updateDisplayed: boolean;
  }
): PokemonState => ({
  ...state,
  ...getUpdatedPokemonData(
    state,
    Object.fromEntries(
      Object.entries(pokemonMap).map(([id, pokemon]) => [id, { pokemon, isLoading: false }])
    ),
    updateDisplayed
  ),
  isLoading: false
});

const handleFetchBatchFailure = (
  state: PokemonState,
  {
    errorsMap,
    updateDisplayed
  }: {
    errorsMap: { [key: string]: Error };
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

const handleDisplayAllPokemon = (state: PokemonState): PokemonState => ({
  ...state,
  displayedPokemonList: [...state.allPokemonList]
});

const handleDisplayPokemonWithIds = (
  state: PokemonState,
  ids: string[]
): PokemonState => ({
  ...state,
  displayedPokemonList: ids.map(id => state.allPokemonList[idToIdx(id)])
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
    case PokemonActionType.DISPLAY_POKEMON_WITH_IDS:
      console.log('DISPLAY_POKEMON_WITH_IDS');
      return handleDisplayPokemonWithIds(state, action.payload);
    case PokemonActionType.RESET_POKEMON_STATE:
      console.log('RESET_POKEMON_STATE');
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default pokemonReducer;
