import React, { ComponentType, useEffect } from 'react';
import { FlatListProps, ListRenderItem } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { SCREEN_WIDTH } from '@core/splash-screen/SplashScreen'; // TODO - move this constant to some other file than SplashScreen
import { GridConfig, GridPadding } from './sortableGrid.utils';
import { GridFlatList } from './SortableGrid.styles';
import SortableGridItem from './SortableGridItem';

type SortableGridProps<T> = {
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  renderItem: ({ item, size }: { item: T; size: number }) => JSX.Element;
  columnCount?: number;
  padding?: Partial<GridPadding>;
  gap?: number;
  onDragEnd?: (data: T[]) => void;
};

export default function SortableGrid<T extends object>({
  data,
  keyExtractor,
  renderItem,
  onDragEnd,
  columnCount = 1,
  gap = 0,
  padding: desiredPadding = {}
}: SortableGridProps<T>) {
  const padding = { x: 0, y: 0, ...desiredPadding };
  const itemSize =
    (SCREEN_WIDTH - (columnCount - 1) * gap - 2 * padding.x) / columnCount;
  const config: GridConfig = {
    padding,
    itemSize,
    gap,
    columnCount,
    itemsCount: data.length
  };

  const itemsOrder = useSharedValue<{ [key: string]: number }>({});

  useEffect(() => {
    itemsOrder.value = Object.fromEntries(
      data.map((item, index) => [keyExtractor(item, index), index])
    );
  }, [data]);

  const getNewOrderData = () => {
    'worklet';
    const newData: T[] = [];
    data.forEach((item: T, index: number) => {
      newData[itemsOrder.value[keyExtractor(item, index)]] = item;
    });
    return newData;
  };

  const handleItemDragStart = (itemKey: string) => {
    'worklet';
  };

  const handleOrderChange = (itemKey: string, newOrder: number) => {
    'worklet';
    const oldOrder = itemsOrder.value[itemKey];
    const swappedItemKey = Object.keys(itemsOrder.value).find(
      key => itemsOrder.value[key] === newOrder
    );
    if (!swappedItemKey) return;
    const newItemsOrder = JSON.parse(JSON.stringify(itemsOrder));
    newItemsOrder.value[itemKey] = newOrder;
    newItemsOrder.value[swappedItemKey] = oldOrder;
    itemsOrder.value = newItemsOrder.value;
  };

  const handleItemDragEnd = () => {
    'worklet';
    if (onDragEnd) onDragEnd(getNewOrderData());
  };

  const renderGridItem: ListRenderItem<T> = ({
    item,
    index
  }: {
    item: T;
    index: number;
  }) => (
    <SortableGridItem
      itemKey={keyExtractor(item, index)}
      itemsOrder={itemsOrder}
      size={itemSize}
      gap={gap}
      gridConfig={config}
      onDragStart={handleItemDragStart}
      onDragEnd={handleItemDragEnd}
      onOrderChange={handleOrderChange}
    >
      {renderItem({ item, size: itemSize })}
    </SortableGridItem>
  );

  return (
    <GridFlatList<ComponentType<FlatListProps<T>>>
      data={data}
      keyExtractor={(item: T, idx: number) => keyExtractor(item, idx)}
      renderItem={renderGridItem}
      numColumns={columnCount}
      // Padding object cannot be passed as a property of the styled
      // component because it results in NSMutableDictionary error (that's
      // why I decided to specify paddingX and paddingY separately)
      paddingX={padding.x}
      paddingY={padding.y}
      CellRendererComponent={({ children }) => children}
    />
  );
}
