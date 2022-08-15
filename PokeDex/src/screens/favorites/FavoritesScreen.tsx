import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectFavoritePokemonIdsList } from '@store/favorites/favorites.selector';
import { fetchPokemonBatchByIdsAsync } from '@store/pokemon/pokemon.actions';
import { selectPokemonStateListByIds } from '@store/pokemon/pokemon.selector';
import { setFavoritePokemonIds } from '@store/favorites/favorites.actions';
import { SinglePokemonState } from '@store/pokemon/pokemon.reducer';
import { RootState } from '@store';
import { POKEMON_LIST_PADDING_HORIZONTAL } from '@components/pokemon/PokemonList/PokemonList.styles';
import FavoritePokemonCard from '@components/pokemon/FavoritePokemonCard/FavoritePokemonCard';
import SortableGrid from '@components/shared/SortableGrid/SortableGrid';

const GRID_PADDING = POKEMON_LIST_PADDING_HORIZONTAL; // TODO - move this constant somewhere else
const GRID_GAP = POKEMON_LIST_PADDING_HORIZONTAL;

const FavoritesScreen: React.FC = () => {
  const dispatch = useDispatch();
  const [favoritesStates, setFavoritesStates] = useState<SinglePokemonState[]>(
    []
  );
  const favoritesIds = useSelector(selectFavoritePokemonIdsList);
  const selectedFavoritesStates = useSelector((rootState: RootState) =>
    selectPokemonStateListByIds(rootState, favoritesIds)
  );

  useEffect(() => {
    // TODO - make this useEffect run after refreshing Pokemon list (pull to refresh)
    if (favoritesIds.length)
      dispatch(fetchPokemonBatchByIdsAsync(favoritesIds, false));
  }, []);

  useEffect(() => {
    // TODO - the if statement below fixes the rerendering issue on the favorites order change
    // but introduces the new issue causing inability to drag some items
    // if (
    //   !areSetsEqual(new Set(selectedFavoritesStates), new Set(favoritesStates))
    // )
    setFavoritesStates(selectedFavoritesStates);
  }, [selectedFavoritesStates]);

  const updateFavoritesOrder = (data: SinglePokemonState[]) => {
    dispatch(setFavoritePokemonIds(data.map(({ id }) => id)));
  };

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
      data={favoritesStates}
      keyExtractor={({ id }) => id}
      renderItem={renderItem}
      columnCount={2}
      padding={{ x: GRID_PADDING, y: GRID_PADDING }}
      gap={GRID_GAP}
      onDragEnd={updateFavoritesOrder}
      onEndReached={() => console.log('end reached')} // TODO - replace fetching all Pokemon at once with fetching groups of Pokemon (similarly to the Pokemon screen)
    />
  );
};

export default FavoritesScreen;
