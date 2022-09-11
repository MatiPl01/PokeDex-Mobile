import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'styled-components';
import { Padding } from '@types';
import { RootState } from '@store';
import { SingleItemState } from '@store/items/items.reducer';
import { selectItemStatesByIds } from '@store/items/items.selector';
import { fetchPokemonItemsBatchAsync } from '@store/items/items.actions';
import SortableGrid from '@components/shared/react/SortableGrid/SortableGrid';
import PokemonItem from '../PokemonItem/PokemonItem';

const getItemIds = (items: { name: string; id: string }[]): string[] =>
  items.map(({ id }) => id);

type PokemonItemsGridProps = {
  items: { name: string; id: string }[];
};

const PokemonItemsGrid: React.FC<PokemonItemsGridProps> = ({ items }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const GRID_GAP = theme.space.lg;
  const PADDING = theme.space.lg;
  const itemStates = useSelector((rootState: RootState) =>
    selectItemStatesByIds(rootState, getItemIds(items))
  );

  const padding: Padding = {
    left: PADDING,
    right: PADDING
  };

  useEffect(() => {
    dispatch(fetchPokemonItemsBatchAsync(getItemIds(items)));
  }, [items]);

  const renderItem = ({
    item: { id, isLoading, item }
  }: {
    item: SingleItemState;
    width: number;
  }) => <PokemonItem id={id} item={item} isLoading={isLoading} />;

  return (
    <SortableGrid<SingleItemState>
      data={itemStates}
      keyExtractor={({ id }) => id}
      renderItem={renderItem}
      columnCount={2}
      rowGap={GRID_GAP}
      columnGap={GRID_GAP}
      padding={padding}
      itemHeight={theme.size.xl}
      editable={false}
    />
  );
};

export default React.memo(PokemonItemsGrid);
