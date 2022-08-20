import { Vector2D } from '@types';

export type GridConfig = {
  columnCount: number;
  rowCount: number;
  itemsCount: number;
  itemHeight: number;
  itemWidth: number;
  rowGap: number;
  columnGap: number;
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
  { columnCount, rowGap, columnGap, itemWidth, itemHeight }: GridConfig
) => {
  'worklet';
  return {
    x: (order % columnCount) * (itemWidth + columnGap),
    y: Math.floor(order / columnCount) * (itemHeight + rowGap)
  };
};

export const getItemOrder = (
  { x, y }: Vector2D,
  {
    columnCount,
    rowCount,
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
  return rowIdx * columnCount + colIdx;
};

export const getItemDropPosition = (
  dragPosition: Vector2D,
  gridConfig: GridConfig
) => {
  'worklet';
  return getItemPosition(getItemOrder(dragPosition, gridConfig), gridConfig);
};
