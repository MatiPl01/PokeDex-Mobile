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

const getItemsIds = (items: { name: string; id: string }[]): string[] =>
  items.map(({ id }) => id);

type PokemonItemsGridProps = {
  items: { name: string; id: string }[];
};

const PokemonItemsGrid: React.FC<PokemonItemsGridProps> = ({ items }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const GRID_GAP = theme.space.lg;
  const PADDING = theme.space.lg;
  const ITEM_HEIGHT = theme.size.lg;
  const itemStates = useSelector((rootState: RootState) =>
    selectItemStatesByIds(rootState, getItemsIds(items))
  );

  const padding: Padding = {
    left: PADDING,
    right: PADDING
  };

  useEffect(() => {
    dispatch(fetchPokemonItemsBatchAsync(getItemsIds(items)));
  }, [items]);

  const renderItem = ({
    item: { isLoading, item }
  }: {
    item: SingleItemState;
  }) => <PokemonItem item={item} isLoading={isLoading} height={ITEM_HEIGHT} />;

  return (
    <SortableGrid<SingleItemState>
      data={itemStates}
      keyExtractor={({ id }) => id}
      renderItem={renderItem}
      columnCount={2}
      rowGap={GRID_GAP}
      columnGap={GRID_GAP}
      padding={padding}
      itemHeight={ITEM_HEIGHT}
      editable={false}
    />
  );
};

export default React.memo(PokemonItemsGrid);
