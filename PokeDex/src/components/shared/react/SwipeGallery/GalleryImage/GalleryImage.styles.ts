import styled from 'styled-components/native';
import { flexCenter } from '@styles/shared';

export const ImageWrapper = styled.View`
  flex: 1;
  ${flexCenter}
`;

export const Image = styled.Image<{ width: number; height: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;
