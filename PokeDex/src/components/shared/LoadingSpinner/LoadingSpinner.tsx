import React, { useEffect } from 'react';
import { createAnimatedStyles } from '@utils/reanimated';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';
import {
  SpinnerWrapper,
  SpinnerSvg,
  SpinnerCircle,
  SPINNER_CIRCUMFERENCE
} from './LoadingSpinner.styles';

const ANIMATION_DURATION = 1000; // Single animation duration (a part of the infinite animation)

const useAnimatedCircleStyle = createAnimatedStyles({
  svg: {
    transform: [{ rotate: [0, 360] }]
  },
  circle: {
    strokeDashoffset: [0.2, 0.4, 0.2].map(
      percent => (1 - percent) * SPINNER_CIRCUMFERENCE
    )
  }
});

type LoadingSpinnerProps = {
  showOverlay?: boolean;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ showOverlay }) => {
  const animationProgress = useSharedValue(0);
  const animatedCircleStyles = useAnimatedCircleStyle(animationProgress);

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
      <SpinnerSvg style={animatedCircleStyles.svg}>
        <SpinnerCircle style={animatedCircleStyles.circle} />
      </SpinnerSvg>
    </SpinnerWrapper>
  );
};

export default LoadingSpinner;
