import { css } from 'styled-components';
import colors from './colors';

const radius = {
  xs: '1.5px',
  sm: '5px',
  md: '10px',
  lg: '15px'
};

const createShadow = (radius: string, opacity: number, color: string) => {
  return css`
    // TODO - fiz these TypeScript errors
    shadow-radius: ${radius};
    shadow-opacity: ${opacity};
    shadow-color: ${color};
  `;
};

const createShadowGroup = (opacity: number) => {
  return {
    xs: createShadow(radius.xs, opacity, colors.black),
    sm: createShadow(radius.sm, opacity, colors.black),
    md: createShadow(radius.md, opacity, colors.black),
    lg: createShadow(radius.lg, opacity, colors.black)
  };
};

export default {
  soft: createShadowGroup(0.15),
  medium: createShadowGroup(0.25),
  strong: createShadowGroup(0.5)
};
