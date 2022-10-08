import { API } from '@constants';
import { idToIdx } from '@utils/data';
import { Pokemon, PokemonActionType } from './pokemon.types';
import { PokemonAction } from './pokemon.actions';

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
  readonly allPokemonList: (SinglePokemonState | undefined)[]; // list of all fetched Pokemon
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
  nextUrl: `${API.URL}/pokemon?offset=0&limit=${API.FETCH_POKEMON_PER_BATCH}`,
  isLoading: false,
  areAllDisplayed: true
};

const isPokemonState = (
  item?: SinglePokemonState
): item is SinglePokemonState => !!item;

const getUpdatedDisplayedPokemonList = (
  allPokemonList: (SinglePokemonState | undefined)[],
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
    const item = allPokemonList[idx];
    if (isPokemonState(item)) tempList[idx] = item;
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
    const item = allPokemonList[idx];
    if (isPokemonState(item)) {
      allPokemonList[idx] = {
        ...item,
        ...pokemonData
      };
    }
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
  // Return the same state object if all Pokemon with the specified ids have already been fetched
  if (ids.every(id => !!state.allPokemonList[idToIdx(id)])) return state;

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

const handleFetchSingleStart = (
  state: PokemonState,
  { id, updateDisplayed }: { id: string; updateDisplayed: boolean }
): PokemonState =>
  state.allPokemonList[idToIdx(id)]
    ? state
    : {
        ...handleFetchBatchStart(state, { ids: [id], updateDisplayed }),
        isLoading: state.isLoading
      };

const handleFetchSingleSuccess = (
  state: PokemonState,
  {
    id,
    pokemon,
    updateDisplayed
  }: { id: string; pokemon: Pokemon; updateDisplayed: boolean }
): PokemonState => ({
  ...handleFetchBatchSuccess(state, {
    pokemonMap: { [id]: pokemon },
    updateIdsOrder: [id],
    updateDisplayed
  })
});

const handleFetchSingleFailure = (
  state: PokemonState,
  {
    id,
    error,
    updateDisplayed
  }: { id: string; error: Error; updateDisplayed: boolean }
): PokemonState => ({
  ...handleFetchBatchFailure(state, {
    errorsMap: { [id]: error },
    updateIdsOrder: [id],
    updateDisplayed
  })
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
    .filter(Boolean) as SinglePokemonState[], // Display only Pokemon that have been fetched before
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
    case PokemonActionType.FETCH_SINGLE_START:
      console.log('FETCH_SINGLE_START');
      return handleFetchSingleStart(state, action.payload);
    case PokemonActionType.FETCH_SINGLE_SUCCESS:
      console.log('FETCH_SINGLE_SUCCESS');
      return handleFetchSingleSuccess(state, action.payload);
    case PokemonActionType.FETCH_SINGLE_FAILURE:
      console.log('FETCH_SINGLE_FAILURE');
      return handleFetchSingleFailure(state, action.payload);
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
