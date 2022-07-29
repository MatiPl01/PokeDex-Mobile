import { Dispatch } from 'react';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { Pokemon } from '@store/pokemon/pokemon.types';
import {
  getPokemonIdFromUrl,
  fetchPokemonList,
  fetchSinglePokemonDataById
} from '@services/pokemon.service';
import { Action, ActionWithPayload, createAction } from '@store/utils';
import { PokemonState } from './pokemon.reducer';
import { PokemonActionType } from './pokemon.types';
import store from '@store';

type FetchNextPokemonListStart =
  Action<PokemonActionType.FETCH_NEXT_LIST_START>;
  
type FetchNextPokemonListSingleStart = ActionWithPayload<
  PokemonActionType.FETCH_NEXT_LIST_SINGLE_START,
  string[]
>;

type FetchNextPokemonListSuccess = ActionWithPayload<
  PokemonActionType.FETCH_NEXT_LIST_SUCCESS,
  {
    nextUrl: string | null;
    pokemonMap: { [key: string]: Pokemon };
  }
>;

type FetchNextPokemonListFailure = ActionWithPayload<
  PokemonActionType.FETCH_NEXT_LIST_FAILURE,
  Error
>;

type FetchNextPokemonListSingleFailure = ActionWithPayload<
  PokemonActionType.FETCH_NEXT_LIST_SINGLE_FAILURE,
  { [key: string]: Error }
>;

type ClearPokemonList = Action<PokemonActionType.CLEAR_POKEMON_LIST>;

type FetchSinglePokemonStart = ActionWithPayload<
  PokemonActionType.FETCH_SINGLE_START,
  string
>;

type FetchSinglePokemonSuccess = ActionWithPayload<
  PokemonActionType.FETCH_SINGLE_SUCCESS,
  Pokemon
>;

type FetchSinglePokemonFailure = ActionWithPayload<
  PokemonActionType.FETCH_SINGLE_FAILURE,
  {
    id: string;
    error: Error;
  }
>;

export type PokemonAction =
  | FetchNextPokemonListStart
  | FetchNextPokemonListSingleStart
  | FetchNextPokemonListSuccess
  | FetchNextPokemonListFailure
  | FetchNextPokemonListSingleFailure
  | ClearPokemonList
  | FetchSinglePokemonStart
  | FetchSinglePokemonSuccess
  | FetchSinglePokemonFailure;

const fetchNextPokemonListStart = (): FetchNextPokemonListStart =>
  createAction(PokemonActionType.FETCH_NEXT_LIST_START);

const fetchNextPokemonListSuccess = (
  nextUrl: string | null,
  pokemonMap: { [key: string]: Pokemon }
): FetchNextPokemonListSuccess =>
  createAction(PokemonActionType.FETCH_NEXT_LIST_SUCCESS, {
    nextUrl,
    pokemonMap
  });

const fetchNextPokemonListSingleStart = (
  pokemonIds: string[]
): FetchNextPokemonListSingleStart =>
  createAction(PokemonActionType.FETCH_NEXT_LIST_SINGLE_START, pokemonIds);

const fetchNextPokemonListFailure = (
  error: Error
): FetchNextPokemonListFailure =>
  createAction(PokemonActionType.FETCH_NEXT_LIST_FAILURE, error);

const fetchNextPokemonListSingleFailure = (errors: {
  [key: string]: Error;
}): FetchNextPokemonListSingleFailure =>
  createAction(PokemonActionType.FETCH_NEXT_LIST_SINGLE_FAILURE, errors);

const clearPokemonList = (): ClearPokemonList =>
  createAction(PokemonActionType.CLEAR_POKEMON_LIST);

const fetchSinglePokemonStart = (id: string): FetchSinglePokemonStart =>
  createAction(PokemonActionType.FETCH_SINGLE_START, id);

const fetchSinglePokemonSuccess = (
  pokemon: Pokemon
): FetchSinglePokemonSuccess =>
  createAction(PokemonActionType.FETCH_SINGLE_SUCCESS, pokemon);

const fetchSinglePokemonFailure = (
  id: string,
  error: Error
): FetchSinglePokemonFailure =>
  createAction(PokemonActionType.FETCH_SINGLE_FAILURE, {
    id,
    error
  });

const fetchSinglePokemonAsync: ActionCreator<
  ThunkAction<Promise<void>, PokemonState, void, PokemonAction>
> =
  (id: string) =>
  async (dispatch: Dispatch<PokemonAction>): Promise<void> => {
    dispatch(fetchSinglePokemonStart(id));

    try {
      const pokemon = await fetchSinglePokemonDataById(id);
      dispatch(fetchSinglePokemonSuccess(pokemon));
    } catch (err) {
      console.error(err);
      dispatch(fetchSinglePokemonFailure(id, err as Error));
    }
  };

export const fetchNextPokemonListAsync: ActionCreator<
  ThunkAction<Promise<void>, PokemonState, void, PokemonAction>
> =
  () =>
  async (dispatch: Dispatch<PokemonAction>): Promise<void> => {
    const url = store.getState().pokemon.nextUrl;
    if (!url) return;
    dispatch(fetchNextPokemonListStart());

    // Fetch next pokemon urls
    let nextUrl: string | null;
    let pokemonUrls: string[] = [];
    try {
      const res = await fetchPokemonList(url);
      pokemonUrls = res.results.map(({ url }) => url);
      nextUrl = res.next;
    } catch (err) {
      console.error(err);
      dispatch(fetchNextPokemonListFailure(err as Error));
      return;
    }

    // Fetch next pokemon data
    const pokemonMap: { [key: string]: Pokemon } = {};
    const errorsMap: { [key: string]: Error } = {};
    const pokemonIds = pokemonUrls.map(getPokemonIdFromUrl);
    dispatch(fetchNextPokemonListSingleStart(pokemonIds));

    for (const id of pokemonIds) {
      try {
        pokemonMap[id] = await fetchSinglePokemonDataById(id);
      } catch (err) {
        errorsMap[id] = err as Error;
      }
    }

    if (Object.keys(errorsMap).length) {
      dispatch(fetchNextPokemonListSingleFailure(errorsMap));
    }
    if (Object.keys(pokemonMap).length) {
      dispatch(fetchNextPokemonListSuccess(nextUrl, pokemonMap));
    }
  };

export const refetchPokemonList: ActionCreator<
  ThunkAction<Promise<void>, PokemonState, void, PokemonAction>
> =
  () =>
  async (
    dispatch: Dispatch<
      | PokemonAction
      | ThunkAction<Promise<void>, PokemonState, void, PokemonAction>
    >
  ): Promise<void> => {
    dispatch(clearPokemonList());
    dispatch(fetchNextPokemonListAsync());
  };
