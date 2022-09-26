import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { SIZE } from '@constants';

export const GALLERY_HEIGHT = SIZE.SCREEN.HEIGHT / 3;

export const OuterWrapper = styled(Animated.View)``;

export const InnerWrapper = styled(Animated.View)`
  height: ${GALLERY_HEIGHT}px;
`;
