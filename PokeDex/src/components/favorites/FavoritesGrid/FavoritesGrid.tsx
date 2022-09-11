import React, { useEffect, useState, useRef } from 'react';
import Animated, {
  useSharedValue,
  withTiming,
  ZoomIn
} from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'styled-components';
import { API } from '@constants';
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
import FavoritePokemonCard from '@components/favorites/FavoritePokemonCard/FavoritePokemonCard';
import SortableGrid from '@components/shared/react/SortableGrid/SortableGrid';
import FavoritesGridFooter from './FavoritesGridFooter';
import NoFavoritePokemon from './NoFavoritePokemon';

type FavoritesGridProps = {
  editable?: boolean;
};

const FavoritesGrid: React.FC<FavoritesGridProps> = ({ editable = false }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const favoritesIds = useSelector(selectFavoritePokemonIdsList);
  const [displayedFavoritesIds, setDisplayedFavoritesIds] = useState<string[]>(
    []
  );
  const favoritesStates = useSelector((rootState: RootState) =>
    selectPokemonStateListByIds(rootState, displayedFavoritesIds)
  );
  const currDisplayedCountRef = useRef(0);
  const prevDisplayedCountRef = useRef(0);
  const remainingAnimationTime = useRef(0);
  const gridHeaderAnimationProgress = useSharedValue(0);

  const areAllDisplayed = favoritesIds.length === displayedFavoritesIds.length;
  const PADDING = theme.space.lg;
  const GRID_GAP = theme.space.lg;
  const padding: Padding = {
    top: PADDING,
    left: PADDING,
    right: PADDING,
    bottom: PADDING
  };

  useEffect(() => {
    if (!displayedFavoritesIds.length) return fetchNextFavorites();
    setDisplayedFavoritesIds(
      favoritesIds.slice(0, displayedFavoritesIds.length)
    );
  }, [favoritesIds]);

  useEffect(() => {
    prevDisplayedCountRef.current = currDisplayedCountRef.current;
    currDisplayedCountRef.current = displayedFavoritesIds.length;
    dispatch(fetchPokemonBatchByIdsAsync(displayedFavoritesIds, false));
  }, [displayedFavoritesIds]);

  useEffect(() => {
    gridHeaderAnimationProgress.value = withTiming(+editable, {
      duration: 300
    });
  }, [editable]);

  const fetchNextFavorites = () => {
    // Don't fetch more pokemon if all favorite pokemon have been already fetched
    if (favoritesStates.length === favoritesIds.length) return;
    // Update displayed favorites ids only after favorites states were updated
    if (displayedFavoritesIds.length === favoritesStates.length) {
      setDisplayedFavoritesIds([
        ...displayedFavoritesIds,
        ...favoritesIds.slice(
          favoritesStates.length,
          favoritesStates.length + API.FETCH_FAVORITES_PER_BATCH
        )
      ]);
    }
  };

  const updateFavoritesOrder = (data: SinglePokemonState[]) => {
    dispatch(setFavoritePokemonIds(data.map(({ id }) => id)));
  };

  const handleFavoriteDelete = (id: string) => {
    dispatch(removePokemonFromFavorites([id]));
  };

  const renderItem = (
    {
      item: { pokemon, isLoading },
      width
    }: {
      item: SinglePokemonState;
      width: number;
    },
    index: number
  ) => {
    const animationDelay = (index - prevDisplayedCountRef.current) * 250;

    return (
      <Animated.View entering={ZoomIn.duration(500).delay(animationDelay)}>
        <FavoritePokemonCard
          pokemon={pokemon}
          isLoading={isLoading}
          width={width}
          deletable={editable}
          onDelete={handleFavoriteDelete}
        />
      </Animated.View>
    );
  };

  if (!favoritesIds.length) return <NoFavoritePokemon />;

  return (
    <SortableGrid<SinglePokemonState>
      data={favoritesStates}
      keyExtractor={({ id }) => id}
      renderItem={renderItem}
      columnCount={2}
      padding={padding}
      rowGap={GRID_GAP}
      columnGap={GRID_GAP}
      onDragEnd={updateFavoritesOrder}
      editable={editable}
      onEndReached={fetchNextFavorites}
      onEndReachedThreshold={0.5}
      editablePaddingTop={theme.size.lg + theme.space.lg}
      GridFooterComponent={
        areAllDisplayed ? undefined : <FavoritesGridFooter />
      }
    />
  );
};

export default FavoritesGrid;