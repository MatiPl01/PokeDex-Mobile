import React, { useCallback, useEffect } from 'react';
import Animated, {
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SIZE, ANIMATION } from '@constants';
import { Complete, Padding } from '@types';
import { createAnimatedStyle } from '@utils/reanimated';
import { GridConfig, calcRowHeight } from './sortableGrid.utils';
import SortableGridRenderItem from './SortableGridRenderItem';
import { GridItemsWrapper } from './SortableGrid.styles';

/* eslint-disable  @typescript-eslint/no-explicit-any */
type GridComponent =
  | React.ComponentType<any>
  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
  | null;

type SortableGridProps<T> = {
  data: T[];
  renderItem: (data: { item: T; width: number; height: number }) => JSX.Element;
  keyExtractor: (item: T, index: number) => string;
  columnCount?: number;
  padding?: Padding;
  rowGap?: number;
  columnGap?: number;
  editable?: boolean;
  editablePaddingTop?: number;
  GridHeaderComponent?: GridComponent;
  GridFooterComponent?: GridComponent;
  onDragEnd?: (data: T[]) => void;
  onEndReached?: () => void;
} & ({ itemHeight?: number } | { itemRatio?: number });

const SortableGrid = <T extends object>({
  data,
  keyExtractor,
  renderItem,
  onDragEnd,
  onEndReached,
  GridHeaderComponent,
  GridFooterComponent,
  rowGap = 0,
  columnGap = 0,
  columnCount = 1,
  editable = false,
  editablePaddingTop = 0,
  padding: desiredPadding = {},
  ...restProps
}: SortableGridProps<T>) => {
  const edges = useSafeAreaInsets();
  const padding = useSharedValue<Complete<Padding>>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });
  const itemWidth =
    (SIZE.SCREEN.WIDTH -
      (columnCount - 1) * columnGap -
      (desiredPadding.left || 0) -
      (desiredPadding.right || 0)) /
    columnCount;
  const rowCount = Math.ceil(data.length / columnCount);
  const rowHeight = calcRowHeight(itemWidth, restProps);
  const gridHeight =
    rowCount * rowHeight +
    (rowCount - 1) * rowGap +
    (desiredPadding.top || 0) +
    (desiredPadding.bottom || 0);
  const contentHeight = SIZE.SCREEN.HEIGHT - SIZE.LOGO_BAR.HEIGHT - edges.top;
  const config = useSharedValue<GridConfig>({
    itemHeight: rowHeight,
    itemWidth,
    rowGap,
    columnGap,
    columnCount,
    rowCount,
    padding,
    itemCount: data.length
  });
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const sharedData = useSharedValue<T[]>([]);
  const scrollY = useSharedValue(0);
  const maxScroll = useSharedValue(0);
  const editableAnimationProgress = useSharedValue(0);
  const itemsOrder = useSharedValue<Record<string, number>>({});

  const animatedEditablePaddingTopStyle = createAnimatedStyle({
    height: [0, editablePaddingTop]
  })(editableAnimationProgress);

  useEffect(() => {
    itemsOrder.value = Object.fromEntries(
      data.map((item, index) => [keyExtractor(item, index), index])
    );
    config.value = { ...config.value, rowCount, itemCount: data.length };
    maxScroll.value =
      gridHeight - contentHeight + (editable ? editablePaddingTop : 0);
    sharedData.value = data;
  }, [data]);

  useEffect(() => {
    maxScroll.value =
      gridHeight - contentHeight + (editable ? editablePaddingTop : 0);
    editableAnimationProgress.value = withTiming(+editable, {
      duration: ANIMATION.DURATION.FAVORITES_EDIT
    });
  }, [editable]);

  useEffect(() => {
    padding.value = { top: 0, right: 0, bottom: 0, left: 0, ...desiredPadding };
  }, [desiredPadding]);

  const getNewData = (newOrder: Record<string, number>) => {
    const newData: T[] = [];

    sharedData.value.forEach((item: T, index: number) => {
      newData[newOrder[keyExtractor(item, index)]] = item;
    });

    return newData;
  };

  const callOnDragEnd = (newOrder: Record<string, number>) => {
    if (onDragEnd) onDragEnd(getNewData(newOrder));
  };

  const handleItemDragStart = useCallback((itemKey: string) => {
    'worklet';
  }, []);

  const handleOrderChange = useCallback((itemKey: string, newOrder: number) => {
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
  }, []);

  const handleItemDragEnd = useCallback((newOrder: Record<string, number>) => {
    'worklet';
    runOnJS(callOnDragEnd)(newOrder);
  }, []);

  const handleScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      scrollY.value = y;
      if (onEndReached && y === maxScroll.value) runOnJS(onEndReached)();
    }
  });

  const renderGridHeader = useCallback(
    () =>
      GridHeaderComponent instanceof Function ? (
        <GridHeaderComponent />
      ) : (
        GridHeaderComponent
      ),
    [GridHeaderComponent]
  );

  const renderGridFooter = useCallback(
    () =>
      GridFooterComponent instanceof Function ? (
        <GridFooterComponent />
      ) : (
        GridFooterComponent
      ),
    [GridFooterComponent]
  );

  const memoizedRenderItem = useCallback(
    (item: T, width: number, height: number): JSX.Element =>
      renderItem({ item, width, height }),
    [editable]
  );

  const renderGridItem = (item: T, index: number) => {
    const key = keyExtractor(item, index);

    return (
      <SortableGridRenderItem<T>
        key={key}
        itemKey={key}
        gridConfig={config}
        itemsOrder={itemsOrder}
        scrollY={scrollY}
        maxScroll={maxScroll}
        editablePaddingTop={editablePaddingTop}
        contentHeight={contentHeight}
        scrollViewRef={scrollViewRef}
        onDragStart={handleItemDragStart}
        onDragEnd={handleItemDragEnd}
        onOrderChange={handleOrderChange}
        draggable={editable}
        renderItem={memoizedRenderItem}
        item={item}
      />
    );
  };

  return (
    <Animated.ScrollView onScroll={handleScroll} ref={scrollViewRef}>
      {renderGridHeader()}
      <Animated.View style={animatedEditablePaddingTopStyle} />
      <GridItemsWrapper height={gridHeight}>
        {data.map((item, idx) => renderGridItem(item, idx))}
      </GridItemsWrapper>
      {renderGridFooter()}
    </Animated.ScrollView>
  );
};

export default SortableGrid;
