import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { hexToRGBAlphaCSS } from '@utils/colors';

const AbsoluteWrapper = styled(Animated.View)<{
  width: number;
  height: number;
}>`
  position: absolute;

  ${({ width, height }) => css`
    width: ${width}px;
    height: ${height}px;
  `};
`;

export const AnimatedItemWrapper = AbsoluteWrapper;

export const ItemDropIndicator = styled(AbsoluteWrapper)`
  border-radius: 5px;
  z-index: -1;

  ${({ theme }) => css`
    background-color: ${hexToRGBAlphaCSS(theme.color.background.tertiary, 0.5)};
    border: 3px dashed ${theme.color.text.tertiary};
  `}
`;
