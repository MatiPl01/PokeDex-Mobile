import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { SCREEN } from '@constants';
import { Padding } from '@types';
import { GridConfig, calcRowHeight } from './sortableGrid.utils';
import SortableGridItem from './SortableGridItem';
import { GridItemsWrapper } from './SortableGrid.styles';

type SortableGridProps<T> = {
  data: T[];
  renderItem: (data: { item: T; width: number; height: number }) => JSX.Element;
  keyExtractor: (item: T, index: number) => string;
  columnCount?: number;
  padding?: Padding;
  rowGap?: number;
  columnGap?: number;
  editable?: boolean;
  GridHeaderComponent?:
    | React.ComponentType<any>
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | null;
  GridFooterComponent?:
    | React.ComponentType<any>
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | null;
  onDragEnd?: (data: T[]) => void;
  onEndReached?: () => void;
} & ({ itemHeight?: number } | { itemRatio?: number });

const SortableGrid = <T extends object>({
  data,
  keyExtractor,
  renderItem,
  onDragEnd,
  onEndReached, // TODO
  GridHeaderComponent,
  GridFooterComponent,
  editable = false,
  columnCount = 1,
  rowGap = 0,
  columnGap = 0,
  padding: desiredPadding = {},
  ...restProps
}: SortableGridProps<T>) => {
  const padding = { top: 0, right: 0, left: 0, bottom: 0, ...desiredPadding };
  const itemWidth =
    (SCREEN.WIDTH -
      (columnCount - 1) * columnGap -
      padding.left -
      padding.right) /
    columnCount;
  const rowCount = Math.ceil(data.length / columnCount);
  const rowHeight = calcRowHeight(itemWidth, restProps);
  const contentHeight =
    rowCount * rowHeight +
    (rowCount - 1) * rowGap +
    padding.top +
    padding.bottom;
  const config: GridConfig = {
    itemHeight: rowHeight,
    itemWidth,
    rowGap,
    columnGap,
    columnCount,
    rowCount,
    itemsCount: data.length
  };
  const scrollViewStyle = Object.fromEntries(
    Object.entries(padding).map(([prop, val]) => [
      `padding${prop[0].toUpperCase()}${prop.slice(1)}`,
      val
    ])
  );

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

  const renderGridHeader = () =>
    GridHeaderComponent instanceof Function ? (
      <GridHeaderComponent />
    ) : (
      GridHeaderComponent
    );

  const renderGridFooter = () =>
    GridFooterComponent instanceof Function ? (
      <GridFooterComponent />
    ) : (
      GridFooterComponent
    );

  const renderGridItem = (item: T, index: number) => {
    const key = keyExtractor(item, index);

    return (
      <SortableGridItem
        key={key}
        itemKey={key}
        itemsOrder={itemsOrder}
        gridConfig={config}
        onDragStart={handleItemDragStart}
        onDragEnd={handleItemDragEnd}
        onOrderChange={handleOrderChange}
        draggable={editable}
      >
        {renderItem({ item, width: itemWidth, height: rowHeight })}
      </SortableGridItem>
    );
  };

  return (
    <ScrollView contentContainerStyle={scrollViewStyle}>
      {renderGridHeader()}
      <GridItemsWrapper height={contentHeight}>
        {data.map((item, idx) => renderGridItem(item, idx))}
      </GridItemsWrapper>
      {renderGridFooter()}
    </ScrollView>
  );
};

export default SortableGrid;
