import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectFavoritePokemonIdsList } from '@store/favorites/favorites.selector';
import { fetchPokemonBatchByIdsAsync } from '@store/pokemon/pokemon.actions';
import { selectPokemonStateListByIds } from '@store/pokemon/pokemon.selector';
import { SinglePokemonState } from '@store/pokemon/pokemon.reducer';
import { RootState } from '@store';
import FavoritePokemonCard from '@components/pokemon/FavoritePokemonCard/FavoritePokemonCard';
import SortableGrid from '@components/shared/SortableGrid/SortableGrid';
import { POKEMON_LIST_PADDING_HORIZONTAL } from '@components/pokemon/PokemonList/PokemonList.styles';

const GRID_PADDING = POKEMON_LIST_PADDING_HORIZONTAL; // TODO - move this constant somewhere else
const GRID_GAP = POKEMON_LIST_PADDING_HORIZONTAL;

const FavoritesScreen: React.FC = () => {
  const dispatch = useDispatch();
  const favoritesIds = useSelector(selectFavoritePokemonIdsList);
  const favoritePokemonStates = useSelector((rootState: RootState) =>
    selectPokemonStateListByIds(rootState, favoritesIds)
  );

  useEffect(() => {
    // TODO - make this useEffect run after refreshing Pokemon list (pull to refresh)
    if (favoritesIds)
      dispatch(fetchPokemonBatchByIdsAsync(favoritesIds, false));
  }, [favoritesIds]);

  const renderItem = ({
    item: { pokemon, isLoading },
    size
  }: {
    item: SinglePokemonState;
    size: number;
  }) => {
    return (
      <FavoritePokemonCard
        pokemon={pokemon}
        isLoading={isLoading}
        width={size}
      />
    );
  };

  return (
    <SortableGrid
      data={favoritePokemonStates}
      keyExtractor={({ id }) => id}
      renderItem={renderItem}
      columnCount={2}
      padding={{ x: GRID_PADDING, y: GRID_PADDING }}
      gap={GRID_GAP}
    />
  );
};

export default FavoritesScreen;
