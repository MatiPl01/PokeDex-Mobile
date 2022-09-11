import React, { useEffect } from 'react';
import Svg, { G, Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedProps,
  withTiming
} from 'react-native-reanimated';
import { createAnimatedProps } from '@utils/reanimated';
import { CounterText } from '@components/shared/styled/text';
import { Wrapper, SvgWrapper } from './ProgressCircular.styles';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ProgressCircularProps = {
  value: number;
  maxValue?: number;
  radius?: number;
  textColor?: string;
  strokeBackgroundColor?: string;
  strokeBackgroundOpacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
  animationDelay?: number;
  animationDuration?: number;
};

const ProgressCircular: React.FC<ProgressCircularProps> = ({
  value,
  maxValue = 100,
  radius = 40,
  textColor = 'tomato',
  strokeColor = 'tomato',
  strokeBackgroundColor = 'tomato',
  strokeBackgroundOpacity = 0.2,
  strokeWidth = 10,
  animationDelay = 0,
  animationDuration = 500
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
    strokeWidth: strokeWidth
  };
  // Animated progress values
  const animationProgress = useSharedValue(0);
  // Animated props
  const animatedCircleProps = createAnimatedProps({
    strokeDashoffset: [
      circleCircumference,
      circleCircumference * (1 - percentage)
    ]
  })(animationProgress);

  const animatedCounterText = useDerivedValue(() =>
    String(Math.floor(animationProgress.value * value))
  );

  const animatedCounterProps = useAnimatedProps(() => {
    const counterValue = animatedCounterText.value;

    return {
      text: counterValue,
      fontSize: Math.min((1.5 * radius) / counterValue.length, radius / 1.5)
    };
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      animationProgress.value = withTiming(1, {
        duration: animationDuration
      });
    }, animationDelay);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Wrapper size={diameter}>
      <SvgWrapper>
        <Svg
          width={diameter}
          height={diameter}
          viewBox={`0 0 ${outerDiameter} ${outerDiameter}`}
        >
          <G rotation="-90" origin={`${outerRadius}, ${outerRadius}`}>
            <Circle
              {...circleProps}
              stroke={strokeBackgroundColor}
              strokeOpacity={strokeBackgroundOpacity}
            />
            <AnimatedCircle
              {...circleProps}
              stroke={strokeColor}
              strokeDasharray={circleCircumference}
              strokeLinecap="round"
              animatedProps={animatedCircleProps}
            />
          </G>
        </Svg>
      </SvgWrapper>
      <CounterText color={textColor} animatedProps={animatedCounterProps} />
    </Wrapper>
  );
};

export default ProgressCircular;
