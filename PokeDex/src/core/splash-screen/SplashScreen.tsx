import React, { useEffect, PropsWithChildren, useMemo } from 'react';
import { useTheme } from 'styled-components';
import { useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SCREEN } from '@constants';
import { createAnimatedStyle, createAnimatedStyles } from '@utils/reanimated';
import PokeBall from '@assets/svg/poke-ball.svg';
import Logo from '@assets/svg/logo.svg';
import {
  InnerWrapper,
  Overlay,
  AbsoluteView,
  ContentContainer
} from './SplashScreen.styles';

const SPLASH_SCREEN_ANIMATION_DELAY = 500;
const MENU_TOGGLE_ANIMATION_DURATION = 500;
const SPLASH_SCREEN_ANIMATION_DURATION = 1000;
const MENU_TOGGLE_ANIMATION_DELAY = SPLASH_SCREEN_ANIMATION_DURATION;

type SplashScreenProps = PropsWithChildren<{
  menuToggle: React.ReactNode;
}>;

const SplashScreen: React.FC<SplashScreenProps> = ({
  children,
  menuToggle
}) => {
  const theme = useTheme();
  const edges = useSafeAreaInsets();
  const LOGO_HEIGHT = theme.size.xl;
  const LOGO_BAR_HEIGHT = theme.size.lg;
  const LOGO_BAR_PADDING_X = theme.space.sm;
  const LOGO_BAR_PADDING_Y = theme.space.sm;
  const POKE_BALL_SIZE = SCREEN.WIDTH / 2;
  const FINAL_POKE_BALL_SIZE = LOGO_BAR_HEIGHT - 2 * LOGO_BAR_PADDING_Y;
  const FINAL_LOGO_HEIGHT = FINAL_POKE_BALL_SIZE;
  const MENU_TOGGLE_SIZE = theme.size.lg - 2 * theme.space.lg;

  const splashScreenAnimationProgress = useSharedValue(0);
  const menuToggleAnimationProgress = useSharedValue(0);

  const animatedSplashScreenStyles = useMemo(
    () =>
      createAnimatedStyles({
        overlay: {
          transform: [
            { translateY: [0, -SCREEN.HEIGHT + LOGO_BAR_HEIGHT - edges.top] }
          ]
        },
        content: {
          transform: [
            { translateY: [SCREEN.HEIGHT - LOGO_BAR_HEIGHT - edges.top, 0] }
          ]
        },
        pokeBall: {
          transform: [
            {
              translateX: [
                0,
                SCREEN.WIDTH / 2 - FINAL_POKE_BALL_SIZE / 2 - LOGO_BAR_PADDING_X
              ]
            },
            {
              translateY: [
                -POKE_BALL_SIZE / 2,
                SCREEN.HEIGHT / 2 + LOGO_BAR_PADDING_Y - edges.top
              ]
            },
            {
              scale: [1, FINAL_POKE_BALL_SIZE / POKE_BALL_SIZE]
            }
          ]
        },
        logo: {
          transform: [
            {
              translateY: [
                LOGO_HEIGHT / 2,
                SCREEN.HEIGHT / 2 + LOGO_BAR_PADDING_Y - edges.top
              ]
            },
            {
              scale: [1, FINAL_LOGO_HEIGHT / LOGO_HEIGHT]
            }
          ]
        }
      })(splashScreenAnimationProgress),
    [theme, edges]
  );

  const animatedMenuToggleStyle = useMemo(
    () =>
      createAnimatedStyle({
        transform: [{ translateX: [-MENU_TOGGLE_SIZE, LOGO_BAR_PADDING_X] }]
      })(menuToggleAnimationProgress),
    []
  );

  useEffect(() => {
    splashScreenAnimationProgress.value = withDelay(
      SPLASH_SCREEN_ANIMATION_DELAY,
      withTiming(1, {
        duration: SPLASH_SCREEN_ANIMATION_DURATION
      })
    );
    menuToggleAnimationProgress.value = withDelay(
      MENU_TOGGLE_ANIMATION_DELAY,
      withTiming(1, { duration: MENU_TOGGLE_ANIMATION_DURATION })
    );
  }, []);

  return (
    <>
      <InnerWrapper height={SCREEN.HEIGHT}>
        <Overlay style={animatedSplashScreenStyles.overlay}>
          <AbsoluteView style={animatedSplashScreenStyles.pokeBall}>
            <PokeBall height={POKE_BALL_SIZE} width={POKE_BALL_SIZE} />
          </AbsoluteView>
          <AbsoluteView style={animatedSplashScreenStyles.logo}>
            <Logo height={LOGO_HEIGHT} width={SCREEN.WIDTH} />
          </AbsoluteView>
          <AbsoluteView
            style={[
              {
                height: MENU_TOGGLE_SIZE,
                width: MENU_TOGGLE_SIZE,
                top:
                  SCREEN.HEIGHT -
                  MENU_TOGGLE_SIZE / 2 +
                  LOGO_BAR_PADDING_Y -
                  edges.top,
                left: 0
              },
              animatedMenuToggleStyle
            ]}
          >
            {menuToggle}
          </AbsoluteView>
        </Overlay>
        <ContentContainer
          style={[
            {
              paddingTop: LOGO_BAR_HEIGHT + edges.top
            },
            animatedSplashScreenStyles.content
          ]}
        >
          {children}
        </ContentContainer>
      </InnerWrapper>
    </>
  );
};

export default SplashScreen;
