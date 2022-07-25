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
import { PokemonActionType, PokemonSearchEntry } from './pokemon.types';
import store from '@store';

type FetchNextPokemonListStart =
  Action<PokemonActionType.FETCH_NEXT_LIST_START>;

type FetchNextPokemonListSuccess = ActionWithPayload<
  PokemonActionType.FETCH_NEXT_LIST_SUCCESS,
  string | null
>;

type FetchNextPokemonListFailure = ActionWithPayload<
  PokemonActionType.FETCH_NEXT_LIST_FAILURE,
  Error
>;

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
  | FetchNextPokemonListSuccess
  | FetchNextPokemonListFailure
  | FetchSinglePokemonStart
  | FetchSinglePokemonSuccess
  | FetchSinglePokemonFailure;

export const fetchNextPokemonListStart = (): FetchNextPokemonListStart =>
  createAction(PokemonActionType.FETCH_NEXT_LIST_START);

export const fetchNextPokemonListSuccess = (
  nextUrl: string | null
): FetchNextPokemonListSuccess =>
  createAction(PokemonActionType.FETCH_NEXT_LIST_SUCCESS, nextUrl);

export const fetchNextPokemonListFailure = (
  error: Error
): FetchNextPokemonListFailure =>
  createAction(PokemonActionType.FETCH_NEXT_LIST_FAILURE, error);

export const fetchSinglePokemonStart = (id: string): FetchSinglePokemonStart =>
  createAction(PokemonActionType.FETCH_SINGLE_START, id);

export const fetchSinglePokemonSuccess = (
  pokemon: Pokemon
): FetchSinglePokemonSuccess =>
  createAction(PokemonActionType.FETCH_SINGLE_SUCCESS, pokemon);

export const fetchSinglePokemonFailure = (
  id: string,
  error: Error
): FetchSinglePokemonFailure =>
  createAction(PokemonActionType.FETCH_SINGLE_FAILURE, {
    id,
    error
  });

export const fetchSinglePokemonAsync: ActionCreator<
  ThunkAction<Promise<void>, PokemonState, void, PokemonAction>
> =
  (id: string) =>
  async (dispatch: Dispatch<PokemonAction>): Promise<void> => {
    dispatch(fetchSinglePokemonStart(id));

    try {
      const pokemon = await fetchSinglePokemonDataById(id);
      dispatch(fetchSinglePokemonSuccess(pokemon));
    } catch (err) {
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

    try {
      console.log('here');
      const nextPokemonSearchResponse = await fetchPokemonList(url);
      console.log('res', nextPokemonSearchResponse);
      const pokemonPromises: Promise<void>[] =
        nextPokemonSearchResponse.results.map(
          async (entry: PokemonSearchEntry) => {
            const id = getPokemonIdFromUrl(entry.url);
            return store.dispatch(fetchSinglePokemonAsync(id));
          }
        );
      await Promise.all(pokemonPromises);
      dispatch(fetchNextPokemonListSuccess(nextPokemonSearchResponse.next));
    } catch (err) {
      dispatch(fetchNextPokemonListFailure(err as Error));
    }
  };
