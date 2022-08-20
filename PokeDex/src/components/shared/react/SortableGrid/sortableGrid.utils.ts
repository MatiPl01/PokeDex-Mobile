import { Padding, Vector2D } from '@types';

export type GridConfig = {
  columnCount: number;
  itemsCount: number;
  itemSize: number;
  gap: number;
  padding: Padding;
};

export const getItemPosition = (
  order: number,
  { columnCount, gap, padding, itemSize }: GridConfig
) => {
  'worklet';
  const mul = gap + itemSize;
  return {
    x: (padding.left || 0) + (order % columnCount) * mul,
    y: (padding.top || 0) + Math.floor(order / columnCount) * mul
  };
};

export const getItemDragPosition = (
  order: number,
  translate: Vector2D,
  gridConfig: GridConfig
) => {
  'worklet';
  const initialPosition = getItemPosition(order, gridConfig);
  return {
    x: initialPosition.x + translate.x,
    y: initialPosition.y + translate.y
  };
};

export const getItemOrder = (
  { x, y }: Vector2D,
  { columnCount, padding, itemSize, gap }: GridConfig
) => {
  'worklet';
  const div = gap + itemSize;
  const colIdx = Math.floor(
    (x - (padding.left || 0) + (itemSize + gap) / 2) / div
  );
  const rowIdx = Math.floor(
    (y - (padding.top || 0) + (itemSize + gap) / 2) / div
  );
  return rowIdx * columnCount + colIdx;
};

export const getItemTargetOrder = (
  order: number,
  translate: Vector2D,
  gridConfig: GridConfig
) => {
  'worklet';
  return getItemOrder(
    getItemDragPosition(order, translate, gridConfig),
    gridConfig
  );
};

export const getItemTargetPosition = (
  order: number,
  translate: Vector2D,
  gridConfig: GridConfig
) => {
  'worklet';
  return getItemPosition(
    getItemTargetOrder(order, translate, gridConfig),
    gridConfig
  );
};

export const getTranslation = (
  initialPosition: Vector2D,
  targetPosition: Vector2D
) => {
  'worklet';
  return {
    x: targetPosition.x - initialPosition.x,
    y: targetPosition.y - initialPosition.y
  };
};

export const getTranslationToTarget = (
  order: number,
  translate: Vector2D,
  gridConfig: GridConfig
) => {
  'worklet';
  const initialPosition = getItemPosition(order, gridConfig);
  const targetPosition = getItemTargetPosition(order, translate, gridConfig);
  return getTranslation(initialPosition, targetPosition);
};

export const getItemDropOrder = (
  currentOrder: number,
  translate: Vector2D,
  { columnCount, itemsCount, gap, padding, itemSize }: GridConfig
) => {
  'worklet';
  const div = gap + itemSize;
  const deltaRow = Math.floor(
    (translate.y - (padding.top || 0) + (itemSize + gap) / 2) / div
  );
  const deltaCol = Math.floor(
    (translate.x - (padding.left || 0) + (itemSize + gap) / 2) / div
  );
  const currRow = Math.floor(currentOrder / 2);
  const currCol = currentOrder % 2;
  const rowsCount = Math.ceil(itemsCount / columnCount);
  const newRowIdx = Math.min(Math.max(0, currRow + deltaRow), rowsCount - 1);
  const newColIdx = Math.min(Math.max(0, currCol + deltaCol), columnCount - 1);
  return Math.min(newRowIdx * columnCount + newColIdx, itemsCount - 1);
};

export const getDistanceBetweenItems = (
  order1: number,
  order2: number,
  gridConfig: GridConfig
) => {
  'worklet';
  return getTranslation(
    getItemPosition(order1, gridConfig),
    getItemPosition(order2, gridConfig)
  );
};
