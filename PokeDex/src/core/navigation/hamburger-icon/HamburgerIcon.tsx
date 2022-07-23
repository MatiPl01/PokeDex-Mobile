import React from 'react';
import { useDrawerProgress } from '@react-navigation/drawer';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';
import { toggleMenuSize as TOGGLE_MENU_SIZE } from '@core/splash-screen/SplashScreen';
import { createAnimatedStyles } from '@utils/reanimated';
import {
  AnimatedButton,
  AnimatedBar,
  TouchableWrapper
} from './HamburgerIcon.styles';
import { SharedValue } from 'react-native-reanimated';

const useAnimatedBarStyles = createAnimatedStyles({
  top: {
    transform: [
      { rotate: [0, -135] },
      { translateX: [0, -TOGGLE_MENU_SIZE / 8] },
      { translateY: [0, -TOGGLE_MENU_SIZE / 8] }
    ]
  },
  center: {
    opacity: [1, 0],
    transform: [{ translateX: [0, -50] }]
  },
  bottom: {
    transform: [
      { rotate: [0, 135] },
      { translateX: [0, -TOGGLE_MENU_SIZE / 8] },
      { translateY: [0, TOGGLE_MENU_SIZE / 8] }
    ]
  }
});

type HamburgerIconProps = {
  navigation: DrawerNavigationHelpers;
};

const HamburgerIcon: React.FC<HamburgerIconProps> = ({ navigation }) => {
  const progress = useDrawerProgress() as Readonly<SharedValue<number>>;
  const animatedBarStyles = useAnimatedBarStyles(progress);

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
