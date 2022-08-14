export type GridConfig = {
  columnCount: number;
  itemsCount: number;
  itemSize: number;
  gap: number;
  padding: GridPadding;
};

type ValueXY = {
  x: number;
  y: number;
};

export type GridPadding = ValueXY;
export type GridPosition = ValueXY;
export type Translation = ValueXY;

export const getItemPosition = (
  order: number,
  { columnCount, gap, padding, itemSize }: GridConfig
) => {
  'worklet';
  const mul = gap + itemSize;
  return {
    x: padding.x + (order % columnCount) * mul,
    y: padding.y + Math.floor(order / columnCount) * mul
  };
};

export const getItemDragPosition = (
  order: number,
  translate: Translation,
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
  { x, y }: GridPosition,
  { columnCount, padding, itemSize, gap }: GridConfig
) => {
  'worklet';
  const div = gap + itemSize;
  const colIdx = Math.floor((x - padding.x + (itemSize + gap) / 2) / div);
  const rowIdx = Math.floor((y - padding.y + (itemSize + gap) / 2) / div);
  return rowIdx * columnCount + colIdx;
};

export const getItemTargetOrder = (
  order: number,
  translate: Translation,
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
  translate: Translation,
  gridConfig: GridConfig
) => {
  'worklet';
  return getItemPosition(
    getItemTargetOrder(order, translate, gridConfig),
    gridConfig
  );
};

export const getTranslation = (
  initialPosition: Translation,
  targetPosition: Translation
): Translation => {
  'worklet';
  return {
    x: targetPosition.x - initialPosition.x,
    y: targetPosition.y - initialPosition.y
  };
};

export const getTranslationToTarget = (
  order: number,
  translate: Translation,
  gridConfig: GridConfig
) => {
  'worklet';
  const initialPosition = getItemPosition(order, gridConfig);
  const targetPosition = getItemTargetPosition(order, translate, gridConfig);
  return getTranslation(initialPosition, targetPosition);
};

export const getItemDropOrder = (
  currentOrder: number,
  translate: Translation,
  { columnCount, itemsCount, gap, padding, itemSize }: GridConfig
) => {
  'worklet';
  const div = gap + itemSize;
  const deltaRow = Math.floor(
    (translate.y - padding.y + (itemSize + gap) / 2) / div
  );
  const deltaCol = Math.floor(
    (translate.x - padding.x + (itemSize + gap) / 2) / div
  );
  const currRow = Math.floor(currentOrder / 2);
  const currCol = currentOrder % 2;
  const rowsCount = Math.ceil(itemsCount / columnCount);
  const newRowIdx = Math.min(Math.max(0, currRow + deltaRow), rowsCount - 1);
  const newColIdx = Math.min(Math.max(0, currCol + deltaCol), columnCount - 1);
  return newRowIdx * columnCount + newColIdx;
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
