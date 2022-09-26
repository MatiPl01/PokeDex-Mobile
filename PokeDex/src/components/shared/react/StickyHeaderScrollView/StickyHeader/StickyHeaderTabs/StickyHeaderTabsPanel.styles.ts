import styled, { css } from 'styled-components/native';
import { absoluteFill } from '@styles/shared';

export const Wrapper = styled.View`
  flex-direction: row;
  margin: ${({ theme }) => `${theme.space.md}px 0`};
`;

export const ActiveTabBackground = styled.View<{ width?: number }>`
  border-radius: 50px;
  width: ${({ width }) => width || 0}px;

  ${({ theme }) => css`
    background-color: ${theme.color.text.primary};
    height: ${theme.fontSize.body + 2 * theme.space.md}px;
  `};
`;

export const TabList = styled.FlatList`
  flex-direction: row;
  z-index: 1;
  ${absoluteFill};
`;
