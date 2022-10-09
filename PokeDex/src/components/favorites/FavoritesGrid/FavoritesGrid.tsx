import React, { useEffect, useRef, useState } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useDerivedValue,
  useSharedValue,
  withTiming,
  ZoomIn
} from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'styled-components';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@core/navigation/Navigation';
import { useNavigation } from '@react-navigation/native';
import { Padding } from '@types';
import { ANIMATION, API } from '@constants';
import {
  selectDisplayedFavoritePokemonIdsList,
  selectFavoritePokemonIdsList
} from '@store/favorites/favorites.selector';
import { fetchPokemonBatchByIdsAsync } from '@store/pokemon/pokemon.actions';
import { selectPokemonStateListByIds } from '@store/pokemon/pokemon.selector';
import {
  removePokemonFromFavorites,
  setDisplayedFavoritePokemonIds,
  setFavoritePokemonIds
} from '@store/favorites/favorites.actions';
import { SinglePokemonState } from '@store/pokemon/pokemon.reducer';
import { RootState } from '@store';
import FavoritePokemonCard from '@components/favorites/FavoritePokemonCard/FavoritePokemonCard';
import SortableGrid from '@components/shared/react/SortableGrid/SortableGrid';
import FavoritesGridFooter from './FavoritesGridFooter';
import NoFavoritePokemon from './NoFavoritePokemon';

const getPrevFavoritesIds = (
  favoritesIds: string[]
): Record<string, string | null> => {
  const prevFavoritesIds: Record<string, string | null> = {};
  if (!favoritesIds.length) return prevFavoritesIds;

  prevFavoritesIds[favoritesIds[0]] = null;
  for (let i = 1; i < favoritesIds.length; i++) {
    prevFavoritesIds[favoritesIds[i]] = favoritesIds[i - 1];
  }

  return prevFavoritesIds;
};

const isValidPokemonState = (
  item: SinglePokemonState | undefined,
  id: string
): item is SinglePokemonState => item?.id === id;

const getDisplayedFavoritesStates = (
  displayedFavoritesIds: string[],
  favoritesStates: (SinglePokemonState | undefined)[]
): SinglePokemonState[] => {
  const displayedFavoritesStates: SinglePokemonState[] = [];

  for (let i = 0; i < displayedFavoritesIds.length; i++) {
    const item = favoritesStates[i];
    if (!isValidPokemonState(item, displayedFavoritesIds[i])) break;
    displayedFavoritesStates.push(item);
  }

  return displayedFavoritesStates;
};

type AnimationTimestamp = {
  start: number;
  delay: number;
};

const getAnimationTimestamp = (
  animationTimestamps: Record<string, AnimationTimestamp>,
  prevPokemonId: string | null
): AnimationTimestamp => {
  const currTime = new Date().getTime();
  let delay: number;
  if (!prevPokemonId) delay = 0;
  else if (!animationTimestamps[prevPokemonId]) {
    delay = ANIMATION.DELAY.MAX_FAVORITES_APPEAR;
  } else {
    const elapsed = Math.max(
      0,
      currTime - animationTimestamps[prevPokemonId].start
    );
    const prevDelay = animationTimestamps[prevPokemonId].delay;

    delay = Math.min(
      ANIMATION.DELAY.MAX_FAVORITES_APPEAR,
      Math.max(0, prevDelay + ANIMATION.INTERVAL.FAVORITES_APPEAR - elapsed)
    );
  }

  return {
    start: currTime + delay,
    delay
  };
};

type FavoritesGridProps = {
  editable?: boolean;
  setEditingEnabled?: (enabled: boolean) => void;
};

