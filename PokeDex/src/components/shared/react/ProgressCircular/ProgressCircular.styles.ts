import styled, { css } from 'styled-components/native';
import { absoluteFill, flexCenter } from '@styles/shared';

export const Wrapper = styled.View<{ reversed?: boolean; width: number }>`
  width: ${({ width }) => width}px;
  flex-direction: ${({ reversed }) => (reversed ? 'column-reverse' : 'column')};
  align-self: flex-start;
  align-items: center;
`;

export const ProgressWrapper = styled.View<{ size?: number }>`
  ${flexCenter};
  ${({ theme }) => theme.shadow.box.soft.sm};
  ${({ size }) => css`
    width: ${size}px;
    height: ${size}px;
  `};
`;

export const SvgWrapper = styled.View`
  ${absoluteFill};
`;

export const Label = styled.Text<{ maxWidth: number }>`
  text-align: center;
  max-width: ${({ maxWidth }) => maxWidth}px;

  ${({ theme }) => css`
    color: ${theme.color.text.primary};
    font-size: ${theme.fontSize.body}px;
    margin: ${theme.space.md}px 0;
  `};
`;
