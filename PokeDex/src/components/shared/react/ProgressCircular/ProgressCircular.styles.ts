import styled, { css } from 'styled-components/native';
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
