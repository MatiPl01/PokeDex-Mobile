import { Animated } from 'react-native';
import styled from 'styled-components/native';

const Overlay = styled(Animated.View)`
  height: 100%;
  z-index: 100;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.accent.primary};
`;

const View = styled.View`
  position: absolute;
`;

const ContentContainer = styled(View)`
  width: 100%;
  height: 100%;
  z-index: 0;
`;

export const AnimatedOverlay = Animated.createAnimatedComponent(Overlay);

export const AnimatedView = Animated.createAnimatedComponent(View);

export const AnimatedContentContainer =
  Animated.createAnimatedComponent(ContentContainer);
