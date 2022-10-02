import styled, { css } from 'styled-components/native';
import { flexCenter } from '@styles/shared';

export const TabWrapper = styled.View`
  ${flexCenter};
  ${({ theme }) => css`
    height: ${theme.size.sm}px;
    margin-right: ${theme.space.lg}px;
  `};
`;

export const TabText = styled.Text<{ active?: boolean }>`
  ${({ theme, active }) => css`
    padding: 0 ${theme.space.md}px;
    font-size: ${theme.fontSize.body}px;
    font-weight: ${theme.fontWeight.medium};
    color: ${active
      ? theme.color.text.primary
      : theme.color.background.primary};
  `};
`;
