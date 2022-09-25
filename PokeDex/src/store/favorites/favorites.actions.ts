import { ActionWithPayload, createAction } from '@store/utils';
import { FavoriteActionType } from './favorites.types';

type SetFavorites = ActionWithPayload<
  FavoriteActionType.SET_FAVORITES,
  string[]
>;

type SetDisplayedFavorites = ActionWithPayload<
  FavoriteActionType.SET_DISPLAYED_FAVORITES,
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
  | SetDisplayedFavorites
  | AddToFavorites
  | RemoveFromFavorites;

export const setFavoritePokemonIds = (pokemonIds: string[]): SetFavorites =>
  createAction(FavoriteActionType.SET_FAVORITES, pokemonIds);

export const setDisplayedFavoritePokemonIds = (
  pokemonIds: string[]
): SetDisplayedFavorites =>
  createAction(FavoriteActionType.SET_DISPLAYED_FAVORITES, pokemonIds);

export const addPokemonToFavorites = (pokemonId: string): AddToFavorites =>
  createAction(FavoriteActionType.ADD_TO_FAVORITES, pokemonId);

export const removePokemonFromFavorites = (
  pokemonIds: string[]
): RemoveFromFavorites =>
  createAction(FavoriteActionType.REMOVE_FROM_FAVORITES, pokemonIds);
