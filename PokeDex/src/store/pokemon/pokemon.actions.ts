import { Dispatch } from 'react';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { API } from '@constants';
import {
  getIdFromUrl,
  fetchPokemonList,
  fetchSinglePokemonDataById
} from '@services/pokemon.service';
import { sleep } from '@utils/time';
import { idToIdx } from '@utils/data';
import store from '@store';
import { Pokemon } from '@store/pokemon/pokemon.types';
import { Action, ActionWithPayload, createAction } from '@store/utils';
import { PokemonState } from './pokemon.reducer';
import { PokemonActionType } from './pokemon.types';

type FetchBatchStart = ActionWithPayload<
  PokemonActionType.FETCH_BATCH_START,
  {
    ids: string[];
    updateDisplayed: boolean;
  }
>;

type FetchBatchSuccess = ActionWithPayload<
  PokemonActionType.FETCH_BATCH_SUCCESS,
  {
    pokemonMap: Record<string, Pokemon>;
    updateIdsOrder: string[];
    updateDisplayed: boolean;
  }
>;

type FetchBatchFailure = ActionWithPayload<
  PokemonActionType.FETCH_BATCH_FAILURE,
  {
    errorsMap: Record<string, Error>;
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

type FetchNextUrlsStart = Action<PokemonActionType.FETCH_NEXT_URLS_START>;

type FetchNextUrlsSuccess = ActionWithPayload<
  PokemonActionType.FETCH_NEXT_URLS_SUCCESS,
  string | null
>;

type FetchNextUrlsFailure = ActionWithPayload<
  PokemonActionType.FETCH_NEXT_URLS_FAILURE,
  Error
>;

type ResetPokemonState = Action<PokemonActionType.RESET_POKEMON_STATE>;

type DisplayAllPokemon = Action<PokemonActionType.DISPLAY_ALL_POKEMON>;

type SetDisplayedPokemonWithIds = ActionWithPayload<
  PokemonActionType.SET_DISPLAYED_POKEMON_WIDTH_IDS,
  { ids: string[]; loadedStatesCount?: number }
>;

export type PokemonAction =
  | FetchBatchStart
  | FetchBatchSuccess
  | FetchBatchFailure
  | FetchSingleSuccess
  | FetchSingleStart
  | FetchSingleFailure
  | FetchNextUrlsStart
  | FetchNextUrlsSuccess
  | FetchNextUrlsFailure
  | ResetPokemonState
  | SetDisplayedPokemonWithIds
  | DisplayAllPokemon;

const fetchBatchStart = (
  ids: string[],
  updateDisplayed: boolean
): FetchBatchStart =>
  createAction(PokemonActionType.FETCH_BATCH_START, {
    ids,
    updateDisplayed
  });

const fetchBatchSuccess = (
  pokemonMap: Record<string, Pokemon>,
  updateIdsOrder: string[],
  updateDisplayed: boolean
): FetchBatchSuccess =>
  createAction(PokemonActionType.FETCH_BATCH_SUCCESS, {
    pokemonMap,
    updateIdsOrder,
    updateDisplayed
  });

const fetchBatchFailure = (
  errorsMap: Record<string, Error>,
  updateIdsOrder: string[],
  updateDisplayed: boolean
): FetchBatchFailure =>
  createAction(PokemonActionType.FETCH_BATCH_FAILURE, {
    errorsMap,
    updateIdsOrder,
    updateDisplayed
  });

const fetchSingleStart = (
  id: string,
  updateDisplayed: boolean
): FetchSingleStart =>
  createAction(PokemonActionType.FETCH_SINGLE_START, { id, updateDisplayed });

const fetchSingleSuccess = (
  id: string,
  pokemon: Pokemon,
  updateDisplayed: boolean
): FetchSingleSuccess =>
  createAction(PokemonActionType.FETCH_SINGLE_SUCCESS, {
    id,
    pokemon,
    updateDisplayed
  });

const fetchSingleFailure = (
  id: string,
  error: Error,
  updateDisplayed: boolean
): FetchSingleFailure =>
  createAction(PokemonActionType.FETCH_SINGLE_FAILURE, {
    id,
    error,
    updateDisplayed
  });

const fetchNextUrlsStart = (): FetchNextUrlsStart =>
  createAction(PokemonActionType.FETCH_NEXT_URLS_START);

const fetchNextUrlsSuccess = (nextUrl: string | null): FetchNextUrlsSuccess =>
  createAction(PokemonActionType.FETCH_NEXT_URLS_SUCCESS, nextUrl);

const fetchNextUrlsFailure = (error: Error): FetchNextUrlsFailure =>
  createAction(PokemonActionType.FETCH_NEXT_URLS_FAILURE, error);

const resetPokemonState = (): ResetPokemonState =>
  createAction(PokemonActionType.RESET_POKEMON_STATE);

const setDisplayedPokemonWithIds = (
  ids: string[],
  setDisplayedStates?: boolean
): SetDisplayedPokemonWithIds =>
  createAction(PokemonActionType.SET_DISPLAYED_POKEMON_WIDTH_IDS, {
    ids,
    setDisplayedStates
  });

export const displayAllPokemon = (): DisplayAllPokemon =>
  createAction(PokemonActionType.DISPLAY_ALL_POKEMON);

export const displayPokemonWithIds: ActionCreator<
  ThunkAction<Promise<void>, PokemonState, void, PokemonAction>
> =
  (ids: string[], fetchAllAtOnce = true) =>
  async (
    dispatch: Dispatch<
      | PokemonAction
      | ThunkAction<Promise<void>, PokemonState, void, PokemonAction>
    >
  ): Promise<void> => {
    if (fetchAllAtOnce) {
      // Display Pokemon that have been already fetched
      dispatch(setDisplayedPokemonWithIds(ids));
      // Fetch remaining Pokemon
      dispatch(fetchPokemonBatchByIdsAsync(ids));
    } else {
      // Display Pokemon that have been already fetched
      dispatch(setDisplayedPokemonWithIds(ids, false));
      // Fetch next Pokemon batch
      dispatch(fetchNextPokemonBatchAsync());
    }
  };

export const fetchPokemonBatchByIdsAsync: ActionCreator<
  ThunkAction<Promise<void>, PokemonState, void, PokemonAction>
> =
  (ids: string[], updateDisplayed = true) =>
  async (dispatch: Dispatch<PokemonAction>): Promise<void> => {
    dispatch(fetchBatchStart(ids, updateDisplayed));
    // Filter out ids of Pokemon that have been fetched before
    const fetchedPokemonList = store.getState().pokemon.allPokemonList;
    const pokemonToFetchIds = ids.filter(
      id => fetchedPokemonList[idToIdx(id)]?.isLoading
    );

    if (!pokemonToFetchIds.length) {
      dispatch(fetchBatchSuccess({}, ids, updateDisplayed));
      return;
    }

    // Fetch next pokemon data
    const pokemonMap: Record<string, Pokemon> = {};
    const errorsMap: Record<string, Error> = {};
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
        dispatch(fetchBatchFailure(errorsMap, ids, updateDisplayed));
      }
      if (Object.keys(pokemonMap).length) {
        dispatch(fetchBatchSuccess(pokemonMap, ids, updateDisplayed));
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
    const pokemonState = store.getState().pokemon;
    let pokemonIds: string[] = [];

    // Fetch next Pokemon using the nextUrl if all Pokemon are displayed
    if (pokemonState.areAllDisplayed) {
      const { nextUrl } = pokemonState;
      if (!nextUrl) return;
      try {
        // Fetch next pokemon urls
        dispatch(fetchNextUrlsStart());
        const res = await fetchPokemonList(nextUrl);
        const pokemonUrls = res.results.map(({ url }) => url);
        dispatch(fetchNextUrlsSuccess(res.next));
        pokemonIds = pokemonUrls.map(getIdFromUrl);
      } catch (err) {
        console.error(err);
        dispatch(fetchNextUrlsFailure(err as Error));
        return;
      }
      // Otherwise, fetch next Pokemon part from pokemonToDisplayIds
    } else {
      const { pokemonToDisplayIds, displayedPokemonStates } = pokemonState;
      pokemonIds = pokemonToDisplayIds.slice(
        displayedPokemonStates.length,
        displayedPokemonStates.length + API.FETCH_POKEMON_PER_BATCH
      );
    }

    // Fetch next pokemon data
    dispatch(fetchPokemonBatchByIdsAsync(pokemonIds));
  };

export const fetchSinglePokemonByIdAsync: ActionCreator<
  ThunkAction<Promise<void>, PokemonState, void, PokemonAction>
> =
  (id: string, updateDisplayed = false) =>
  async (dispatch: Dispatch<PokemonAction>): Promise<void> => {
    // Don't fetch if there is already a Pokemon with the specific id in the store
    const allPokemonList = store.getState().pokemon.allPokemonList;
    if (allPokemonList[idToIdx(id)]) return;

    dispatch(fetchSingleStart(id, updateDisplayed));
    try {
      const pokemon = await fetchSinglePokemonDataById(id);
      dispatch(fetchSingleSuccess(id, pokemon, updateDisplayed));
    } catch (err) {
      console.error(err);
      dispatch(fetchSingleFailure(id, err as Error, updateDisplayed));
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
