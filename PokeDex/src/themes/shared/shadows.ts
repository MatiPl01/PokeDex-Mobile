import { css, FlattenSimpleInterpolation } from 'styled-components';
import { hexToRGBAlphaCSS } from '@utils/colors';
import colors from './colors';

const radius = {
  xs: '1.5px',
  sm: '5px',
  md: '10px',
  lg: '15px'
};

const createBoxShadow = (radius: string, opacity: number, color: string) =>
  css`
    // TODO - fiz these TypeScript errors
    shadow-radius: ${radius};
    shadow-opacity: ${opacity};
    shadow-color: ${color};
  `;

const createTextShadow = (radius: string, opacity: number, color: string) =>
  css`
    text-shadow-color: ${hexToRGBAlphaCSS(color, opacity)};
    text-shadow-radius: ${radius};
  `;

const createShadowGroup = (
  createShadowFn: (
    radius: string,
    opacity: number,
    color: string
  ) => FlattenSimpleInterpolation,
  opacity: number
) => {
  return {
    xs: createShadowFn(radius.xs, opacity, colors.black),
    sm: createShadowFn(radius.sm, opacity, colors.black),
    md: createShadowFn(radius.md, opacity, colors.black),
    lg: createShadowFn(radius.lg, opacity, colors.black)
  };
};

export const box = {
  soft: createShadowGroup(createBoxShadow, 0.15),
  medium: createShadowGroup(createBoxShadow, 0.25),
  strong: createShadowGroup(createBoxShadow, 0.5)
};

export const text = {
  soft: createShadowGroup(createTextShadow, 0.2),
  medium: createShadowGroup(createTextShadow, 0.35),
  strong: createShadowGroup(createTextShadow, 0.65)
};
