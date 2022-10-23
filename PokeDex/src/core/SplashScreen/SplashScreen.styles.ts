import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { flexCenter } from '@styles/shared';

export const Wrapper = styled(Animated.View)<{ height: number }>`
  overflow: hidden;
  height: ${({ height }) => `${height}px`};
`;

export const Overlay = styled(Animated.View)<{
  fullScreen?: boolean;
}>`
  height: 100%;
  z-index: 100;
  overflow: hidden;
  ${flexCenter};
  background-color: ${({ theme }) => theme.color.accent.primary};
`;

export const AbsoluteView = styled(Animated.View)`
  position: absolute;
`;

export const ContentContainer = styled(AbsoluteView)<{ headerHeight: number }>`
  width: 100%;
  height: 100%;
  z-index: 0;
  padding-top: ${({ headerHeight }) => headerHeight}px;
`;
