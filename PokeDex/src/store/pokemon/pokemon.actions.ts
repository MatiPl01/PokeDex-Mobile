import { Dispatch } from 'react';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { API } from '@constants';
import {
  getPokemonIdFromUrl,
  fetchPokemonList,
  fetchSinglePokemonDataById
} from '@services/pokemon.service';
import { sleep } from '@utils/time';
import store from '@store';
import { Pokemon } from '@store/pokemon/pokemon.types';
import { Action, ActionWithPayload, createAction } from '@store/utils';
import { idToIdx } from './pokemon.utils';
import { PokemonState } from './pokemon.reducer';
import { PokemonActionType } from './pokemon.types';

type FetchPokemonBatchStart = ActionWithPayload<
  PokemonActionType.FETCH_BATCH_START,
  {
    ids: string[];
    updateDisplayed: boolean;
  }
>;

type FetchPokemonBatchSuccess = ActionWithPayload<
  PokemonActionType.FETCH_BATCH_SUCCESS,
  {
    pokemonMap: { [key: string]: Pokemon };
    updateIdsOrder: string[];
    updateDisplayed: boolean;
  }
>;

type FetchPokemonBatchFailure = ActionWithPayload<
  PokemonActionType.FETCH_BATCH_FAILURE,
  {
    errorsMap: { [key: string]: Error };
    updateIdsOrder: string[];
    updateDisplayed: boolean;
  }
>;

type FetchSingleStart = ActionWithPayload<
  PokemonActionType.FETCH_SINGLE_START,
  {
    id: string;
    updateDisplayed: boolean;
  }
>;

type FetchSingleSuccess = ActionWithPayload<
  PokemonActionType.FETCH_SINGLE_SUCCESS,
  {
    id: string;
    pokemon: Pokemon;
    updateDisplayed: boolean;
  }
>;

type FetchSingleFailure = ActionWithPayload<
  PokemonActionType.FETCH_SINGLE_FAILURE,
  {
    id: string;
    error: Error;
    updateDisplayed: boolean;
  }
>;

type FetchNextPokemonUrlsStart =
  Action<PokemonActionType.FETCH_NEXT_URLS_START>;

type FetchNextPokemonUrlsSuccess = ActionWithPayload<
  PokemonActionType.FETCH_NEXT_URLS_SUCCESS,
  string | null
>;

type FetchNextPokemonUrlsFailure = ActionWithPayload<
  PokemonActionType.FETCH_NEXT_URLS_FAILURE,
  Error
>;

type ResetPokemonState = Action<PokemonActionType.RESET_POKEMON_STATE>;

type DisplayAllPokemon = Action<PokemonActionType.DISPLAY_ALL_POKEMON>;

type SetDisplayedPokemonWithIds = ActionWithPayload<
  PokemonActionType.SET_DISPLAYED_POKEMON_WIDTH_IDS,
  string[]
>;

export type PokemonAction =
  | FetchPokemonBatchStart
  | FetchPokemonBatchSuccess
  | FetchPokemonBatchFailure
  | FetchSingleSuccess
  | FetchSingleStart
  | FetchSingleFailure
  | FetchNextPokemonUrlsStart
  | FetchNextPokemonUrlsSuccess
  | FetchNextPokemonUrlsFailure
  | ResetPokemonState
  | SetDisplayedPokemonWithIds
  | DisplayAllPokemon;

const fetchPokemonBatchStart = (
  ids: string[],
  updateDisplayed: boolean
): FetchPokemonBatchStart =>
  createAction(PokemonActionType.FETCH_BATCH_START, {
    ids,
    updateDisplayed
  });

const fetchPokemonBatchSuccess = (
  pokemonMap: { [key: string]: Pokemon },
  updateIdsOrder: string[],
  updateDisplayed: boolean
): FetchPokemonBatchSuccess =>
  createAction(PokemonActionType.FETCH_BATCH_SUCCESS, {
    pokemonMap,
    updateIdsOrder,
    updateDisplayed
  });

const fetchPokemonBatchFailure = (
  errorsMap: { [key: string]: Error },
  updateIdsOrder: string[],
  updateDisplayed: boolean
): FetchPokemonBatchFailure =>
  createAction(PokemonActionType.FETCH_BATCH_FAILURE, {
    errorsMap,
    updateIdsOrder,
    updateDisplayed
  });

const fetchSinglePokemonStart = (
  id: string,
  updateDisplayed: boolean
): FetchSingleStart =>
  createAction(PokemonActionType.FETCH_SINGLE_START, { id, updateDisplayed });

const fetchSinglePokemonSuccess = (
  id: string,
  pokemon: Pokemon,
  updateDisplayed: boolean
): FetchSingleSuccess =>
  createAction(PokemonActionType.FETCH_SINGLE_SUCCESS, {
    id,
    pokemon,
    updateDisplayed
  });

const fetchSinglePokemonFailure = (
  id: string,
  error: Error,
  updateDisplayed: boolean
): FetchSingleFailure =>
  createAction(PokemonActionType.FETCH_SINGLE_FAILURE, {
    id,
    error,
    updateDisplayed
  });

const fetchNextPokemonUrlsStart = (): FetchNextPokemonUrlsStart =>
  createAction(PokemonActionType.FETCH_NEXT_URLS_START);

