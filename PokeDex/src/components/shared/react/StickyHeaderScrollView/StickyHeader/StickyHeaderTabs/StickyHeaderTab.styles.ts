import { flexCenter } from '@styles/shared';
import styled, { css } from 'styled-components/native';

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
    color: ${active
      ? theme.color.background.primary
      : theme.color.text.primary};
    font-size: ${theme.fontSize.body}px;
    font-weight: ${theme.fontWeight.medium};
  `};
`;
