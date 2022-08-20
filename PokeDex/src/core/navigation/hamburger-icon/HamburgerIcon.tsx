import React from 'react';
import { useTheme } from 'styled-components';
import { SharedValue } from 'react-native-reanimated';
import { useDrawerProgress } from '@react-navigation/drawer';
import { createAnimatedStyles } from '@utils/reanimated';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';
import {
  AnimatedButton,
  AnimatedBar,
  TouchableWrapper
} from './HamburgerIcon.styles';

type HamburgerIconProps = {
  navigation: DrawerNavigationHelpers;
};

const HamburgerIcon: React.FC<HamburgerIconProps> = ({ navigation }) => {
  const theme = useTheme();
  const MENU_TOGGLE_SIZE = theme.size.md;

  const progress = useDrawerProgress() as Readonly<SharedValue<number>>;
  const animatedBarStyles = createAnimatedStyles({
    top: {
      transform: [
        { rotate: [0, -135] },
        { translateX: [0, -MENU_TOGGLE_SIZE / 8] },
        { translateY: [0, -MENU_TOGGLE_SIZE / 8] }
      ]
    },
    center: {
      opacity: [1, 0],
      transform: [{ translateX: [0, -50] }]
    },
    bottom: {
      transform: [
        { rotate: [0, 135] },
        { translateX: [0, -MENU_TOGGLE_SIZE / 8] },
        { translateY: [0, MENU_TOGGLE_SIZE / 8] }
      ]
    }
  })(progress);

  return (
    <AnimatedButton>
      <TouchableWrapper onPress={() => navigation.toggleDrawer()}>
        <AnimatedBar style={animatedBarStyles.top} />
        <AnimatedBar style={animatedBarStyles.center} />
        <AnimatedBar style={animatedBarStyles.bottom} />
      </TouchableWrapper>
    </AnimatedButton>
  );
};

export default HamburgerIcon;
