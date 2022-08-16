import styled, { css } from 'styled-components/native';
import { flexCenter } from '@styles/shared';

export const CardFooter = styled.View`
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: ${({ theme }) => theme.color.background.primary};
  ${flexCenter};
`;

export const CardTitle = styled.Text`
  text-transform: capitalize;

  ${({ theme }) => css`
    line-height: ${theme.lineHeight.title};
    font-size: ${theme.fontSize.title};
    font-weight: ${theme.fontWeight.bold};
    color: ${theme.color.text.primary};
    margin-bottom: ${theme.space.md};
    ${theme.shadow.medium
      .md}; // TODO - create text shadows separate from the background shadows
  `};
`;
