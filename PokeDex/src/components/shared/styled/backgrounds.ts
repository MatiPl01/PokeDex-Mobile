import styled, { css } from 'styled-components/native';
import { relativeFill } from '@styles/shared';

export const RoundedBackgroundClip = styled.View`
  border-radius: 5px;
  overflow: hidden;
  ${relativeFill};
`;

export const BackgroundGradientsWrapper = styled.View<{ width: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  flex-direction: row;

  ${({ width }) => css`
    transform: translateX(-${width / 2}px);
    width: ${width}px;
  `}
`;
