import React, { useEffect } from 'react';
import Svg, { G, Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedProps,
  withTiming
} from 'react-native-reanimated';
import { createAnimatedProps } from '@utils/reanimated';
import { Wrapper, SvgWrapper, CounterText } from './CircularProgress.styles';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type CircularProgressProps = {
  value: number;
  maxValue?: number;
  radius?: number;
  textColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  animationDelay?: number;
  animationDuration?: number;
};

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  maxValue = 100,
  radius = 40,
  textColor = 'tomato',
  strokeColor = 'tomato',
  strokeWidth = 10,
  animationDelay = 0,
  animationDuration = 50000
}) => {
  // Data
  const percentage = value / maxValue;
  const diameter = 2 * radius;
  const outerRadius = radius + strokeWidth;
  const outerDiameter = 2 * outerRadius;
  const circleCircumference = Math.PI * diameter;
  const circleProps = {
    cx: '50%',
    cy: '50%',
    r: radius,
    stroke: strokeColor,
    strokeWidth: strokeWidth
  };
  // Animated values
  const animationProgress = useSharedValue(0);
  // Animated props
  const animatedCircleProps = createAnimatedProps({
    strokeDashoffset: [
      circleCircumference,
      circleCircumference * (1 - percentage)
    ]
  })(animationProgress);

  useEffect(() => {
    const timeout = setTimeout(() => {
      animationProgress.value = withTiming(1, {
        duration: animationDuration
      });
    }, animationDelay);

    return () => clearTimeout(timeout);
  }, []);

  const animatedCounterText = useDerivedValue(() =>
    String(Math.floor(animationProgress.value * value))
  );

  const animatedCounterProps = useAnimatedProps(() => {
    const counterValue = animatedCounterText.value;

    return {
      text: counterValue,
      fontSize: Math.min(1.5 * radius / counterValue.length, radius / 1.5)
    };
  });

  return (
    <Wrapper size={diameter}>
      <SvgWrapper>
        <Svg
          width={diameter}
          height={diameter}
          viewBox={`0 0 ${outerDiameter} ${outerDiameter}`}
        >
          <G rotation="-90" origin={`${outerRadius}, ${outerRadius}`}>
            <Circle {...circleProps} strokeOpacity={0.2} />
            <AnimatedCircle
              {...circleProps}
              strokeDasharray={circleCircumference}
              strokeLinecap="round"
              animatedProps={animatedCircleProps}
            />
          </G>
        </Svg>
      </SvgWrapper>
      {/* TODO - calculate font size based on the number of digits */}
      <CounterText animatedProps={animatedCounterProps} color={textColor} />
    </Wrapper>
  );
};

export default CircularProgress;
