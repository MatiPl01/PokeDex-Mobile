import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { absoluteFill, flexCenter } from '@styles/shared';

export const AnimatedIconWrapper = styled(Animated.View)`
  ${absoluteFill};
  ${flexCenter};
`;
