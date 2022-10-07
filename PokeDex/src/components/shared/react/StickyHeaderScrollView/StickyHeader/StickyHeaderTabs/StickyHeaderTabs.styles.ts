import styled from 'styled-components/native';
import { absoluteFill } from '@styles/shared';
import Animated from 'react-native-reanimated';

export const TabsScrollView = styled(Animated.ScrollView)`
  padding: ${({ theme }) => `0 ${theme.space.md}px`};
  ${absoluteFill};
`;
