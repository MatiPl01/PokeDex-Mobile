import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';

export const GridItemWrapper = styled(Animated.View)<{
  size: number;
  gap: number;
}>`
  position: relative;

  ${({ size, gap }) => css`
    width: ${size}px;
    height: ${size}px;
    margin-right: ${gap}px;
    margin-bottom: ${gap}px;
  `};
`;

export const AnimatedItemWrapper = styled(Animated.View)`
  position: absolute;
  width: 100%;
  height: 100%;
`;
