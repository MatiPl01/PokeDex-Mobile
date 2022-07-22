import { Pokemon, PokemonActionType } from './pokemon.types';
import { PokemonAction } from './pokemon.actions';
import config from '@config';

export type PokemonState = {
  allCount: number;
  nextUrl: string | null;
  pokemonList: Pokemon[];
  isLoading: boolean;
  error: Error | null;
};

const INITIAL_STATE: PokemonState = {
  allCount: 0,
  nextUrl: config.INITIAL_POKEMON_FETCH_URL,
  pokemonList: [],
  isLoading: false,
  error: null
};

const pokemonReducer = (
  state = INITIAL_STATE,
  action: PokemonAction
): PokemonState => {
  switch (action.type) {
    case PokemonActionType.FETCH_NEXT_POKEMON_START:
      return { ...state, isLoading: true };
    case PokemonActionType.FETCH_NEXT_POKEMON_SUCCESS:
      return {
        ...state,
        pokemonList: [...state.pokemonList, ...action.payload.pokemonList],
        nextUrl: action.payload.nextUrl,
        isLoading: false
      };
    case PokemonActionType.FETCH_NEXT_POKEMON_FAILURE:
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

export default pokemonReducer;
