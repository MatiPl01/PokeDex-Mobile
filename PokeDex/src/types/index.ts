export type Padding = {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
};

export type Vector2D = {
  x: number;
  y: number;
};

export type Dimensions = {
  width: number;
  height: number;
};

export type Position = 'top' | 'bottom' | 'left' | 'right';

export type Orientation = 'horizontal' | 'vertical';

export type Image = {
  name?: string;
  url: string;
};

export * from './utils';
