import React, { ComponentType, useEffect } from 'react';
import { FlatListProps, ListRenderItem } from 'react-native';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { SCREEN } from '@constants';
import { Padding } from '@types';
import { Separator } from '@components/shared/styled/layout';
import { GridConfig } from './sortableGrid.utils';
import { GridFlatList } from './SortableGrid.styles';
import SortableGridItem from './SortableGridItem';

type SortableGridProps<T> = {
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  renderItem: ({ item, size }: { item: T; size: number }) => JSX.Element;
  columnCount?: number;
  padding?: Padding;
  gap?: number;
  editable?: boolean;
  GridHeaderComponent?: React.ReactNode;
  GridFooterComponent?: React.ReactNode;
  onDragEnd?: (data: T[]) => void;
  onEndReached?: () => void;
};

const SortableGrid = <T extends object>({
  data,
  keyExtractor,
  renderItem,
  onDragEnd,
  onEndReached,
  GridHeaderComponent,
  GridFooterComponent,
  editable = false,
  columnCount = 1,
  gap = 0,
  padding: desiredPadding = {}
}: SortableGridProps<T>) => {
  const padding = { top: 0, right: 0, left: 0, bottom: 0, ...desiredPadding };
  const itemSize =
    (SCREEN.WIDTH - (columnCount - 1) * gap - padding.left - padding.right) /
    columnCount;
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

  const callOnDragEnd = () => {
    if (onDragEnd) onDragEnd(getNewOrderData());
  };

  const handleItemDragEnd = () => {
    'worklet';
    runOnJS(callOnDragEnd)();
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
      draggable={editable}
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
      maxToRenderPerBatch={12}
      onEndReached={onEndReached}
      ListHeaderComponent={
        <>
          <Separator height={padding.top} />
          {GridHeaderComponent}
        </>
      }
      ListFooterComponent={
        <>
          {GridFooterComponent}
          <Separator height={padding.bottom} />
        </>
      }
      style={{ paddingLeft: padding.left, paddingRight: padding.right }}
    />
  );
};

export default SortableGrid;
