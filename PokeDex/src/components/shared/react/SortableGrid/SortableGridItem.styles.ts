import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { absoluteFill } from '@styles/shared';
import { hexToRGBAlphaCSS } from '@utils/colors';

export const GridItemWrapper = styled.View<{
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

export const ItemDropIndicator = styled(Animated.View)`
  border-radius: 5px;
  ${absoluteFill};

  ${({ theme }) => css`
    background-color: ${hexToRGBAlphaCSS(theme.color.background.tertiary, 0.5)};
    border: 3px dashed ${theme.color.text.tertiary};
  `}
`;

export const AnimatedItemWrapper = styled(Animated.View)`
  ${absoluteFill};
`;
