import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { absoluteFill } from '@styles/shared';

export const GradientWrapper = styled.View`
  border-radius: 5px;
  overflow: hidden;
  z-index: 10;
  ${absoluteFill}

  ${({ theme }) => css`
    background-color: ${theme.color.background.tertiary};
    border: 2px solid ${theme.color.background.secondary};
  `};
`;

export const AnimatedGradient = styled(
  Animated.createAnimatedComponent(LinearGradient)
).attrs(({ theme }) => {
  const bgColor = theme.color.background;
  return {
    colors: [
      bgColor.tertiary,
      bgColor.secondary,
      bgColor.secondary,
      bgColor.tertiary
    ],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 }
  };
})`
  width: 100%;
  height: 100%;
`;
