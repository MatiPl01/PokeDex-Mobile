import axios from 'axios';
import { API } from '@constants';
import { SearchItem } from '@utils/search';
import { kebabCaseToCamelCase } from '@utils/text';
import { catchThrowAsync } from '@utils/errors';
import {
  Pokemon,
  PokemonItem,
  PokemonImage,
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

export const fetchPokemonSearchItems = catchThrowAsync(
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

export const fetchPokemonList = catchThrowAsync(
  async (url: string): Promise<PokemonSearchResponse> => {
    return (await axios.get(url)).data;
  }
);

export const fetchSinglePokemonDataByUrl = catchThrowAsync(
  async (url: string): Promise<Pokemon> => {
    const res = (await axios.get<PokemonResponse>(url)).data;
    return pokemonDataTransform(res);
  }
);

export const fetchSinglePokemonDataById = catchThrowAsync(
  async (id: string): Promise<Pokemon> => {
    const url = `${API.URL}/pokemon/${id}`;
    return await fetchSinglePokemonDataByUrl(url);
  }
);

export const fetchItemDataById = catchThrowAsync(
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
  const images = [
    {
      name: 'Dream world - front default',
      url: sprites.other.dream_world.front_default
    },
    {
      name: 'Dream world - front female',
      url: sprites.other.dream_world.front_female
    },
    {
      name: 'Home - front default',
      url: sprites.other.home.front_default
    },
    {
      name: 'Home - front female',
      url: sprites.other.home.front_female
    },
    {
      name: 'Home - front shiny',
      url: sprites.other.home.front_shiny
    },
    {
      name: 'Home - front shiny female',
      url: sprites.other.home.front_shiny_female
    },
    {
      name: 'Official artwork - front default',
      url: sprites.other['official-artwork'].front_default
    },
    {
      name: 'Back default',
      url: sprites.back_default
    },
    {
      name: 'Back female',
      url: sprites.back_female
    },
    {
      name: 'Back shiny',
      url: sprites.back_shiny
    },
    {
      name: 'Back shiny female',
      url: sprites.back_shiny_female
    },
    {
      name: 'Front default',
      url: sprites.front_default
    },
    {
      name: 'Front female',
      url: sprites.front_female
    },
    {
      name: 'Front shiny',
      url: sprites.front_shiny
    },
    {
      name: 'Front shiny female',
      url: sprites.front_shiny_female
    }
  ].filter(({ url }) => !!url) as PokemonImage[];

  return {
    id: String(id),
    name,
    images,
    height,
    weight,
    baseExperience: base_experience,
    types: types.map(({ type }) => type.name),
    abilities: abilities.map(({ ability }) => ability.name).sort(),
    stats: stats.map(({ base_stat, stat }) => ({
      name: kebabCaseToCamelCase(stat.name) as PokemonStatName,
      value: base_stat
    })),
    items: held_items.map(({ item: { name, url } }) => ({
      name,
      id: getIdFromUrl(url)
    })),
    moves: moves.map(({ move: { name } }) => name).sort()
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
