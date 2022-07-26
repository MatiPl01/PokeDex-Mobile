import React, { useEffect } from 'react';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { createAnimatedStyle } from '@utils/reanimated';
import {
  ButtonWrapper,
  ButtonTouchable,
  ButtonIcon,
  BUTTON_DISTANCE,
  BUTTON_SIZE
} from './ScrollTopButton.styles';

const useAnimatedShowButtonStyle = createAnimatedStyle({
  right: [-BUTTON_SIZE, BUTTON_DISTANCE]
});

type ScrollTopButtonProps = {
  isVisible: boolean;
  onScrollTop: () => void;
};

const ScrollTopButton: React.FC<ScrollTopButtonProps> = ({
  isVisible,
  onScrollTop
}) => {
  const showButtonAnimationProgress = useSharedValue(0);
  const animatedShowButtonStyle = useAnimatedShowButtonStyle(
    showButtonAnimationProgress
  );

  useEffect(() => {
    showButtonAnimationProgress.value = withTiming(+isVisible, {
      duration: 300,
      easing: Easing.bezier(0.175, 0.885, 0.32, 1.275)
    });
  }, [isVisible]);

  return (
    <ButtonWrapper style={animatedShowButtonStyle}>
      <ButtonTouchable onPress={onScrollTop}>
        <ButtonIcon name="chevron-up" />
      </ButtonTouchable>
    </ButtonWrapper>
  );
};

export default ScrollTopButton;
