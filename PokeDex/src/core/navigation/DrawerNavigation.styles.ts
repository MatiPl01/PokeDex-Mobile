import styled from 'styled-components/native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { SCREEN_HEIGHT } from './../splash-screen/SplashScreen';

export const FINAL_SCREEN_SCALE = 0.75;
const DRAWER_HEIGHT = FINAL_SCREEN_SCALE * SCREEN_HEIGHT;
const DRAWER_PADDING_Y = (SCREEN_HEIGHT - DRAWER_HEIGHT) / 2;

const StyledDrawerContentScrollView = styled(DrawerContentScrollView)`
  padding-top: ${DRAWER_PADDING_Y}px;
  padding-left: 20px;
`;

export const DrawerWrapper = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.secondary};
`;

export { StyledDrawerContentScrollView as DrawerContentScrollView };
