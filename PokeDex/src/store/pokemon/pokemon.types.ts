export enum PokemonActionType {
  FETCH_NEXT_POKEMON_START = 'FETCH_NEXT_POKEMON_START',
  FETCH_NEXT_POKEMON_SUCCESS = 'FETCH_NEXT_POKEMON_SUCCESS',
  FETCH_NEXT_POKEMON_FAILURE = 'FETCH_NEXT_POKEMON_FAILURE'
}

export type PokemonListEntry = {
  name: string;
  url: string;
};

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListEntry[];
};

// The type below contains only properties that will be used to create the Pokemon object
export type PokemonResponse = {
  id: number;
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
  id: number;
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
