import styled, { css } from 'styled-components/native';

export const HeaderWrapper = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  ${({ theme }) => css`
    background-color: ${theme.color.background.primary};
    padding: ${theme.space.md}px;
  `};
`;

export const HeaderTitle = styled.Text`
  ${({ theme }) => css`
    color: ${theme.color.text.primary};
    font-size: ${theme.fontSize.title}px;
    font-weight: ${theme.fontWeight.bold};
  `};
`;
