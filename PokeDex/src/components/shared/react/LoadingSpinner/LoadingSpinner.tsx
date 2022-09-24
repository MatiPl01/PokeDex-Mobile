import React, { useEffect } from 'react';
import { useTheme } from 'styled-components';
import { createAnimatedThemedStyles } from '@utils/reanimated';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';
import {
  SpinnerWrapper,
  SpinnerSvg,
  SpinnerCircle
} from './LoadingSpinner.styles';

const ANIMATION_DURATION = 1000; // Single animation duration (a part of the infinite animation)
const DEFAULT_SPINNER_DIAMETER = 65;
const DEFAULT_STROKE_WIDTH = 5;

const useAnimatedCircleStyle = createAnimatedThemedStyles(theme => ({
  svg: {
    transform: [{ rotate: [0, 360] }]
  },
  circle: {
    strokeDashoffset: [0.2, 0.4, 0.2].map(
      percent => (1 - percent) * theme.size.lg * Math.PI
    )
  }
}));

type LoadingSpinnerProps = {
  showOverlay?: boolean;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ showOverlay }) => {
  const theme = useTheme();
  const animationProgress = useSharedValue(0);
  const animatedCircleStyles = useAnimatedCircleStyle(theme)(animationProgress);

  useEffect(() => {
    animationProgress.value = withRepeat(
      withTiming(1, {
        duration: ANIMATION_DURATION,
        easing: Easing.inOut(Easing.linear)
      }),
      ANIMATION_DURATION
    );
  }, []);

  return (
    <SpinnerWrapper showOverlay={showOverlay}>
      <SpinnerSvg style={animatedCircleStyles.svg} diameter={diameter}>
        <SpinnerCircle
          style={animatedCircleStyles.circle}
          diameter={diameter}
          strokeWidth={strokeWidth}
        />
      </SpinnerSvg>
    </SpinnerWrapper>
  );
};

export default LoadingSpinner;
