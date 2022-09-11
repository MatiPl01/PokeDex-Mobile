import axios from 'axios';
import { API } from '@constants';
import { SearchItem } from '@utils/search';
import { kebabCaseToCamelCase } from '@utils/text';
import { catchThrowAxiosError } from '@utils/errors';
import { getImageExtensionFromUrl } from '@utils/files';
import {
  Pokemon,
  PokemonItem,
  PokemonItemResponse,
  PokemonResponse,
  PokemonSearchResponse,
  PokemonStatName
} from '@store/pokemon/pokemon.types';
import {
  PokemonSearchItemsResponse,
  PokemonSearchItemResponse
} from '@store/search/search.types';

export const getIdFromUrl = (url: string): string => {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 2];
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
      | null = `${API.URL}/pokemon?offset=0&limit=${API.FETCH_SEARCH_ITEMS_PER_BATCH}`;

    do {
      const res: PokemonSearchItemsResponse = (
        await axios.get<PokemonSearchItemsResponse>(url)
      ).data;

      url = res.next;

      results.push(
        ...res.results.map((item: PokemonSearchItemResponse) => ({
          value: item.name,
          id: getIdFromUrl(item.url)
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
    const url = `${API.URL}/pokemon/${id}`;
    return await fetchSinglePokemonDataByUrl(url);
  }
);

export const fetchItemDataById = catchThrowAxiosError(
  async (id: string): Promise<PokemonItem> => {
    const url = `${API.URL}/item/${id}`;
    const res = (await axios.get<PokemonItemResponse>(url)).data;
    return pokemonImageTransform(res);
  }
);

const pokemonDataTransform = ({
  id,
  name,
  sprites,
  height,
  weight,
  base_experience,
  types,
  abilities,
  stats,
  held_items,
  moves
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
    baseExperience: base_experience,
    types: types.map(({ type }) => type.name),
    abilities: abilities.map(({ ability }) => ability.name),
    stats: stats.map(({ base_stat, stat }) => ({
      name: kebabCaseToCamelCase(stat.name) as PokemonStatName,
      value: base_stat
    })),
    items: held_items.map(({ item: { name, url } }) => ({
      name,
      id: getIdFromUrl(url)
    })),
    moves: moves.map(({ move: { name } }) => name)
  };
};

const pokemonImageTransform = ({
  id,
  cost,
  name,
  sprites
}: PokemonItemResponse): PokemonItem => ({
  id: String(id),
  cost,
  name,
  imageUrl: sprites.default
});
