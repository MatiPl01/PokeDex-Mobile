import { SearchState } from './search.reducer';
import { Dispatch } from 'react';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { Action, ActionWithPayload, createAction } from '@store/utils';
import { fetchPokemonSearchItems } from '@services/pokemon.service';
import { SearchActionType, PokemonSearchItem } from './search.types';

type FetchSearchItemsStart = Action<SearchActionType.FETCH_SEARCH_ITEMS_START>;

type FetchSearchItemsSuccess = ActionWithPayload<
  SearchActionType.FETCH_SEARCH_ITEMS_SUCCESS,
  PokemonSearchItem[]
>;

type FetchSearchItemsFailure = ActionWithPayload<
  SearchActionType.FETCH_SEARCH_ITEMS_FAILURE,
  Error
>;

export type SearchAction =
  | FetchSearchItemsStart
  | FetchSearchItemsSuccess
  | FetchSearchItemsFailure;

export const fetchSearchItemsStart = (): FetchSearchItemsStart =>
  createAction(SearchActionType.FETCH_SEARCH_ITEMS_START);

export const fetchSearchItemsSuccess = (
  searchItems: PokemonSearchItem[]
): FetchSearchItemsSuccess =>
  createAction(SearchActionType.FETCH_SEARCH_ITEMS_SUCCESS, searchItems);

export const fetchSearchItemsFailure = (
  error: Error
): FetchSearchItemsFailure =>
  createAction(SearchActionType.FETCH_SEARCH_ITEMS_FAILURE, error);

export const fetchSearchItemsAsync: ActionCreator<
  ThunkAction<Promise<void>, SearchState, void, SearchAction>
> =
  () =>
  async (dispatch: Dispatch<SearchAction>): Promise<void> => {
    console.log('fetch 2')
    dispatch(fetchSearchItemsStart());

    try {
      const searchItems = await fetchPokemonSearchItems();
      dispatch(fetchSearchItemsSuccess(searchItems));
    } catch (err) {
      dispatch(fetchSearchItemsFailure(err as Error));
    }
  };
