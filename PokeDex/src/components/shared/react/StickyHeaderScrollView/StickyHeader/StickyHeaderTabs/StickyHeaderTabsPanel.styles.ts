import styled, { css } from 'styled-components/native';

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
