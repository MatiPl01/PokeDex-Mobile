import { ActionWithPayload, createAction } from '@store/utils';
import { FavoriteActionType } from './favorites.types';

type SetFavorites = ActionWithPayload<
  FavoriteActionType.SET_FAVORITES,
  string[]
>;

type AddToFavorites = ActionWithPayload<
  FavoriteActionType.ADD_TO_FAVORITES,
  string
>;

type RemoveFromFavorites = ActionWithPayload<
  FavoriteActionType.REMOVE_FROM_FAVORITES,
  string[]
>;

export type FavoritesAction =
  | SetFavorites
  | AddToFavorites
  | RemoveFromFavorites;

export const setFavoritePokemonIds = (pokemonIds: string[]): SetFavorites =>
  createAction(FavoriteActionType.SET_FAVORITES, pokemonIds);

export const addPokemonToFavorites = (pokemonId: string): AddToFavorites =>
  createAction(FavoriteActionType.ADD_TO_FAVORITES, pokemonId);

export const removePokemonFromFavorites = (
  pokemonIds: string[]
): RemoveFromFavorites =>
  createAction(FavoriteActionType.REMOVE_FROM_FAVORITES, pokemonIds);
