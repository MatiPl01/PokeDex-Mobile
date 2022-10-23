import { Dispatch } from 'react';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { Action, ActionWithPayload, createAction } from '@store/utils';
import { fetchPokemonSearchItems } from '@services/pokemon.service';
import { SearchItem } from '@utils/search';
import { SearchState } from './search.reducer';
import { SearchActionType } from './search.types';

type SetSearchValue = ActionWithPayload<
  SearchActionType.SET_SEARCH_VALUE,
  string
>;

type OpenSearchBar = Action<SearchActionType.OPEN_SEARCHBAR>;

type CloseSearchBar = Action<SearchActionType.CLOSE_SEARCHBAR>;

type FetchSearchItemsStart = Action<SearchActionType.FETCH_SEARCH_ITEMS_START>;

type FetchSearchItemsSuccess = ActionWithPayload<
  SearchActionType.FETCH_SEARCH_ITEMS_SUCCESS,
  SearchItem[]
>;

type FetchSearchItemsFailure = ActionWithPayload<
  SearchActionType.FETCH_SEARCH_ITEMS_FAILURE,
  Error
>;

export type SearchAction =
  | SetSearchValue
  | OpenSearchBar
  | CloseSearchBar
  | FetchSearchItemsStart
  | FetchSearchItemsSuccess
  | FetchSearchItemsFailure;

const fetchSearchItemsStart = (): FetchSearchItemsStart =>
  createAction(SearchActionType.FETCH_SEARCH_ITEMS_START);

const fetchSearchItemsSuccess = (
  searchItems: SearchItem[]
): FetchSearchItemsSuccess =>
  createAction(SearchActionType.FETCH_SEARCH_ITEMS_SUCCESS, searchItems);

const fetchSearchItemsFailure = (error: Error): FetchSearchItemsFailure =>
  createAction(SearchActionType.FETCH_SEARCH_ITEMS_FAILURE, error);

export const setSearchPokemonValue = (value: string): SetSearchValue =>
  createAction(SearchActionType.SET_SEARCH_VALUE, value);

export const openSearchBar = (): OpenSearchBar =>
  createAction(SearchActionType.OPEN_SEARCHBAR);

export const closeSearchBar = (): CloseSearchBar =>
  createAction(SearchActionType.CLOSE_SEARCHBAR);

export const fetchSearchItemsAsync: ActionCreator<
  ThunkAction<Promise<void>, SearchState, void, SearchAction>
> =
  () =>
  async (dispatch: Dispatch<SearchAction>): Promise<void> => {
    dispatch(fetchSearchItemsStart());

    try {
      const searchItems = await fetchPokemonSearchItems();
      dispatch(fetchSearchItemsSuccess(searchItems));
    } catch (err) {
      dispatch(fetchSearchItemsFailure(err as Error));
    }
  };