const FavoritesGrid: React.FC<FavoritesGridProps> = ({
  editable = false,
  setEditingEnabled
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'FullScreenStack'>>();
  const favoritesIds = useSelector(selectFavoritePokemonIdsList);
  const displayedFavoritesIds = useSelector(
    selectDisplayedFavoritePokemonIdsList
  );
  const favoritesStates = useSelector((rootState: RootState) =>
    selectPokemonStateListByIds(rootState, displayedFavoritesIds)
  );
  const prevFavoritesIds = useRef<Record<string, string | null>>({});
  const animationTimestamps = useRef<Record<string, AnimationTimestamp>>({});
  const isCardBeingDragged = useSharedValue(false);
  const areFavoritesDeletable = useSharedValue(false);
  const gridHeaderAnimationProgress = useSharedValue(0);
  const [displayedFavoritesStates, setDisplayedFavoritesStates] = useState<
    SinglePokemonState[]
  >([]);

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
    prevFavoritesIds.current = getPrevFavoritesIds(favoritesIds);
    if (displayedFavoritesIds.length < favoritesIds.length)
      fetchNextFavorites();
  }, [favoritesIds]);

  useEffect(() => {
    setEditingEnabled?.(!!displayedFavoritesIds.length);
  }, [displayedFavoritesIds]);

  useEffect(() => {
    // Displayed favorites states will be an array of subsequent favorite Pokemon states
    // If some Pokemon were fetched earlier and there is a gap between fetched Pokemon
    // states, Pokemon that were fetched before will not be displayed until fetching
    // Pokemon from a gap begins.
    setDisplayedFavoritesStates(
      getDisplayedFavoritesStates(displayedFavoritesIds, favoritesStates)
    );
  }, [favoritesStates]);

  useEffect(() => {
    gridHeaderAnimationProgress.value = withTiming(+editable, {
      duration: 300
    });
  }, [editable]);

  useDerivedValue(() => {
    areFavoritesDeletable.value = editable && !isCardBeingDragged.value;
  }, [isCardBeingDragged, editable]);

  const fetchNextFavorites = () => {
    // Don't fetch more pokemon if all favorite pokemon have been already fetched
    if (favoritesStates.length === favoritesIds.length) return;
    // Update displayed favorites ids only after favorites states were updated
    if (displayedFavoritesIds.length === favoritesStates.length) {
      const newDisplayedFavoritesIds = [
        ...displayedFavoritesIds,
        ...favoritesIds.slice(
          favoritesStates.length,
          favoritesStates.length + API.FETCH_FAVORITES_PER_BATCH
        )
      ];
      // Update the state and fetch new displayed favorite Pokemon
      dispatch(setDisplayedFavoritePokemonIds(newDisplayedFavoritesIds));
      dispatch(fetchPokemonBatchByIdsAsync(newDisplayedFavoritesIds, false));
    }
  };

  const updateFavoritesOrder = (data: SinglePokemonState[]) => {
    dispatch(
      setFavoritePokemonIds([
        // Update order of displayed favorite Pokemon
        ...data.map(({ id }) => id),
        // Add remaining favorite Pokemon ids (that were not displayed)
        ...favoritesIds.slice(displayedFavoritesIds.length)
      ])
    );
  };

  const handleFavoriteDelete = (id: string) => {
    dispatch(removePokemonFromFavorites([id]));
  };

  const handleDragStart = () => {
    isCardBeingDragged.value = true;
  };

  const handleDragEnd = (data: SinglePokemonState[]) => {
    isCardBeingDragged.value = false;
    updateFavoritesOrder(data);
  };

  const renderItem = ({
    item: { id: pokemonId, pokemon, isLoading },
    width
  }: {
    item: SinglePokemonState;
    width: number;
  }) => {
    const { delay } = (animationTimestamps.current[pokemonId] =
      getAnimationTimestamp(
        animationTimestamps.current,
        prevFavoritesIds.current[pokemonId]
      ));

    return (
      <Animated.View entering={ZoomIn.duration(500).delay(delay)}>
        <Pressable
          onPress={() => {
            if (!isCardBeingDragged.value)
              navigation.navigate('FullScreenStack', {
                screen: 'PokemonDetails',
                params: { pokemonId }
              });
          }}
        >
          <FavoritePokemonCard
            pokemon={pokemon}
            isLoading={isLoading}
            width={width}
            onDelete={handleFavoriteDelete}
            deletable={areFavoritesDeletable}
          />
        </Pressable>
      </Animated.View>
    );
  };

  if (!favoritesIds.length) return <NoFavoritePokemon />;

  return (
    <SortableGrid<SinglePokemonState>
      data={displayedFavoritesStates}
      keyExtractor={({ id }) => id}
      renderItem={renderItem}
      columnCount={2}
      padding={padding}
      rowGap={GRID_GAP}
      columnGap={GRID_GAP}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
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
