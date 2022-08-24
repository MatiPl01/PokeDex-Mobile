import { SharedValue } from 'react-native-reanimated';
import { Vector2D, Padding, Complete } from '@types';

export type GridConfig = {
  columnCount: number;
  rowCount: number;
  itemCount: number;
  itemHeight: number;
  itemWidth: number;
  rowGap: number;
  columnGap: number;
  padding: SharedValue<Complete<Padding>>;
};

type RowHeightDataType = { itemHeight?: number } | { itemRatio?: number };

const isItemHeightSpecified = (
  data: RowHeightDataType
): data is { itemHeight?: number } => {
  return Object.prototype.hasOwnProperty.call(data, 'itemHeight');
};

const isItemRatioSpecified = (
  data: RowHeightDataType
): data is { itemRatio?: number } => {
  return Object.prototype.hasOwnProperty.call(data, 'itemRatio');
};

export const calcRowHeight = (itemWidth: number, data: RowHeightDataType) => {
  if (isItemHeightSpecified(data) && data.itemHeight) return data.itemHeight;
  if (isItemRatioSpecified(data) && data.itemRatio)
    return data.itemRatio * itemWidth;
  return itemWidth;
};

export const getItemPosition = (
  order: number,
  { columnCount, rowGap, columnGap, itemWidth, itemHeight, padding }: GridConfig
) => {
  'worklet';
  return {
    x: padding.value.left + (order % columnCount) * (itemWidth + columnGap),
    y: padding.value.top + Math.floor(order / columnCount) * (itemHeight + rowGap)
  };
};

export const getItemOrder = (
  { x, y }: Vector2D,
  {
    columnCount,
    rowCount,
    itemCount,
    rowGap,
    columnGap,
    itemWidth,
    itemHeight
  }: GridConfig
) => {
  'worklet';
  const colIdx = Math.max(
    0,
    Math.min(
      Math.floor((x + (itemWidth + columnGap) / 2) / (itemWidth + columnGap)),
      columnCount - 1
    )
  );
  const rowIdx = Math.max(
    0,
    Math.min(
      Math.floor((y + (itemHeight + rowGap) / 2) / (itemHeight + rowGap)),
      rowCount - 1
    )
  );
  return Math.min(rowIdx * columnCount + colIdx, itemCount - 1);
};

export const getItemDropPosition = (
  dragPosition: Vector2D,
  gridConfig: GridConfig
) => {
  'worklet';
  return getItemPosition(getItemOrder(dragPosition, gridConfig), gridConfig);
};
