import styled from 'styled-components/native';
import { SCREEN } from '@constants';
import { DrawerContentScrollView } from '@react-navigation/drawer';

export const FINAL_SCREEN_SCALE = 0.75;
const DRAWER_HEIGHT = FINAL_SCREEN_SCALE * SCREEN.HEIGHT;
const DRAWER_PADDING_Y = (SCREEN.HEIGHT - DRAWER_HEIGHT) / 2;

const StyledDrawerContentScrollView = styled(DrawerContentScrollView)`
  padding-top: ${DRAWER_PADDING_Y}px;
  padding-left: 20px;
`;

export const DrawerWrapper = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.secondary};
`;

export { StyledDrawerContentScrollView as DrawerContentScrollView };
