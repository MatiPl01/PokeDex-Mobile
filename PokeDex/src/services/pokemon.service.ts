import axios from 'axios';
import {
  Pokemon,
  PokemonListResponse,
  PokemonResponse
} from '@store/pokemon/pokemon.types';

// TODO - add error handling
export const fetchPokemonList = async (url: string): Promise<PokemonListResponse> => {
  return await(await fetch(url)).json();
};

export const fetchPokemonData = async (url: string): Promise<Pokemon> => {
  const res = (await (await fetch(url)).json()) as PokemonResponse;
  console.log('resp', { res });
  return pokemonDataTransform(res);
};

const pokemonDataTransform = ({
  id,
  name,
  sprites,
  height,
  weight,
  types,
  abilities,
  stats
}: PokemonResponse): Pokemon => {
  return {
    id,
    name,
    spriteImgUrl:
      sprites.other.dream_world.front_default ||
      sprites.other.home.front_default ||
      sprites.other['official-artwork'].front_default ||
      sprites.front_default,
    height,
    weight,
    types: types.map(({ type }) => type.name),
    abilities: abilities.map(({ ability }) => ability.name),
    stats: stats.map(({ base_stat, stat }) => ({
      name: stat.name,
      value: base_stat
    }))
  };
};
