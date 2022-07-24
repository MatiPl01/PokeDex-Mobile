// import { PokemonState } from './pokemon.reducer';
// import { Dispatch } from 'react';
// import { ActionCreator } from 'redux';
// import { ThunkAction } from 'redux-thunk';
// import { fetchPokemonData } from '@services/pokemon.service';
// import { Action, ActionWithPayload, createAction } from '@store/utils';
// import { PokemonActionType, Pokemon } from './pokemon.types';

// type FetchNextPokemonStart = Action<PokemonActionType.FETCH_NEXT_START>;

// type FetchNextPokemonSuccess = ActionWithPayload<
//   PokemonActionType.FETCH_NEXT_SUCCESS,
//   {
//     pokemonList: Pokemon[];
//     nextUrl: string | null;
//   }
// >;

// type FetchNextPokemonFailure = ActionWithPayload<
//   PokemonActionType.FETCH_NEXT_FAILURE,
//   Error
// >;

// export type PokemonAction =
//   | FetchNextPokemonStart
//   | FetchNextPokemonSuccess
//   | FetchNextPokemonFailure;

// export const fetchNextPokemonStart = (): FetchNextPokemonStart =>
//   createAction(PokemonActionType.FETCH_NEXT_START);

// export const fetchNextPokemonSuccess = (
//   pokemonList: Pokemon[],
//   nextUrl: string | null
// ): FetchNextPokemonSuccess =>
//   createAction(PokemonActionType.FETCH_NEXT_SUCCESS, {
//     pokemonList,
//     nextUrl
//   });

// export const fetchNextPokemonFailure = (
//   error: Error
// ): FetchNextPokemonFailure =>
//   createAction(PokemonActionType.FETCH_NEXT_FAILURE, error);

// // export const fetchNextPokemonAsync: ActionCreator<
// //   ThunkAction<Promise<void>, PokemonState, void, PokemonAction>
// // > =
// //   (nextUrl: string | null) =>
// //   async (dispatch: Dispatch<PokemonAction>): Promise<void> => {
// //     if (!nextUrl) return;
// //     dispatch(fetchNextPokemonStart());

// //     try {
// //       const res = await fetchPokemonList(nextUrl);
// //       const pokemonList = await Promise.all(
// //         res.results.map(({ url }) => fetchPokemonData(url))
// //       );

// //       dispatch(fetchNextPokemonSuccess(pokemonList, res.next));
// //     } catch (err) {
// //       console.error(err);
// //       dispatch(fetchNextPokemonFailure(err as Error));
// //     }
// //   };
