import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { absoluteFill } from '@styles/shared';

export const TabList = styled(Animated.FlatList)`
  flex-direction: row;
  z-index: 1;
  padding: ${({ theme }) => `0 ${theme.space.md}px`};
  ${absoluteFill};
`;
