import { TextInput } from 'react-native';
import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import AnimateableText from 'react-native-animateable-text';
import { absoluteFill, flexCenter } from '@styles/shared';

export const Wrapper = styled.View<{ size?: number }>`
  ${flexCenter};
  ${({ size }) => css`
    width: ${size}px;
    height: ${size}px;
  `};
`;

export const SvgWrapper = styled.View`
  ${absoluteFill};
`;

export const CounterText = styled(AnimateableText)<{
  color: string;
}>`
  color: ${({ color }) => color};

  ${({ theme }) => css`
    font-weight: ${theme.fontWeight.extraBold};
  `};
`;
