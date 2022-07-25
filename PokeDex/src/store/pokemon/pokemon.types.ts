import { SinglePokemonState } from './pokemon.reducer';

export enum PokemonActionType {
  FETCH_NEXT_LIST_START = 'pokemon/FETCH_NEXT_LIST_START',
  FETCH_NEXT_LIST_SUCCESS = 'pokemon/FETCH_NEXT_LIST_SUCCESS',
  FETCH_NEXT_LIST_FAILURE = 'pokemon/FETCH_NEXT_LIST_FAILURE',
  FETCH_SINGLE_START = 'pokemon/FETCH_SINGLE_START',
  FETCH_SINGLE_SUCCESS = 'pokemon/FETCH_SINGLE_SUCCESS',
  FETCH_SINGLE_FAILURE = 'pokemon/FETCH_SINGLE_FAILURE'
}

export type PokemonSearchEntry = {
  name: string;
  url: string;
};

export type PokemonSearchResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonSearchEntry[];
};

// The type below contains only properties that will be used to create the Pokemon object
export type PokemonResponse = {
  id: string;
  name: string;
  sprites: {
    other: {
      dream_world: {
        front_default: string;
      };
      home: {
        front_default: string;
      };
      'official-artwork': {
        front_default: string;
      };
    };
    front_default: string;
  };
  height: number;
  weight: number;
  types: [
    {
      type: {
        name: string;
      };
    }
  ];
  abilities: [
    {
      ability: {
        name: string;
      };
    }
  ];
  stats: [
    {
      base_stat: number;
      stat: {
        name: string;
      };
    }
  ];
};

export type Pokemon = {
  id: string;
  name: string;
  spriteImgUrl: string;
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
  stats: {
    name: string;
    value: number;
  }[];
};

export type PokemonListItem = {
  id: string;
} & SinglePokemonState;
