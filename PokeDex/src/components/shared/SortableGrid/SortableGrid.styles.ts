import styled, { css } from 'styled-components/native';
import { GridPosition } from './sortableGrid.utils';

export const GridScrollView = styled.ScrollView`
  position: relative;
`;

export const GridItemWrapper = styled.View<{
  size: number;
  position: GridPosition;
}>`
  position: absolute;

  ${({ size, position }) => css`
    width: ${size}px;
    height: ${size}px;
    left: ${position.x}px;
    top: ${position.y}px;
  `}
`;