const fetchNextPokemonUrlsSuccess = (
  nextUrl: string | null
): FetchNextPokemonUrlsSuccess =>
  createAction(PokemonActionType.FETCH_NEXT_URLS_SUCCESS, nextUrl);

const fetchNextPokemonUrlsFailure = (
  error: Error
): FetchNextPokemonUrlsFailure =>
  createAction(PokemonActionType.FETCH_NEXT_URLS_FAILURE, error);

const resetPokemonState = (): ResetPokemonState =>
  createAction(PokemonActionType.RESET_POKEMON_STATE);

const setDisplayedPokemonWithIds = (
  ids: string[]
): SetDisplayedPokemonWithIds =>
  createAction(PokemonActionType.SET_DISPLAYED_POKEMON_WIDTH_IDS, ids);

export const displayAllPokemon = (): DisplayAllPokemon =>
  createAction(PokemonActionType.DISPLAY_ALL_POKEMON);

export const displayPokemonWithIds: ActionCreator<
  ThunkAction<Promise<void>, PokemonState, void, PokemonAction>
> =
  (ids: string[]) =>
  async (
    dispatch: Dispatch<
      | PokemonAction
      | ThunkAction<Promise<void>, PokemonState, void, PokemonAction>
    >
  ): Promise<void> => {
    // Display Pokemon that have been already fetched
    dispatch(setDisplayedPokemonWithIds(ids));
    // Fetch remaining Pokemon
    dispatch(fetchPokemonBatchByIdsAsync(ids));
  };

export const fetchPokemonBatchByIdsAsync: ActionCreator<
  ThunkAction<Promise<void>, PokemonState, void, PokemonAction>
> =
  (ids: string[], updateDisplayed = true) =>
  async (dispatch: Dispatch<PokemonAction>): Promise<void> => {
    dispatch(fetchPokemonBatchStart(ids, updateDisplayed));
    // Filter out ids of Pokemon that have been fetched before
    const fetchedPokemonList = store.getState().pokemon.allPokemonList;
    const pokemonToFetchIds = ids.filter(
      id => fetchedPokemonList[idToIdx(id)]?.isLoading
    );

    // Fetch next pokemon data
    const pokemonMap: { [key: string]: Pokemon } = {};
    const errorsMap: { [key: string]: Error } = {};
    // Fetch Pokemon in portions (not all at once)
    for (
      let i = 0;
      i < pokemonToFetchIds.length;
      i += API.FETCH_POKEMON_PER_BATCH
    ) {
      const fetchPortionIds = pokemonToFetchIds.slice(
        i,
        i + API.FETCH_POKEMON_PER_BATCH
      );

      for (const id of fetchPortionIds) {
        try {
          pokemonMap[id] = await fetchSinglePokemonDataById(id);
        } catch (err) {
          errorsMap[id] = err as Error;
        }
      }

      if (Object.keys(errorsMap).length) {
        dispatch(fetchPokemonBatchFailure(errorsMap, ids, updateDisplayed));
      }
      if (Object.keys(pokemonMap).length) {
        dispatch(fetchPokemonBatchSuccess(pokemonMap, ids, updateDisplayed));
      }

      await sleep(API.BATCH_FETCH_INTERVAL);
    }
  };

export const fetchNextPokemonBatchAsync: ActionCreator<
  ThunkAction<Promise<void>, PokemonState, void, PokemonAction>
> =
  () =>
  async (
    dispatch: Dispatch<
      | PokemonAction
      | ThunkAction<Promise<void>, PokemonState, void, PokemonAction>
    >
  ): Promise<void> => {
    const { nextUrl } = store.getState().pokemon;
    if (!nextUrl) return;

    // Fetch next pokemon urls
    let pokemonUrls: string[] = [];
    try {
      dispatch(fetchNextPokemonUrlsStart());
      const res = await fetchPokemonList(nextUrl);
      pokemonUrls = res.results.map(({ url }) => url);
      dispatch(fetchNextPokemonUrlsSuccess(res.next));
    } catch (err) {
      console.error(err);
      dispatch(fetchNextPokemonUrlsFailure(err as Error));
      return;
    }

    // Fetch next pokemon data
    const pokemonIds = pokemonUrls.map(getPokemonIdFromUrl);
    dispatch(fetchPokemonBatchByIdsAsync(pokemonIds));
  };

export const fetchSinglePokemonByIdAsync: ActionCreator<
  ThunkAction<Promise<void>, PokemonState, void, PokemonAction>
> =
  (id: string, updateDisplayed = true) =>
  async (dispatch: Dispatch<PokemonAction>): Promise<void> => {
    // Don't fetch if there is already Pokemon with the specific id in the store
    const allPokemonList = store.getState().pokemon.allPokemonList;
    if (allPokemonList[idToIdx(id)]) return;

    dispatch(fetchSinglePokemonStart(id, updateDisplayed));
    try {
      const pokemon = await fetchSinglePokemonDataById(id);
      dispatch(fetchSinglePokemonSuccess(id, pokemon, updateDisplayed));
    } catch (err) {
      console.error(err);
      dispatch(fetchSinglePokemonFailure(id, err as Error, updateDisplayed));
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
    dispatch(resetPokemonState());
    dispatch(fetchNextPokemonBatchAsync());
  };
