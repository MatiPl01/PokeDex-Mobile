import { FETCH_NEXT_POKEMON_COUNT } from './../../config';
import { API_URL } from '@config';
import { Pokemon, PokemonActionType } from '@store/pokemon/pokemon.types';
import { PokemonAction } from './pokemon.actions';

// Store stare separately for each pokemon to display correct loading indicators
export type SinglePokemonState = {
  pokemon: Pokemon | null;
  isLoading: boolean;
  error: Error | null;
};

export type PokemonState = {
  readonly pokemonMap: { [key: string]: SinglePokemonState };
  readonly loading: string[]; // array of loading pokemon ids
  readonly errors: { [key: string]: Error | null }; // Errors that happened while fetching particular pokemon
  readonly isFetchingList: boolean; // Indicates that pokemon list is being fetched
  readonly fetchingListError: Error | null; // Error that happened while fetching a list of pokemon
  readonly nextUrl: string | null; // Url to fetch next pokemon list
};

const INITIAL_STATE: PokemonState = {
  pokemonMap: {},
  loading: [],
  errors: {},
  isFetchingList: false,
  fetchingListError: null,
  nextUrl: `${API_URL}/pokemon?offset=0&limit=${FETCH_NEXT_POKEMON_COUNT}`
};

const handleFetchNextListFailure = (
  state: PokemonState,
  error: Error
): PokemonState => ({
  ...state,
  isFetchingList: false,
  fetchingListError: error
});

const handleFetchSingleStart = (
  state: PokemonState,
  id: string
): PokemonState => {
  state.loading.push(id);
  return {
    ...state,
    loading: [...new Set(state.loading)],
    pokemonMap: Object.assign({}, state.pokemonMap, {
      [id]: {
        ...state.pokemonMap[id],
        isLoading: true
      }
    })
  };
};

const handleFetchSingleSuccess = (
  state: PokemonState,
  pokemon: Pokemon
): PokemonState => ({
  ...state,
  loading: state.loading.filter(id => id !== pokemon.id),
  pokemonMap: Object.assign({}, state.pokemonMap, {
    [pokemon.id]: {
      ...state.pokemonMap[pokemon.id],
      pokemon,
      isLoading: false
    }
  })
});

const handleFetchSingleFailure = (
  state: PokemonState,
  { id, error }: { id: string; error: Error }
): PokemonState => ({
  ...state,
  loading: state.loading.filter(loadingId => loadingId !== id),
  pokemonMap: Object.assign({}, state.pokemonMap, {
    [id]: {
      ...state.pokemonMap[id],
      isLoading: false,
      error
    }
  })
});

const pokemonReducer = (
  state = INITIAL_STATE,
  action: PokemonAction
): PokemonState => {
  switch (action.type) {
    case PokemonActionType.FETCH_NEXT_LIST_START:
      return { ...state, isFetchingList: true };
    case PokemonActionType.FETCH_NEXT_LIST_SUCCESS:
      // State of each pokemon that was fetched will be updated individually after FETCH_SINGLE_SUCCESS action is dispatched
      return { ...state, isFetchingList: false, nextUrl: action.payload };
    case PokemonActionType.FETCH_NEXT_LIST_FAILURE:
      return handleFetchNextListFailure(state, action.payload);
    case PokemonActionType.FETCH_SINGLE_START:
      return handleFetchSingleStart(state, action.payload);
    case PokemonActionType.FETCH_SINGLE_SUCCESS:
      return handleFetchSingleSuccess(state, action.payload);
    case PokemonActionType.FETCH_SINGLE_FAILURE:
      return handleFetchSingleFailure(state, action.payload);
    default:
      return state;
  }
};

export default pokemonReducer;
