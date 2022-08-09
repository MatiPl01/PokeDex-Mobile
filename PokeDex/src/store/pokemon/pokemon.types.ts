import { ImageExtension } from '@utils/files';

export enum PokemonActionType {
  FETCH_BATCH_START = 'pokemon/FETCH_BATCH_START',
  FETCH_BATCH_SUCCESS = 'pokemon/FETCH_BATCH_SUCCESS',
  FETCH_BATCH_FAILURE = 'pokemon/FETCH_BATCH_FAILURE',
  FETCH_SINGLE_START = 'pokemon/FETCH_SINGLE_START',
  FETCH_SINGLE_SUCCESS = 'pokemon/FETCH_SINGLE_SUCCESS',
  FETCH_SINGLE_FAILURE = 'pokemon/FETCH_SINGLE_FAILURE',
  FETCH_NEXT_URLS_START = 'pokemon/FETCH_NEXT_URLS_START',
  FETCH_NEXT_URLS_SUCCESS = 'pokemon/FETCH_NEXT_URLS_SUCCESS',
  FETCH_NEXT_URLS_FAILURE = 'pokemon/FETCH_NEXT_URLS_FAILURE',
  RESET_POKEMON_STATE = 'pokemon/RESET_POKEMON_STATE',
  SET_DISPLAYED_POKEMON_WIDTH_IDS = 'pokemon/SET_DISPLAYED_POKEMON_WIDTH_IDS',
  DISPLAY_ALL_POKEMON = 'pokemon/DISPLAY_ALL_POKEMON'
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

export enum PokemonType {
  NORMAL = 'normal',
  FIGHTING = 'fighting',
  FLYING = 'flying',
  POISON = 'poison',
  GROUND = 'ground',
  ROCK = 'rock',
  BUG = 'bug',
  GHOST = 'ghost',
  STEEL = 'steel',
  FIRE = 'fire',
  WATER = 'water',
  GRASS = 'grass',
  ELECTRIC = 'electric',
  PSYCHIC = 'psychic',
  ICE = 'ice',
  DRAGON = 'dragon',
  DARK = 'dark',
  FAIRY = 'fairy'
}

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
        name: PokemonType;
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
  imageUrl: string | null;
  imageExtension: ImageExtension | null;
  height: number;
  weight: number;
  types: PokemonType[];
  abilities: string[];
  stats: {
    name: string;
    value: number;
  }[];
};
