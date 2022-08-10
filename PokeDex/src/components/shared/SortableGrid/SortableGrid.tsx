import React from 'react';
import { SCREEN_WIDTH } from '@core/splash-screen/SplashScreen'; // TODO - move this constant to some other file than SplashScreen
import { GridItemWrapper, GridScrollView } from './SortableGrid.styles';
import { getItemPosition, GridConfig, GridPadding } from './sortableGrid.utils';

type SortableGridProps<T> = {
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  renderItem: ({ item, size }: { item: T; size: number }) => JSX.Element;
  columnCount?: number;
  padding?: Partial<GridPadding>;
  gap?: number;
};

export default function SortableGrid<T>({
  data,
  keyExtractor,
  renderItem,
  columnCount = 1,
  gap = 0,
  padding: desiredPadding = {}
}: SortableGridProps<T>) {
  const rowsCount = Math.ceil(data.length / columnCount);
  const padding = { x: 0, y: 0, ...desiredPadding };
  const itemSize =
    (SCREEN_WIDTH - (columnCount - 1) * gap - 2 * padding.x) / columnCount;
  const containerHeight = Math.ceil(
    rowsCount * itemSize + (rowsCount - 1) * gap + 2 * padding.y
  );

  const config: GridConfig = {
    padding,
    itemSize,
    gap,
    columnCount
  };

  const order = Object.fromEntries(
    data.map((item, idx) => [keyExtractor(item, idx), idx])
  );

  const renderGridItem = (item: T, idx: number) => {
    const key = keyExtractor(item, idx);
    const position = getItemPosition(order[key], config);
    return (
      <GridItemWrapper key={key} size={itemSize} position={position}>
        {renderItem({ item, size: itemSize })}
      </GridItemWrapper>
    );
  };

  return (
    <GridScrollView
      contentContainerStyle={{
        height: containerHeight
      }}
      bounces={false}
      scrollEventThrottle={16}
    >
      {data.map(renderGridItem)}
    </GridScrollView>
  );
}
