export type GridConfig = {
  columnCount: number;
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

export const getItemOrder = (
  { x, y }: GridPosition,
  { columnCount, padding, itemSize, gap }: GridConfig
) => {
  'worklet';
  const div = gap + itemSize;
  const colIdx = Math.floor((x - padding.x + gap / 2) / div);
  const rowIdx = Math.floor((y - padding.y + gap / 2) / div);
  return rowIdx * columnCount + colIdx;
};
