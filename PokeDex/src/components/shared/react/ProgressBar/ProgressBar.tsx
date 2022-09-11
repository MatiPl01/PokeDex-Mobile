import React, { useEffect } from 'react';
import { View } from 'react-native';
import {
  useSharedValue,
  useDerivedValue,
  useAnimatedProps,
  withTiming
} from 'react-native-reanimated';
import { CounterText } from '@components/shared/styled/text';
import {
  ProgressBarOrientation,
  Wrapper,
  BarsWrapper,
  BarBackground,
  Bar,
  CounterTextWrapper
} from './ProgressBar.styles';
import { createAnimatedStyle } from '@utils/reanimated';

type ProgressBarProps = {
  value: number;
  maxValue?: number;
  maxDigitsCount?: number;
  textColor?: string;
  barColor?: string;
  barBackgroundColor?: string;
  barBackgroundOpacity?: number;
  barSize?: number;
  animationDelay?: number;
  animationDuration?: number;
  orientation?: ProgressBarOrientation;
  reversed?: boolean;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  maxValue = 100,
  maxDigitsCount = String(maxValue).length,
  textColor = 'tomato',
  barColor = 'tomato',
  barBackgroundColor = 'tomato',
  barBackgroundOpacity = 0.2,
  barSize = 10,
  animationDelay = 0,
  animationDuration = 500,
  orientation = 'horizontal',
  reversed = false
}) => {
  // Data
  const percentage = value / maxValue;
  const fontSize = 1.5 * barSize;
  const counterTextWidth = 0.7 * maxDigitsCount * fontSize + 10;
  // Animation progress values
  const animationProgress = useSharedValue(0);
  // Animated styles
  const animatedBarStyle = createAnimatedStyle(
    orientation === 'horizontal'
      ? {
          width: ['0%', `${100 * percentage}%`]
        }
      : {
          height: ['0%', `${100 * percentage}%`]
        }
  )(animationProgress);

  // Animated props
  const animatedCounterText = useDerivedValue(() =>
    String(Math.floor(animationProgress.value * value))
  );

  const animatedCounterProps = useAnimatedProps(() => ({
    text: animatedCounterText.value
  }));

  useEffect(() => {
    setTimeout(() => {
      animationProgress.value = withTiming(1, {
        duration: animationDuration
      });
    }, animationDelay);
  }, []);

  return (
    <Wrapper orientation={orientation} reversed={reversed}>
      <BarsWrapper orientation={orientation} size={barSize} reversed={reversed}>
        <BarBackground
          color={barBackgroundColor}
          opacity={barBackgroundOpacity}
        ></BarBackground>
        <Bar
          orientation={orientation}
          color={barColor}
          style={animatedBarStyle}
        />
      </BarsWrapper>
      <CounterTextWrapper
        orientation={orientation}
        reversed={reversed}
        width={counterTextWidth}
      >
        <CounterText
          color={textColor}
          animatedProps={animatedCounterProps}
          fontSize={fontSize}
        />
      </CounterTextWrapper>
    </Wrapper>
  );
};

export default ProgressBar;
