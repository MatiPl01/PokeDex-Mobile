import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { Orientation } from '@types';
import { absoluteFill } from '@styles/shared';

export const Wrapper = styled.View<{
  orientation: Orientation;
  reversed: boolean;
}>`
  justify-content: space-between;
  align-items: center;

  ${({ orientation, reversed }) =>
    orientation === 'horizontal'
      ? css`
          width: 100%;
          flex-direction: ${reversed ? 'row-reverse' : 'row'};
        `
      : css`
          height: 100%;
          align-self: flex-start;
          flex-direction: ${reversed ? 'column-reverse' : 'column'};
        `};
`;

export const BarsWrapper = styled.View<{
  orientation: Orientation;
  size: number;
  reversed: boolean;
}>`
  position: relative;
  flex-grow: 1;
  border-radius: ${({ size }) => `${size}px`};

  ${({ orientation, size, reversed }) =>
    orientation === 'horizontal'
      ? css`
          height: ${size}px;
        `
      : css`
          width: ${size}px;
          justify-content: ${reversed ? 'flex-start' : 'flex-end'};
        `}
`;

export const BarBackground = styled.View<{
  color: string;
  opacity: number;
}>`
  background-color: ${({ color }) => color};
  opacity: ${({ opacity }) => opacity};
  ${absoluteFill};
`;

export const Bar = styled(Animated.View)<{
  orientation: Orientation;
  color: string;
}>`
  background-color: ${({ color }) => color};
  border-radius: 100px;
  ${({ theme }) => theme.shadow.box.soft.sm};

  ${({ orientation }) =>
    orientation === 'horizontal'
      ? css`
          height: 100%;
        `
      : css`
          width: 100%;
        `};
`;

export const CounterTextWrapper = styled.View<{
  orientation: Orientation;
  reversed: boolean;
  width: number;
}>`
  ${({ orientation, reversed, width, theme }) =>
    orientation === 'horizontal'
      ? css`
          width: ${width}px;
          align-items: ${reversed ? 'flex-start' : 'flex-end'};
        `
      : css`
          margin: ${theme.space.md}px 0;
          align-items: center;
        `};
`;
