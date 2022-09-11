import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@core/navigation/DrawerNavigation';
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

type FavoritesGridProps = {
  editable?: boolean;
};

const FavoritesGrid: React.FC<FavoritesGridProps> = ({ editable = false }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'PokemonDetails'>>();
  const PADDING = theme.space.lg;
  const GRID_GAP = theme.space.lg;

  const [favoritesStates, setFavoritesStates] = useState<SinglePokemonState[]>(
    []
  );
  const favoritesIds = useSelector(selectFavoritePokemonIdsList);
  const selectedFavoritesStates = useSelector((rootState: RootState) =>
    selectPokemonStateListByIds(rootState, favoritesIds)
  );
  const gridHeaderAnimationProgress = useSharedValue(0);

  const padding: Padding = {
    top: PADDING,
    left: PADDING,
    right: PADDING,
    bottom: PADDING
  };

  useEffect(() => {
    // TODO - make this useEffect run after refreshing Pokemon list (pull to refresh)
    if (favoritesIds.length)
      dispatch(fetchPokemonBatchByIdsAsync(favoritesIds, false));
  }, []);

  useEffect(() => {
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
    item: { id: pokemonId, pokemon, isLoading },
    width
  }: {
    item: SinglePokemonState;
    width: number;
  }) => {
    return (
      <Pressable
        key={pokemonId}
        onPress={() => navigation.push('PokemonDetails', { pokemonId })}
      >
        <FavoritePokemonCard
          pokemon={pokemon}
          isLoading={isLoading}
          width={width}
          deletable={editable}
          onDelete={handleFavoriteDelete}
        />
      </Pressable>
    );
  };

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
      onEndReached={() => console.log('end reached')} // TODO - replace fetching all Pokemon at once with fetching groups of Pokemon (similarly to the Pokemon screen)
      editablePaddingTop={theme.size.lg + theme.space.lg}
    />
  );
};

export default FavoritesGrid;
