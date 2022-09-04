import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from 'styled-components';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { ThemeMode } from '@store/theme/theme.types';
import { selectCurrentThemeMode } from '@store/theme/theme.selector';
import { createAnimatedThemedStyles } from '@utils/reanimated';
import { AnimatedIconWrapper } from '@components/shared/styled/icons';
import {
  SwitchTextWrapper,
  GradientsWrapper,
  SwitchGradient,
  SwitchWrapper,
  SwitchThumb,
  SwitchText,
  MoonIcon,
  SunIcon
} from './DayNightSwitch.styles';

const useAnimatedSwitchStyles = createAnimatedThemedStyles(theme => {
  return {
    dayGradient: {
      opacity: [1, 0]
    },
    nightGradient: {
      opacity: [0, 1]
    },
    thumb: {
      transform: [
        { translateX: [0, theme.size.xl - theme.size.sm - 2 * theme.space.xs] }
      ]
    },
    sunIcon: {
      opacity: [1, 0],
      transform: [{ scale: [1, 0.5] }]
    },
    moonIcon: {
      opacity: [0, 1],
      transform: [{ scale: [0.5, 1] }]
    },
    lightText: {
      width: [theme.size.xl - theme.size.sm, 0],
      opacity: [1, 0]
    },
    darkText: {
      width: [0, theme.size.xl - theme.size.sm],
      opacity: [0, 1]
    }
  };
});

type DayNightSwitchProps = {
  onChange: (mode: ThemeMode) => void;
};

const DayNightSwitch: React.FC<DayNightSwitchProps> = ({ onChange }) => {
  const theme = useTheme();
  const switchColors = theme.color.dayNightSwitch;
  const themeMode = useSelector(selectCurrentThemeMode);
  const switchAnimationProgress = useSharedValue(
    +(themeMode === ThemeMode.DARK)
  );
  const animatedSwitchStyles = useAnimatedSwitchStyles(theme)(
    switchAnimationProgress
  );

  useEffect(() => {
    switchAnimationProgress.value = withTiming(
      +(themeMode === ThemeMode.DARK),
      {
        duration: 500,
        easing: Easing.bezier(0.6, 0, 0.4, 1)
      }
    );
  }, [themeMode]);

  const handlePress = () => {
    onChange(themeMode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT);
  };

  return (
    <SwitchWrapper onPress={handlePress}>
      <GradientsWrapper>
        <SwitchGradient
          colors={[switchColors.day.primary, switchColors.day.secondary]}
          style={animatedSwitchStyles.dayGradient}
        />
        <SwitchGradient
          colors={[switchColors.night.primary, switchColors.night.secondary]}
          style={animatedSwitchStyles.nightGradient}
        />
        <SwitchTextWrapper
          style={[{ right: 0 }, animatedSwitchStyles.lightText]}
        >
          <SwitchText numberOfLines={1} ellipsizeMode="clip">
            light
          </SwitchText>
        </SwitchTextWrapper>
        <SwitchTextWrapper style={animatedSwitchStyles.darkText}>
          <SwitchText numberOfLines={1} ellipsizeMode="clip">
            dark
          </SwitchText>
        </SwitchTextWrapper>
      </GradientsWrapper>
      <SwitchThumb style={animatedSwitchStyles.thumb}>
        <AnimatedIconWrapper style={animatedSwitchStyles.sunIcon}>
          <SunIcon />
        </AnimatedIconWrapper>
        <AnimatedIconWrapper style={animatedSwitchStyles.moonIcon}>
          <MoonIcon />
        </AnimatedIconWrapper>
      </SwitchThumb>
    </SwitchWrapper>
  );
};

export default DayNightSwitch;
