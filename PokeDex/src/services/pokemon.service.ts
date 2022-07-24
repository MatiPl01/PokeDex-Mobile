import axios, { AxiosError } from 'axios';
import { API_URL, FETCH_SEARCH_ITEMS_LIMIT } from '@config';
import { Pokemon, PokemonResponse } from '@store/pokemon/pokemon.types';
import {
  PokemonSearchItemsResponse,
  PokemonSearchItemResponse,
  PokemonSearchItem
} from '@store/search/search.types';

export const fetchPokemonSearchItems = async (): Promise<
  PokemonSearchItem[]
> => {
  const endpoint = `${API_URL}/pokemon`;
  const results: PokemonSearchItem[] = [];
  let url:
    | string
    | null = `${endpoint}?offset=0&limit=${FETCH_SEARCH_ITEMS_LIMIT}`;

  try {
    do {
      const res: PokemonSearchItemsResponse = (
        await axios.get<PokemonSearchItemsResponse>(url)
      ).data;
      console.log('fetch 3 >>> ', url);

      url = res.next;

      results.push(
        ...res.results.map((item: PokemonSearchItemResponse) => ({
          value: item.name,
          url: item.url,
          id: item.url.replace(endpoint, '').replace(/\//g, '')
        }))
      );
    } while (url);

    return results;
  } catch (error) {
    const err = error as AxiosError;
    throw new Error(err.message);
  }
};

export const fetchPokemonData = async (url: string): Promise<Pokemon> => {
  const res = (await axios.get<PokemonResponse>(url)).data;
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
