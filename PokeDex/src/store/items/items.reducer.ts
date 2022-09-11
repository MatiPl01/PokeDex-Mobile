import { idToIdx } from '@utils/data';
import { PokemonItem } from '@store/pokemon/pokemon.types';
import { ItemsAction } from './items.actions';
import { ItemsActionType } from './items.types';

export type SingleItemState = {
  readonly id: string;
  readonly item: PokemonItem | null;
  readonly error: Error | null;
  readonly isLoading: boolean;
};

const createSingleItemState = (id: string): SingleItemState => ({
  id,
  item: null,
  isLoading: true,
  error: null
});

export type ItemsState = {
  readonly itemsList: SingleItemState[];
  readonly isLoading: boolean;
};

const INITIAL_STATE: ItemsState = {
  itemsList: [],
  isLoading: false
};

const handleFetchBatchStart = (
  state: ItemsState,
  ids: string[]
): ItemsState => {
  const itemsList = [...state.itemsList];

  ids.forEach(id => {
    const idx = idToIdx(id);
    if (!itemsList[idx]) itemsList[idx] = createSingleItemState(id);
  });

  return {
    ...state,
    itemsList,
    isLoading: true
  };
};

const handleFetchBatchSuccess = (
  state: ItemsState,
  items: Record<string, PokemonItem>
): ItemsState => {
  const itemsList = [...state.itemsList];

  Object.entries(items).forEach(([id, item]) => {
    const idx = idToIdx(id);
    itemsList[idx] = { ...itemsList[idx], item, isLoading: false };
  });

  return {
    ...state,
    itemsList,
    isLoading: false
  };
};

const handleFetchBatchFailure = (
  state: ItemsState,
  errors: Record<string, Error>
): ItemsState => {
  const itemsList = [...state.itemsList];

  Object.entries(errors).forEach(([id, error]) => {
    const idx = idToIdx(id);
    itemsList[idx] = { ...itemsList[idx], error, isLoading: false };
  });

  return {
    ...state,
    isLoading: false
  };
};

const handleFetchSingleStart = (state: ItemsState, id: string): ItemsState =>
  handleFetchBatchStart(state, [id]);

const handleFetchSingleSuccess = (
  state: ItemsState,
  item: PokemonItem
): ItemsState => handleFetchBatchSuccess(state, { [item.id]: item });

const handleFetchSingleFailure = (
  state: ItemsState,
  { id, error }: { id: string; error: Error }
): ItemsState => handleFetchBatchFailure(state, { [id]: error });

const itemsReducer = (
  state = INITIAL_STATE,
  action: ItemsAction
): ItemsState => {
  switch (action.type) {
    case ItemsActionType.FETCH_BATCH_START:
      return handleFetchBatchStart(state, action.payload);
    case ItemsActionType.FETCH_BATCH_SUCCESS:
      return handleFetchBatchSuccess(state, action.payload);
    case ItemsActionType.FETCH_BATCH_FAILURE:
      return handleFetchBatchFailure(state, action.payload);
    case ItemsActionType.FETCH_SINGLE_START:
      return handleFetchSingleStart(state, action.payload);
    case ItemsActionType.FETCH_SINGLE_SUCCESS:
      return handleFetchSingleSuccess(state, action.payload);
    case ItemsActionType.FETCH_SINGLE_FAILURE:
      return handleFetchSingleFailure(state, action.payload);
    default:
      return state;
  }
};

export default itemsReducer;
