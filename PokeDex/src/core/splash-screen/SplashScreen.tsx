import React, { useEffect, useRef, type PropsWithChildren } from 'react';
import { Animated, Dimensions, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PokeBall from '@assets/svg/poke-ball.svg';
import Logo from '@assets/svg/logo.svg';
import {
  InnerWrapper,
  AnimatedContentContainer,
  AnimatedOverlay,
  AnimatedView
} from './SplashScreen.styles';

type SplashScreenProps = PropsWithChildren<{
  menuToggle: React.ReactNode;
}>;

export const SCREEN_HEIGHT =
  Platform.OS === 'android' && Platform.Version > 26
    ? Dimensions.get('screen').height - (StatusBar.currentHeight || 0)
    : Dimensions.get('window').height;
export const SCREEN_WIDTH = Dimensions.get('window').width;
const LOGO_BAR_HEIGHT = 65;
const LOGO_BAR_PADDING_X = 5;
const LOGO_BAR_PADDING_Y = 5;
const POKE_BALL_SIZE = SCREEN_WIDTH / 2;
const FINAL_POKE_BALL_SIZE = LOGO_BAR_HEIGHT - 2 * LOGO_BAR_PADDING_Y;
const LOGO_HEIGHT = 100;
const FINAL_LOGO_HEIGHT = FINAL_POKE_BALL_SIZE;
const MENU_TOGGLE_SIZE = FINAL_POKE_BALL_SIZE;
export const SPLASH_SCREEN_ANIMATION_DELAY = 500;
export const MENU_TOGGLE_ANIMATION_DELAY = 1000;
export const MENU_TOGGLE_ANIMATION_DURATION = 500;

const SplashScreen: React.FC<SplashScreenProps> = ({
  children,
  menuToggle
}) => {
  const edges = useSafeAreaInsets();
  const overlayTranslateY = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(
    new Animated.Value(SCREEN_HEIGHT - LOGO_BAR_HEIGHT - edges.top)
  ).current;
  const pokeBallPosition = useRef(
    new Animated.ValueXY({ x: 0, y: -POKE_BALL_SIZE / 2 })
  ).current;
  const pokeBallScale = useRef(new Animated.Value(1)).current;
  const logoPosition = useRef(
    new Animated.ValueXY({ x: 0, y: LOGO_HEIGHT / 2 })
  ).current;
  const logoScale = useRef(new Animated.Value(1)).current;
  const menuToggleTranslateX = useRef(
    new Animated.Value(-MENU_TOGGLE_SIZE)
  ).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(overlayTranslateY, {
          toValue: -SCREEN_HEIGHT + LOGO_BAR_HEIGHT + edges.top,
          useNativeDriver: true
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          useNativeDriver: true
        }),
        Animated.timing(pokeBallPosition, {
          toValue: {
            x: SCREEN_WIDTH / 2 - FINAL_POKE_BALL_SIZE / 2 - LOGO_BAR_PADDING_X,
            y: SCREEN_HEIGHT / 2 + LOGO_BAR_PADDING_Y - edges.top
          },
          useNativeDriver: true
        }),
        Animated.timing(pokeBallScale, {
          toValue: FINAL_POKE_BALL_SIZE / POKE_BALL_SIZE,
          useNativeDriver: true
        }),
        Animated.timing(logoPosition, {
          toValue: {
            x: 0,
            y: SCREEN_HEIGHT / 2 + LOGO_BAR_PADDING_Y - edges.top
          },
          useNativeDriver: true
        }),
        Animated.timing(logoScale, {
          toValue: FINAL_LOGO_HEIGHT / LOGO_HEIGHT,
          useNativeDriver: true
        }),
        Animated.timing(menuToggleTranslateX, {
          delay: MENU_TOGGLE_ANIMATION_DELAY - SPLASH_SCREEN_ANIMATION_DELAY,
          duration: MENU_TOGGLE_ANIMATION_DURATION,
          toValue: LOGO_BAR_PADDING_X,
          useNativeDriver: true
        })
      ]).start();
    }, SPLASH_SCREEN_ANIMATION_DELAY);
  }, []);

  return (
    <>
      <InnerWrapper height={SCREEN_HEIGHT}>
        <AnimatedOverlay
          style={{
            transform: [{ translateY: overlayTranslateY }]
          }}
        >
          <AnimatedView
            style={{
              transform: [
                { translateX: pokeBallPosition.x },
                { translateY: pokeBallPosition.y },
                { scale: pokeBallScale }
              ]
            }}
          >
            <PokeBall height={POKE_BALL_SIZE} width={POKE_BALL_SIZE} />
          </AnimatedView>
          <AnimatedView
            style={{
              transform: [
                { translateX: logoPosition.x },
                { translateY: logoPosition.y },
                { scale: logoScale }
              ]
            }}
          >
            <Logo height={LOGO_HEIGHT} width={SCREEN_WIDTH} />
          </AnimatedView>
          <AnimatedView
            style={{
              height: MENU_TOGGLE_SIZE,
              width: MENU_TOGGLE_SIZE,
              top:
                SCREEN_HEIGHT -
                MENU_TOGGLE_SIZE / 2 +
                LOGO_BAR_PADDING_Y -
                edges.top,
              left: 0,
              transform: [{ translateX: menuToggleTranslateX }]
            }}
          >
            {menuToggle}
          </AnimatedView>
        </AnimatedOverlay>
        <AnimatedContentContainer
          style={{
            paddingTop: LOGO_BAR_HEIGHT + edges.top,
            transform: [{ translateY: contentTranslateY }]
          }}
        >
          {children}
        </AnimatedContentContainer>
      </InnerWrapper>
    </>
  );
};

export default SplashScreen;
export { MENU_TOGGLE_SIZE as toggleMenuSize };