import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { flexCenter, absoluteFill } from '@styles/shared';
import { hexToRGBAlphaCSS } from '@utils/colors';

const SPINNER_DIAMETER = 65;
const STROKE_WIDTH = 5;
export const SPINNER_CIRCUMFERENCE = Math.PI * SPINNER_DIAMETER;

export const SpinnerWrapper = styled.View<{ showOverlay?: boolean }>`
  z-index: 1000;
  ${absoluteFill};
  ${flexCenter};

  background-color: ${({ showOverlay, theme }) =>
    showOverlay
      ? hexToRGBAlphaCSS(theme.color.background.primary, 0.75)
      : 'transparent'};
`;

export const SpinnerSvg = styled(Animated.createAnimatedComponent(Svg)).attrs({
  viewBox: `0 0 ${SPINNER_DIAMETER} ${SPINNER_DIAMETER}`
})`
  width: ${SPINNER_DIAMETER}px;
  height: ${SPINNER_DIAMETER}px;
`;

export const SpinnerCircle = styled(
  Animated.createAnimatedComponent(Circle)
).attrs({
  cx: SPINNER_DIAMETER / 2,
  cy: SPINNER_DIAMETER / 2,
  r: (SPINNER_DIAMETER - STROKE_WIDTH) / 2
})`
  stroke-dasharray: ${SPINNER_CIRCUMFERENCE}px;
  stroke-width: ${STROKE_WIDTH}px;

  ${({ theme }) => css`
    stroke: ${theme.color.accent.primary};
    ${theme.shadow.medium.md};
  `}
`;
