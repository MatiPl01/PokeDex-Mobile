import styled, { css } from 'styled-components/native';
import Svg, { Circle } from 'react-native-svg';
import Animated from 'react-native-reanimated';
import { hexToRGBAlphaCSS } from '@utils/colors';
import { flexCenter, absoluteFill } from '@styles/shared';

export const SpinnerWrapper = styled.View<{ showOverlay?: boolean }>`
  z-index: 1000;
  ${absoluteFill};
  ${flexCenter};

  background-color: ${({ showOverlay, theme }) =>
    showOverlay
      ? hexToRGBAlphaCSS(theme.color.background.primary, 0.75)
      : 'transparent'};
`;

export const SpinnerSvg = styled(Animated.createAnimatedComponent(Svg)).attrs<{
  diameter: number;
}>(({ diameter }) => ({
  viewBox: `0 0 ${diameter} ${diameter}`
}))<{ diameter: number }>`
  ${({ diameter }) => css`
    width: ${diameter}px;
    height: ${diameter}px;
  `}
`;

export const SpinnerCircle = styled(
  Animated.createAnimatedComponent(Circle)
).attrs<{
  diameter: number;
  strokeWidth: number;
}>(({ diameter, strokeWidth }) => ({
  cx: diameter / 2,
  cy: diameter / 2,
  r: (diameter - strokeWidth) / 2
}))<{ diameter: number; strokeWidth: number }>`
  stroke-width: ${({ strokeWidth }) => strokeWidth}px;
  stroke-dasharray: ${({ diameter }) => Math.PI * diameter}px;

  ${({ theme }) => css`
    stroke: ${theme.color.accent.primary};
    ${theme.shadow.box.medium.md};
  `}
`;
