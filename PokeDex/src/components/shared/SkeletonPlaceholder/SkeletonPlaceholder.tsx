import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { createAnimatedStyle } from '@utils/reanimated';
import { SCREEN_WIDTH } from '@core/splash-screen/SplashScreen';
import {
  AnimatedGradient,
  GradientWrapper
} from './SkeletonPlaceholder.styles';

const DEFAULT_ANIMATION_DURATION = 1000;

type SkeletonPlaceholderProps = {
  animationDuration?: number;
};

const SkeletonPlaceholder: React.FC<SkeletonPlaceholderProps> = ({
  animationDuration = DEFAULT_ANIMATION_DURATION
}) => {
  const [width, setWidth] = useState(SCREEN_WIDTH);
  const animationProgress = useSharedValue(0);
  const animatedGradientStyle = createAnimatedStyle({
    transform: [
      {
        translateX: [-width, width]
      }
    ]
  })(animationProgress);

  useEffect(() => {
    animationProgress.value = withRepeat(
      withTiming(1, {
        duration: animationDuration,
        easing: Easing.inOut(Easing.linear)
      }),
      animationDuration
    );
  }, []);

  const updateWidth = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setWidth(width);
  };

  return (
    <GradientWrapper onLayout={updateWidth}>
      <AnimatedGradient style={[animatedGradientStyle]} colors={[]} />
    </GradientWrapper>
  );
};

export default SkeletonPlaceholder;
