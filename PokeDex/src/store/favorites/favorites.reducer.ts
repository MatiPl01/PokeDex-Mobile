import { FavoriteActionType } from './favorites.types';
import { FavoritesAction } from './favorites.actions';

export type FavoritesPokemonState = {
  readonly favoritesIdsList: string[];
  readonly displayedFavoritesIdsList: string[];
};

const INITIAL_STATE: FavoritesPokemonState = {
  favoritesIdsList: [],
  displayedFavoritesIdsList: []
};

const handleSetFavoritesIds = (
  state: FavoritesPokemonState,
  favoritesIds: string[]
): FavoritesPokemonState => {
  const displayedFavoritesIdsSet = new Set(state.displayedFavoritesIdsList);

  return {
    ...state,
    favoritesIdsList: favoritesIds,
    displayedFavoritesIdsList: favoritesIds.filter(id =>
      displayedFavoritesIdsSet.has(id)
    )
  };
};

const handleAddToFavorites = (
  state: FavoritesPokemonState,
  pokemonId: string
): FavoritesPokemonState => ({
  ...state,
  favoritesIdsList:
    state.favoritesIdsList.indexOf(pokemonId) === -1
      ? [...state.favoritesIdsList, pokemonId]
      : state.favoritesIdsList
});

const handleRemoveFromFavorites = (
  state: FavoritesPokemonState,
  pokemonIds: string[]
): FavoritesPokemonState => {
  const removedIdSet = new Set(pokemonIds);

  return {
    ...state,
    favoritesIdsList: state.favoritesIdsList.filter(
      id => !removedIdSet.has(id)
    ),
    displayedFavoritesIdsList: state.displayedFavoritesIdsList.filter(
      id => !removedIdSet.has(id)
    )
  };
};

const favoritesReducer = (
  state = INITIAL_STATE,
  action: FavoritesAction
): FavoritesPokemonState => {
  switch (action.type) {
    case FavoriteActionType.SET_FAVORITES:
      return handleSetFavoritesIds(state, action.payload);
    case FavoriteActionType.SET_DISPLAYED_FAVORITES:
      return { ...state, displayedFavoritesIdsList: action.payload };
    case FavoriteActionType.ADD_TO_FAVORITES:
      return handleAddToFavorites(state, action.payload);
    case FavoriteActionType.REMOVE_FROM_FAVORITES:
      return handleRemoveFromFavorites(state, action.payload);
    default:
      return state;
  }
};

export default favoritesReducer;
