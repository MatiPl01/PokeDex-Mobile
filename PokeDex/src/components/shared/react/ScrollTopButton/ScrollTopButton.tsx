import React, { useEffect } from 'react';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';
import { createAnimatedStyle } from '@utils/reanimated';
import { ButtonWrapper, ButtonIcon } from './ScrollTopButton.styles';
import { TouchableWrapper } from '@components/shared/styled/buttons';

type ScrollTopButtonProps = {
  isVisible: boolean;
  onScrollTop: () => void;
};

const ScrollTopButton: React.FC<ScrollTopButtonProps> = ({
  isVisible,
  onScrollTop
}) => {
  const theme = useTheme();
  const BUTTON_SIZE = theme.size.lg;
  const BUTTON_DISTANCE = theme.space.lg;

  const showButtonAnimationProgress = useSharedValue(0);
  const animatedShowButtonStyle = createAnimatedStyle({
    right: [-BUTTON_SIZE, BUTTON_DISTANCE]
  })(showButtonAnimationProgress);

  useEffect(() => {
    showButtonAnimationProgress.value = withTiming(+isVisible, {
      duration: 300,
      easing: Easing.bezier(0.175, 0.885, 0.32, 1.275)
    });
  }, [isVisible]);

  return (
    <ButtonWrapper style={animatedShowButtonStyle}>
      <TouchableWrapper onPress={onScrollTop}>
        <ButtonIcon name="chevron-up" />
      </TouchableWrapper>
    </ButtonWrapper>
  );
};

export default ScrollTopButton;
