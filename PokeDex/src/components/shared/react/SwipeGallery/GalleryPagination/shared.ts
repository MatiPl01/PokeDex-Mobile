import styled, { css } from 'styled-components/native';
import { FlattenSimpleInterpolation } from 'styled-components';
import { Position } from '@types';
import { flexCenter } from '@styles/shared';

export type PaginationSize = 'small' | 'medium' | 'large';

const getPaginationPositionStyles = (
  position: Position
): FlattenSimpleInterpolation => {
  switch (position) {
    case 'top':
      return css`
        top: 0;
        width: 100%;
      `;
    case 'bottom':
      return css`
        bottom: 0;
        width: 100%;
      `;
    case 'left':
      return css`
        left: 0;
        height: 100%;
      `;
    case 'right':
      return css`
        right: 0;
        height: 100%;
      `;
  }
};

export const PaginationWrapper = styled.View<{ position: Position }>`
  position: absolute;
  ${({ position }) => getPaginationPositionStyles(position)}
  ${flexCenter};
`;
