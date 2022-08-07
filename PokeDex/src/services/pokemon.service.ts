import axios from 'axios';
import { SearchItem } from '@utils/search';
import { API_URL, FETCH_SEARCH_ITEMS_LIMIT } from '@config';
import {
  Pokemon,
  PokemonResponse,
  PokemonSearchResponse
} from '@store/pokemon/pokemon.types';
import {
  PokemonSearchItemsResponse,
  PokemonSearchItemResponse
} from '@store/search/search.types';
import { catchThrowAxiosError } from '@utils/errors';
import { getImageExtensionFromUrl } from '@utils/files';

export const getPokemonIdFromUrl = (url: string): string => {
  return url.replace(`${API_URL}/pokemon`, '').replace(/\//g, '');
};

export const getNextPokemonCountFromUrl = (url: string) => {
  const match = url.match(/limit=\d+/);
  return match ? match[0]?.replace('limit=', '') : 0;
};

export const fetchPokemonSearchItems = catchThrowAxiosError(
  async (): Promise<SearchItem[]> => {
    const results: SearchItem[] = [];
    let url:
      | string
      | null = `${API_URL}/pokemon?offset=0&limit=${FETCH_SEARCH_ITEMS_LIMIT}`;

    do {
      const res: PokemonSearchItemsResponse = (
        await axios.get<PokemonSearchItemsResponse>(url)
      ).data;

      url = res.next;

      results.push(
        ...res.results.map((item: PokemonSearchItemResponse) => ({
          value: item.name,
          id: getPokemonIdFromUrl(item.url)
        }))
      );
    } while (url);

    return results;
  }
);

export const fetchPokemonList = catchThrowAxiosError(
  async (url: string): Promise<PokemonSearchResponse> => {
    return (await axios.get(url)).data;
  }
);

export const fetchSinglePokemonDataByUrl = catchThrowAxiosError(
  async (url: string): Promise<Pokemon> => {
    const res = (await axios.get<PokemonResponse>(url)).data;
    return pokemonDataTransform(res);
  }
);

export const fetchSinglePokemonDataById = catchThrowAxiosError(
  async (id: string): Promise<Pokemon> => {
    const url = `${API_URL}/pokemon/${id}`;
    return await fetchSinglePokemonDataByUrl(url);
  }
);

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
  const imageUrl =
    sprites.other.dream_world.front_default ||
    sprites.other.home.front_default ||
    sprites.other['official-artwork'].front_default ||
    sprites.front_default;

  return {
    id: String(id),
    name,
    imageUrl,
    imageExtension: imageUrl ? getImageExtensionFromUrl(imageUrl) : null,
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
