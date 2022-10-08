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
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
    other: {
      dream_world: {
        front_default: string | null;
        front_female: string | null;
      };
      home: {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
      'official-artwork': {
        front_default: string | null;
      };
    };
  };
  height: number;
  weight: number;
  base_experience: number;
  types: {
    type: {
      name: PokemonType;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  held_items: {
    item: {
      name: string;
      url: string;
    };
  }[];
  moves: {
    move: {
      name: string;
    };
  }[];
};

export type PokemonStatName =
  | 'hp'
  | 'attack'
  | 'defense'
  | 'specialAttack'
  | 'specialDefense'
  | 'speed';

export type PokemonImage = {
  name?: string;
  url: string;
  extension: ImageExtension;
};

export type Pokemon = {
  id: string;
  name: string;
  height: number;
  weight: number;
  baseExperience: number;
  images: PokemonImage[];
  types: PokemonType[];
  abilities: string[];
  stats: {
    name: PokemonStatName;
    value: number;
  }[];
  items: {
    name: string;
    id: string;
  }[];
  moves: string[];
};

export type PokemonItemResponse = {
  id: number;
  cost: number;
  name: string;
  sprites: {
    default: string;
  };
};

export type PokemonItem = {
  id: string;
  imageUrl: string;
  name: string;
  cost: number;
};
