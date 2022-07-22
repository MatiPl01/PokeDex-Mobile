export enum PokemonActionType {
  FETCH_START = 'POKEMON_FETCH_START',
  FETCH_SUCCESS = 'POKEMON_FETCH_SUCCESS',
  FETCH_FAILURE = 'POKEMON_FETCH_FAILURE'
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

export type PokemonAbility = {
  ability: {
    name: string;
    url: string;
  };
  isHidden: boolean;
  slot: number;
};

export type Pokemon = {
  abilities: PokemonAbility[];
};
