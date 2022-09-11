import styled, { css } from 'styled-components/native';
import { absoluteFill, flexCenter } from '@styles/shared';

export const Wrapper = styled.View<{ reversed?: boolean }>`
  flex-direction: ${({ reversed }) => (reversed ? 'column-reverse' : 'column')};
  align-self: flex-start;
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

export const Label = styled.Text`
  text-align: center;

  ${({ theme }) => css`
    color: ${theme.color.text.primary};
    font-size: ${theme.fontSize.body}px;
    margin: ${theme.space.md}px 0;
  `};
`;
