import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { SIZE } from '@constants';
import { DrawerContentScrollView } from '@react-navigation/drawer';

export const FINAL_SCREEN_SCALE = 0.75;
const DRAWER_HEIGHT = FINAL_SCREEN_SCALE * SIZE.SCREEN.HEIGHT;
const DRAWER_PADDING_Y = (SIZE.SCREEN.HEIGHT - DRAWER_HEIGHT) / 2;

export const DrawerContentView = styled(DrawerContentScrollView).attrs({
  scrollEnabled: false
})`
  padding-top: ${DRAWER_PADDING_Y}px;
  padding-left: 20px;
`;

export const DrawerWrapper = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.tertiary};
`;

export const ScreensInnerWrapper = styled(Animated.View)`
  overflow: hidden;
  background-color: ${({ theme }) => theme.color.background.secondary};
`;
