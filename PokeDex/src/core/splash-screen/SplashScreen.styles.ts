import { Animated } from 'react-native';
import styled from 'styled-components/native';

export const InnerWrapper = styled.View<{ height: number }>`
  overflow: hidden;
  height: ${({ height }) => `${height}px`};
`;

const Overlay = styled.View`
  height: 100%;
  z-index: 100;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.color.accent.primary};
`;

const AbsoluteView = styled.View`
  position: absolute;
`;

const ContentContainer = styled(AbsoluteView)`
  width: 100%;
  height: 100%;
  z-index: 0;
`;

export const AnimatedOverlay = Animated.createAnimatedComponent(Overlay);

export const AnimatedView = Animated.createAnimatedComponent(AbsoluteView);

export const AnimatedContentContainer =
  Animated.createAnimatedComponent(ContentContainer);
