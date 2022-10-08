import { Dispatch } from 'react';
import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { fetchItemDataById } from '@services/pokemon.service';
import { idToIdx } from '@utils/data';
import store from '@store';
import { ActionWithPayload, createAction } from '@store/utils';
import { PokemonItem } from '@store/pokemon/pokemon.types';
import { ItemsActionType } from './items.types';
import { ItemsState } from './items.reducer';

type FetchSingleStart = ActionWithPayload<
  ItemsActionType.FETCH_SINGLE_START,
  string
>;

type FetchSingleSuccess = ActionWithPayload<
  ItemsActionType.FETCH_SINGLE_SUCCESS,
  PokemonItem
>;

type FetchSingleFailure = ActionWithPayload<
  ItemsActionType.FETCH_SINGLE_FAILURE,
  {
    id: string;
    error: Error;
  }
>;

type FetchBatchStart = ActionWithPayload<
  ItemsActionType.FETCH_BATCH_START,
  string[]
>;

type FetchBatchSuccess = ActionWithPayload<
  ItemsActionType.FETCH_BATCH_SUCCESS,
  Record<string, PokemonItem>
>;

type FetchBatchFailure = ActionWithPayload<
  ItemsActionType.FETCH_BATCH_FAILURE,
  Record<string, Error>
>;

export type ItemsAction =
  | FetchSingleStart
  | FetchSingleSuccess
  | FetchSingleFailure
  | FetchBatchStart
  | FetchBatchSuccess
  | FetchBatchFailure;

const fetchSingleStart = (id: string): FetchSingleStart =>
  createAction(ItemsActionType.FETCH_SINGLE_START, id);

const fetchSingleSuccess = (item: PokemonItem): FetchSingleSuccess =>
  createAction(ItemsActionType.FETCH_SINGLE_SUCCESS, item);

const fetchSingleFailure = (id: string, error: Error): FetchSingleFailure =>
  createAction(ItemsActionType.FETCH_SINGLE_FAILURE, { id, error });

const fetchBatchStart = (ids: string[]): FetchBatchStart =>
  createAction(ItemsActionType.FETCH_BATCH_START, ids);

const fetchBatchSuccess = (
  items: Record<string, PokemonItem>
): FetchBatchSuccess =>
  createAction(ItemsActionType.FETCH_BATCH_SUCCESS, items);

const fetchBatchFailure = (errors: Record<string, Error>): FetchBatchFailure =>
  createAction(ItemsActionType.FETCH_BATCH_FAILURE, errors);

export const fetchPokemonItemAsync: ActionCreator<
  ThunkAction<Promise<void>, ItemsState, void, ItemsAction>
> =
  (id: string) =>
  async (dispatch: Dispatch<ItemsAction>): Promise<void> => {
    // Don't fetch if there is already an item with the specific id in the store
    const itemsList = store.getState().items.itemsList;
    if (itemsList[idToIdx(id)]) return;

    dispatch(fetchSingleStart(id));
    try {
      const item = await fetchItemDataById(id);
      dispatch(fetchSingleSuccess(item));
    } catch (err) {
      console.error(err);
      dispatch(fetchSingleFailure(id, err as Error));
    }
  };

export const fetchPokemonItemsBatchAsync: ActionCreator<
  ThunkAction<Promise<void>, ItemsState, void, ItemsAction>
> =
  (ids: string[]) =>
  async (dispatch: Dispatch<ItemsAction>): Promise<void> => {
    // Filter out ids of items that had been fetched before
    const itemsList = store.getState().items.itemsList;
    const fetchIds = ids.filter(id => !itemsList[idToIdx(id)]);
    dispatch(fetchBatchStart(fetchIds));
  
    // Fetch items data
    const itemsMap: Record<string, PokemonItem> = {};
    const errorsMap: Record<string, Error> = {};

    for (const id of ids) {
      try {
        itemsMap[id] = await fetchItemDataById(id);
      } catch (err) {
        errorsMap[id] = err as Error;
      }
    }

    if (Object.keys(errorsMap).length) {
      dispatch(fetchBatchFailure(errorsMap));
    }
    if (Object.keys(itemsMap).length) {
      dispatch(fetchBatchSuccess(itemsMap));
    }
  };
