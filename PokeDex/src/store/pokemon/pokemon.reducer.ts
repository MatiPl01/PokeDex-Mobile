import { FETCH_NEXT_POKEMON_COUNT, API_URL } from '@config';
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
  readonly pokemonList: SinglePokemonState[];
  readonly isFetchingList: boolean; // Indicates that pokemon list is being fetched
  readonly fetchingListError: Error | null; // Error that happened while fetching a list of pokemon
  readonly nextUrl: string | null; // Url to fetch next pokemon list
};

const INITIAL_STATE: PokemonState = {
  pokemonList: [],
  isFetchingList: false,
  fetchingListError: null,
  nextUrl: `${API_URL}/pokemon?offset=0&limit=${FETCH_NEXT_POKEMON_COUNT}`
};

const handleFetchNextListStart = (state: PokemonState): PokemonState => ({
  ...state,
  isFetchingList: true
});

const handleFetchNextListSingleStart = (
  state: PokemonState,
  pokemonIds: string[]
): PokemonState => {
  const pokemonList = [...state.pokemonList];

  pokemonIds.forEach(id => {
    const idx = idToIdx(id);
    if (!pokemonList[idx]) pokemonList[idx] = createSinglePokemonState(id);
    else
      pokemonList[idx] = {
        ...state.pokemonList[idx],
        isLoading: true
      };
  });

  return {
    ...state,
    pokemonList
  };
};

const handleFetchNextListSuccess = (
  state: PokemonState,
  {
    nextUrl,
    pokemonMap
  }: { nextUrl: string | null; pokemonMap: { [key: string]: Pokemon } }
): PokemonState => {
  const pokemonList = [...state.pokemonList];

  Object.entries(pokemonMap).forEach(([id, pokemon]) => {
    const idx = idToIdx(id);
    pokemonList[idx] = {
      ...pokemonList[idx],
      isLoading: false,
      pokemon
    };
  });

  return {
    ...state,
    pokemonList,
    nextUrl
  };
};

const handleFetchNextListFailure = (
  state: PokemonState,
  error: Error
): PokemonState => ({
  ...state,
  isFetchingList: false,
  fetchingListError: error
});

const handleFetchNextListSingleFailure = (
  state: PokemonState,
  errorsMap: { [key: string]: Error }
): PokemonState => {
  const pokemonList = [...state.pokemonList];

  Object.entries(errorsMap).forEach(([id, error]) => {
    const idx = idToIdx(id);
    pokemonList[idx] = {
      ...pokemonList[idx],
      isLoading: false,
      error
    };
  });

  return {
    ...state,
    pokemonList
  };
};

const handleFetchSingleStart = (
  state: PokemonState,
  id: string
): PokemonState => {
  const pokemonList = [...state.pokemonList];
  const idx = idToIdx(id);

  if (!pokemonList[idx]) {
    pokemonList[idx] = createSinglePokemonState(id);
  } else {
    pokemonList[idx] = { ...pokemonList[idx], isLoading: true };
  }

  return {
    ...state,
    pokemonList
  };
};

const handleFetchSingleSuccess = (
  state: PokemonState,
  pokemon: Pokemon
): PokemonState => {
  const pokemonList = [...state.pokemonList];
  const idx = idToIdx(pokemon.id);

  pokemonList[idx] = {
    ...pokemonList[idx],
    isLoading: false,
    pokemon
  };

  return {
    ...state,
    pokemonList
  };
};

const handleFetchSingleFailure = (
  state: PokemonState,
  { id, error }: { id: string; error: Error }
): PokemonState => {
  const pokemonList = [...state.pokemonList];
  const idx = idToIdx(id);

  pokemonList[idx] = {
    ...pokemonList[idx],
    isLoading: false,
    error
  };

  return {
    ...state,
    pokemonList
  };
};

const pokemonReducer = (
  state = INITIAL_STATE,
  action: PokemonAction
): PokemonState => {
  switch (action.type) {
    case PokemonActionType.FETCH_NEXT_LIST_START:
      console.log('FETCH_NEXT_LIST_START');
      return handleFetchNextListStart(state);
    case PokemonActionType.FETCH_NEXT_LIST_SINGLE_START:
      console.log('FETCH_NEXT_LIST_SINGLE_START');
      return handleFetchNextListSingleStart(state, action.payload);
    case PokemonActionType.FETCH_NEXT_LIST_SUCCESS:
      console.log('FETCH_NEXT_LIST_SUCCESS');
      return handleFetchNextListSuccess(state, action.payload);
    case PokemonActionType.FETCH_NEXT_LIST_FAILURE:
      console.log('FETCH_NEXT_LIST_FAILURE');
      return handleFetchNextListFailure(state, action.payload);
    case PokemonActionType.FETCH_NEXT_LIST_SINGLE_FAILURE:
      console.log('FETCH_NEXT_LIST_SINGLE_FAILURE');
      return handleFetchNextListSingleFailure(state, action.payload);
    case PokemonActionType.FETCH_SINGLE_START:
      console.log('FETCH_SINGLE_START');
      return handleFetchSingleStart(state, action.payload);
    case PokemonActionType.FETCH_SINGLE_SUCCESS:
      console.log('FETCH_SINGLE_SUCCESS');
      return handleFetchSingleSuccess(state, action.payload);
    case PokemonActionType.FETCH_SINGLE_FAILURE:
      console.log('FETCH_SINGLE_FAILURE');
      return handleFetchSingleFailure(state, action.payload);
    case PokemonActionType.CLEAR_POKEMON_LIST:
      console.log('CLEAR_POKEMON_LIST');
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default pokemonReducer;
