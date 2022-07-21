import React, { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import { useDrawerStatus } from '@react-navigation/drawer';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';
import {
  AnimatedButton,
  AnimatedBar,
  TouchableWrapper
} from './HamburgerIcon.styles';
import { toggleMenuSize as TOGGLE_MENU_SIZE } from '../../splash-screen/SplashScreen';

const ANIMATION_DURATION = 400; // ms

const ROTATE_INTERPOLATION = {
  inputRange: [0, 360],
  outputRange: ['0deg', '360deg']
};

const animatedValuesConfig = {
  centerBarOpacity: { from: 1, to: 0 },
  centerBarTranslateX: { from: 0, to: -50 },
  topBarRotate: { from: 0, to: 135 },
  bottomBarRotate: { from: 0, to: -135 },
  topBarTranslate: {
    from: { x: 0, y: 0 },
    to: {
      x: TOGGLE_MENU_SIZE / 8,
      y: -TOGGLE_MENU_SIZE / 8
    }
  },
  bottomBarTranslate: {
    from: { x: 0, y: 0 },
    to: {
      x: TOGGLE_MENU_SIZE / 8,
      y: TOGGLE_MENU_SIZE / 8
    }
  }
};

type AnimatedValues = {
  centerBarOpacity: Animated.Value;
  centerBarTranslateX: Animated.Value;
  topBarRotate: Animated.Value;
  bottomBarRotate: Animated.Value;
  topBarTranslate: Animated.ValueXY;
  bottomBarTranslate: Animated.ValueXY;
};

type HamburgerIconProps = {
  navigation: DrawerNavigationHelpers;
};

// TODO - maybe animate this icon based on the drawer progress
const HamburgerIcon: React.FC<HamburgerIconProps> = ({ navigation }) => {
  const isDrawerOpen = useDrawerStatus() === 'open';
  const animatedValues: AnimatedValues = Object.fromEntries(
    Object.entries(animatedValuesConfig).map(([key, values]) => {
      let initialValue: Animated.Value | Animated.ValueXY;
      if (isNaN(+values.from))
        initialValue = useRef(
          new Animated.ValueXY(values.from as { x: number; y: number })
        ).current;
      else
        initialValue = useRef(
          new Animated.Value(values.from as number)
        ).current;
      return [key, initialValue];
    })
  ) as AnimatedValues;

  const topBarRotateDeg =
    animatedValues.topBarRotate.interpolate(ROTATE_INTERPOLATION);
  const bottomBarRotateDeg =
    animatedValues.bottomBarRotate.interpolate(ROTATE_INTERPOLATION);

  useEffect(() => {
    if (isDrawerOpen) openIconAnimation();
    else closeIconAnimation();
  }, [isDrawerOpen]);

  const openIconAnimation = () => {
    Animated.parallel(
      Object.keys(animatedValues).map(key => {
        return Animated.timing(animatedValues[key], {
          toValue: animatedValuesConfig[key].to,
          useNativeDriver: true,
          duration: ANIMATION_DURATION,
          easing: Easing.ease
        });
      })
    ).start();
  };

  const closeIconAnimation = () => {
    Animated.parallel(
      Object.keys(animatedValues).map(key => {
        return Animated.timing(animatedValues[key], {
          toValue: animatedValuesConfig[key].from,
          useNativeDriver: true,
          duration: ANIMATION_DURATION,
          easing: Easing.ease
        });
      })
    ).start();
  };

  return (
    <AnimatedButton>
      <TouchableWrapper onPress={() => navigation.toggleDrawer()}>
        <AnimatedBar
          style={{
            transform: [
              { rotate: topBarRotateDeg },
              { translateX: animatedValues.topBarTranslate.x },
              { translateY: animatedValues.topBarTranslate.y }
            ]
          }}
        />
        <AnimatedBar
          style={{
            opacity: animatedValues.centerBarOpacity,
            transform: [{ translateX: animatedValues.centerBarTranslateX }]
          }}
        />
        <AnimatedBar
          style={{
            transform: [
              { rotate: bottomBarRotateDeg },
              { translateX: animatedValues.bottomBarTranslate.x },
              { translateY: animatedValues.bottomBarTranslate.y }
            ]
          }}
        />
      </TouchableWrapper>
    </AnimatedButton>
  );
};

export default HamburgerIcon;
