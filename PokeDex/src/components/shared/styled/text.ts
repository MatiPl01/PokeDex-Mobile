import styled, { css } from 'styled-components/native';
import AnimateableText from 'react-native-animateable-text';

export const CounterText = styled(AnimateableText)<{
  color: string;
  fontSize?: number;
}>`
  color: ${({ color }) => color};

  ${({ fontSize }) =>
    fontSize &&
    css`
      font-size: ${fontSize}px;
    `}

  ${({ theme }) => css`
    font-weight: ${theme.fontWeight.extraBold};
  `};
`;
