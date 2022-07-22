import { selectNextPokemonFetchUrl } from './pokemon.selector';
import { useSelector } from 'react-redux';
import {
  fetchPokemonList,
  fetchPokemonData
} from './../../services/pokemon.service';
import { PokemonActionType, Pokemon } from './pokemon.types';
import { Action, ActionWithPayload, createAction } from './../utils';
import { Dispatch } from 'react';

type FetchNextPokemonStart = Action<PokemonActionType.FETCH_NEXT_POKEMON_START>;

type FetchNextPokemonSuccess = ActionWithPayload<
  PokemonActionType.FETCH_NEXT_POKEMON_SUCCESS,
  {
    pokemonList: Pokemon[];
    nextUrl: string | null;
  }
>;

type FetchNextPokemonFailure = ActionWithPayload<
  PokemonActionType.FETCH_NEXT_POKEMON_FAILURE,
  Error
>;

export type PokemonAction =
  | FetchNextPokemonStart
  | FetchNextPokemonSuccess
  | FetchNextPokemonFailure;

export const fetchNextPokemonStart = (): FetchNextPokemonStart =>
  createAction(PokemonActionType.FETCH_NEXT_POKEMON_START);

export const fetchNextPokemonSuccess = (
  pokemonList: Pokemon[],
  nextUrl: string | null
): FetchNextPokemonSuccess =>
  createAction(PokemonActionType.FETCH_NEXT_POKEMON_SUCCESS, {
    pokemonList,
    nextUrl
  });

export const fetchNextPokemonFailure = (
  error: Error
): FetchNextPokemonFailure =>
  createAction(PokemonActionType.FETCH_NEXT_POKEMON_FAILURE, error);

export const fetchNextPokemonAsync =
  (nextUrl: string | null) => async (dispatch: Dispatch<PokemonAction>) => {
    if (!nextUrl) return;
    console.log('START');
    dispatch(fetchNextPokemonStart());

    try {
      const res = await fetchPokemonList(nextUrl);
      console.log({ res })
      const pokemonList = await Promise.all(
        res.results.map(({ url }) => fetchPokemonData(url))
      );
      console.log('SUCCESS');

      dispatch(fetchNextPokemonSuccess(pokemonList, res.next));
    } catch (err) {
      console.error(err);
      dispatch(fetchNextPokemonFailure(err as Error));
    }
  };
