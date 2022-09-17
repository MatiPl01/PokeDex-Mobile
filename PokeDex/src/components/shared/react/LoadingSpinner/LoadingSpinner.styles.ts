import styled, { css } from 'styled-components/native';
import Svg, { Circle } from 'react-native-svg';
import Animated from 'react-native-reanimated';
import { hexToRGBAlphaCSS } from '@utils/colors';
import { flexCenter, absoluteFill } from '@styles/shared';

const STROKE_WIDTH = 5;

export const SpinnerWrapper = styled.View<{ showOverlay?: boolean }>`
  z-index: 1000;
  ${absoluteFill};
  ${flexCenter};

  background-color: ${({ showOverlay, theme }) =>
    showOverlay
      ? hexToRGBAlphaCSS(theme.color.background.primary, 0.75)
      : 'transparent'};
`;

export const SpinnerSvg = styled(Animated.createAnimatedComponent(Svg)).attrs(
  ({ theme }) => ({
    viewBox: `0 0 ${theme.size.lg} ${theme.size.lg}`
  })
)`
  ${({ theme }) => css`
    width: ${theme.size.lg}px;
    height: ${theme.size.lg}px;
  `}
`;

export const SpinnerCircle = styled(
  Animated.createAnimatedComponent(Circle)
).attrs(({ theme }) => ({
  cx: theme.size.lg / 2,
  cy: theme.size.lg / 2,
  r: (theme.size.lg - STROKE_WIDTH) / 2
}))`
  stroke-width: ${STROKE_WIDTH}px;

  ${({ theme }) => css`
    stroke-dasharray: ${theme.size.lg * Math.PI}px;
    stroke: ${theme.color.accent.primary};
    ${theme.shadow.box.medium.md};
  `}
`;
