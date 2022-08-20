import React, { useEffect } from 'react';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';
import { createAnimatedThemedStyle } from '@utils/reanimated';
import { ButtonWrapper, ButtonIcon } from './ScrollTopButton.styles';
import { TouchableWrapper } from '@components/shared/styled/buttons';

const useAnimatedShowButtonStyle = createAnimatedThemedStyle(theme => ({
  right: [-theme.size.md, theme.space.lg]
}));

type ScrollTopButtonProps = {
  isVisible: boolean;
  onScrollTop: () => void;
};

const ScrollTopButton: React.FC<ScrollTopButtonProps> = ({
  isVisible,
  onScrollTop
}) => {
  const theme = useTheme();
  const showButtonAnimationProgress = useSharedValue(0);
  const animatedShowButtonStyle = useAnimatedShowButtonStyle(theme)(
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
      <TouchableWrapper onPress={onScrollTop}>
        <ButtonIcon name="chevron-up" />
      </TouchableWrapper>
    </ButtonWrapper>
  );
};

export default ScrollTopButton;
