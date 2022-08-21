import React, { useEffect } from 'react';
import Animated, {
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SIZE, ANIMATION } from '@constants';
import { Padding } from '@types';
import { GridConfig, calcRowHeight } from './sortableGrid.utils';
import SortableGridItem from './SortableGridItem';
import { GridItemsWrapper } from './SortableGrid.styles';
import { createAnimatedStyle } from '@utils/reanimated';

/* eslint-disable  @typescript-eslint/no-explicit-any */
type GridInputComponent =
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
  GridHeaderComponent?: GridInputComponent;
  GridFooterComponent?: GridInputComponent;
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
  const padding = { top: 0, right: 0, left: 0, bottom: 0, ...desiredPadding };
  const itemWidth =
    (SIZE.SCREEN.WIDTH -
      (columnCount - 1) * columnGap -
      padding.left -
      padding.right) /
    columnCount;
  const rowCount = Math.ceil(data.length / columnCount);
  const rowHeight = calcRowHeight(itemWidth, restProps);
  const gridHeight =
    rowCount * rowHeight +
    (rowCount - 1) * rowGap +
    padding.top +
    padding.bottom;
  const contentHeight = SIZE.SCREEN.HEIGHT - SIZE.LOGO_BAR.HEIGHT - edges.top;
  const config: GridConfig = {
    itemHeight: rowHeight,
    itemWidth,
    rowGap,
    columnGap,
    columnCount,
    rowCount,
    padding,
    itemCount: data.length
  };
  const scrollY = useSharedValue(0);
  const maxScroll = useSharedValue(0);
  const scrollViewHeight = useSharedValue(0);
  const editableAnimationProgress = useSharedValue(0);
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const itemsOrder = useSharedValue<{ [key: string]: number }>({});

  const animatedEditablePaddingTopStyle = createAnimatedStyle({
    height: [0, editablePaddingTop]
  })(editableAnimationProgress);

  useEffect(() => {
    itemsOrder.value = Object.fromEntries(
      data.map((item, index) => [keyExtractor(item, index), index])
    );
  }, [data]);

  useEffect(() => {
    scrollViewHeight.value = gridHeight;
    maxScroll.value = gridHeight - contentHeight;
    if (editable) {
      scrollViewHeight.value += editablePaddingTop;
      maxScroll.value += editablePaddingTop;
    }
    editableAnimationProgress.value = withTiming(+editable, {
      duration: ANIMATION.DURATION.FAVORITES_EDIT
    });
  }, [editable]);

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

  const handleScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      scrollY.value = y;
      if (onEndReached && y === maxScroll.value) runOnJS(onEndReached)();
    }
  });

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
      >
        {renderItem({ item, width: itemWidth, height: rowHeight })}
      </SortableGridItem>
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
