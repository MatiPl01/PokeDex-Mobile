import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { createAnimatedStyle } from '@utils/reanimated';
import { selectFavoritePokemonIdsList } from '@store/favorites/favorites.selector';
import { fetchPokemonBatchByIdsAsync } from '@store/pokemon/pokemon.actions';
import { selectPokemonStateListByIds } from '@store/pokemon/pokemon.selector';
import {
  removePokemonFromFavorites,
  setFavoritePokemonIds
} from '@store/favorites/favorites.actions';
import { SinglePokemonState } from '@store/pokemon/pokemon.reducer';
import { Padding } from '@types';
import { RootState } from '@store';
import { POKEMON_LIST_PADDING_HORIZONTAL as GRID_PADDING_HORIZONTAL } from '@components/pokemon/PokemonList/PokemonList.styles';
import {
  SEARCH_ICON_SIZE as EDIT_BUTTON_SIZE,
  SEARCH_BAR_PADDING_TOP as EDIT_BUTTON_OFFSET_TOP
} from '@components/shared/SearchBar/SearchBar.styles';
import FavoritePokemonCard from '@components/favorites/FavoritePokemonCard/FavoritePokemonCard';
import SortableGrid from '@components/shared/SortableGrid/SortableGrid';

const GRID_GAP = GRID_PADDING_HORIZONTAL;

const padding: Padding = {
  top: EDIT_BUTTON_OFFSET_TOP,
  left: GRID_PADDING_HORIZONTAL,
  right: GRID_PADDING_HORIZONTAL,
  bottom: EDIT_BUTTON_OFFSET_TOP
};

const useAnimatedGridHeaderStyle = createAnimatedStyle({
  height: [0, EDIT_BUTTON_OFFSET_TOP + EDIT_BUTTON_SIZE]
});

type FavoritesGridProps = {
  editable?: boolean;
};

const FavoritesGrid: React.FC<FavoritesGridProps> = ({ editable = false }) => {
  const dispatch = useDispatch();
  const [favoritesStates, setFavoritesStates] = useState<SinglePokemonState[]>(
    []
  );
  const favoritesIds = useSelector(selectFavoritePokemonIdsList);
  const selectedFavoritesStates = useSelector((rootState: RootState) =>
    selectPokemonStateListByIds(rootState, favoritesIds)
  );

  const gridHeaderAnimationProgress = useSharedValue(0);
  const animatedGridHeaderStyle = useAnimatedGridHeaderStyle(
    gridHeaderAnimationProgress
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
  }, [selectedFavoritesStates, favoritesIds]);

  useEffect(() => {
    gridHeaderAnimationProgress.value = withTiming(+editable, {
      duration: 300
    });
  }, [editable]);

  const updateFavoritesOrder = (data: SinglePokemonState[]) => {
    dispatch(setFavoritePokemonIds(data.map(({ id }) => id)));
  };

  const handleFavoriteDelete = (id: string) => {
    dispatch(removePokemonFromFavorites([id]));
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
        deletable={editable}
        onDelete={handleFavoriteDelete}
      />
    );
  };

  return (
    <SortableGrid
      data={favoritesStates}
      keyExtractor={({ id }) => id}
      renderItem={renderItem}
      columnCount={2}
      padding={padding}
      gap={GRID_GAP}
      onDragEnd={updateFavoritesOrder}
      editable={editable}
      onEndReached={() => console.log('end reached')} // TODO - replace fetching all Pokemon at once with fetching groups of Pokemon (similarly to the Pokemon screen)
      GridHeaderComponent={<Animated.View style={animatedGridHeaderStyle} />}
    />
  );
};

export default FavoritesGrid;
