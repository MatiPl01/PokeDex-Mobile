import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

export const GradientWrapper = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 5px;
  overflow: hidden;

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
