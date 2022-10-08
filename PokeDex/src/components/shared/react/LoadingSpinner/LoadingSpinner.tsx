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
  SpinnerCircle
} from './LoadingSpinner.styles';

const ANIMATION_DURATION = 1000; // Single animation duration (a part of the infinite animation)
const DEFAULT_SPINNER_DIAMETER = 65;
const DEFAULT_STROKE_WIDTH = 5;

type LoadingSpinnerProps = {
  size?: number;
  strokeWidth?: number;
  showOverlay?: boolean;
  absolute?: boolean;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  showOverlay,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  size: diameter = DEFAULT_SPINNER_DIAMETER,
  absolute = true
}) => {
  const SPINNER_CIRCUMFERENCE = Math.PI * diameter;

  const animationProgress = useSharedValue(0);
  const animatedCircleStyles = createAnimatedStyles({
    svg: {
      transform: [{ rotate: [0, 360] }]
    },
    circle: {
      strokeDashoffset: [0.2, 0.4, 0.2].map(
        percent => (1 - percent) * SPINNER_CIRCUMFERENCE
      )
    }
  })(animationProgress);

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
    <SpinnerWrapper showOverlay={showOverlay} absolute={absolute}>
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
