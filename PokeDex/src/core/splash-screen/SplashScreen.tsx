import React, { useEffect, PropsWithChildren } from 'react';
import { useTheme } from 'styled-components';
import { useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SIZE, ANIMATION } from '@constants';
import { createAnimatedStyle, createAnimatedStyles } from '@utils/reanimated';
import PokeBall from '@assets/svg/poke-ball.svg';
import Logo from '@assets/svg/logo.svg';
import {
  InnerWrapper,
  Overlay,
  AbsoluteView,
  ContentContainer
} from './SplashScreen.styles';

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
  const POKE_BALL_SIZE = SIZE.SCREEN.WIDTH / 2;
  const FINAL_POKE_BALL_SIZE = LOGO_BAR_HEIGHT - 2 * LOGO_BAR_PADDING_Y;
  const FINAL_LOGO_HEIGHT = FINAL_POKE_BALL_SIZE;
  const MENU_TOGGLE_SIZE = theme.size.lg - 2 * theme.space.lg;

  const splashScreenAnimationProgress = useSharedValue(0);
  const menuToggleAnimationProgress = useSharedValue(0);

  const animatedSplashScreenStyles = createAnimatedStyles({
    overlay: {
      transform: [
        { translateY: [0, -SIZE.SCREEN.HEIGHT + LOGO_BAR_HEIGHT + edges.top] }
      ]
    },
    content: {
      transform: [
        { translateY: [SIZE.SCREEN.HEIGHT - LOGO_BAR_HEIGHT - edges.top, 0] }
      ]
    },
    pokeBall: {
      transform: [
        {
          translateX: [
            0,
            SIZE.SCREEN.WIDTH / 2 -
              FINAL_POKE_BALL_SIZE / 2 -
              LOGO_BAR_PADDING_X
          ]
        },
        {
          translateY: [
            -POKE_BALL_SIZE / 2,
            SIZE.SCREEN.HEIGHT / 2 + LOGO_BAR_PADDING_Y - edges.top
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
            SIZE.SCREEN.HEIGHT / 2 + LOGO_BAR_PADDING_Y - edges.top
          ]
        },
        {
          scale: [1, FINAL_LOGO_HEIGHT / LOGO_HEIGHT]
        }
      ]
    }
  })(splashScreenAnimationProgress);

  const animatedMenuToggleStyle = createAnimatedStyle({
    transform: [{ translateX: [-MENU_TOGGLE_SIZE, LOGO_BAR_PADDING_X] }]
  })(menuToggleAnimationProgress);

  useEffect(() => {
    splashScreenAnimationProgress.value = withDelay(
      ANIMATION.DELAY.SPLASH_SCREEN,
      withTiming(1, {
        duration: ANIMATION.DURATION.SPLASH_SCREEN
      })
    );
    menuToggleAnimationProgress.value = withDelay(
      ANIMATION.DELAY.MENU_TOGGLE,
      withTiming(1, { duration: ANIMATION.DURATION.MENU_TOGGLE })
    );
  }, []);

  return (
    <>
      <InnerWrapper height={SIZE.SCREEN.HEIGHT}>
        <Overlay style={animatedSplashScreenStyles.overlay}>
          <AbsoluteView style={animatedSplashScreenStyles.pokeBall}>
            <PokeBall height={POKE_BALL_SIZE} width={POKE_BALL_SIZE} />
          </AbsoluteView>
          <AbsoluteView style={animatedSplashScreenStyles.logo}>
            <Logo height={LOGO_HEIGHT} width={SIZE.SCREEN.WIDTH} />
          </AbsoluteView>
          <AbsoluteView
            style={[
              {
                height: MENU_TOGGLE_SIZE,
                width: MENU_TOGGLE_SIZE,
                top:
                  SIZE.SCREEN.HEIGHT -
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
