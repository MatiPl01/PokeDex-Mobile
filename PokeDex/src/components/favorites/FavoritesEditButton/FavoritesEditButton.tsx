import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { ANIMATION } from '@constants';
import {
  AnimatedStyleConfig,
  createAnimatedStyles,
  createAnimatedThemedStyle
} from '@utils/reanimated';
import { AnimatedIconWrapper } from '@components/shared/styled/icons';
import { TouchableWrapper } from '@components/shared/styled/buttons';
import { Icon, ButtonWrapper } from './FavoritesEditButton.styles';

const ANIMATION_CONFIG = {
  duration: ANIMATION.DURATION.FAVORITES_EDIT,
  easing: Easing.bezier(0.4, 0, 0.9, 0.65)
};

const useAnimatedButtonStyle = createAnimatedThemedStyle(theme => {
  const BUTTON_SIZE = theme.size.lg;
  const CLOSED_BUTTON_SIZE = 2 * BUTTON_SIZE;
  const BUTTON_OFFSET_TOP = theme.space.lg;
  const BUTTON_OFFSET_RIGHT = theme.space.lg;

  const config: AnimatedStyleConfig = {
    width: [CLOSED_BUTTON_SIZE, BUTTON_SIZE],
    height: [CLOSED_BUTTON_SIZE, BUTTON_SIZE],
    paddingTop: [CLOSED_BUTTON_SIZE * 0.35, 0],
    paddingRight: [CLOSED_BUTTON_SIZE * 0.35, 0],
    top: [-CLOSED_BUTTON_SIZE / 2, BUTTON_OFFSET_TOP],
    right: [-CLOSED_BUTTON_SIZE / 2, BUTTON_OFFSET_RIGHT]
  };
  return config;
});

const useAnimatedIconStyles = createAnimatedStyles({
  edit: {
    transform: [{ scale: [1, 0.25] }],
    opacity: [1, 0]
  },
  editOff: {
    transform: [{ scale: [0.25, 1] }],
    opacity: [0, 1]
  }
});

type FavoritesEditButtonProps = {
  onPress: (isEditing: boolean) => void;
};

const FavoritesEditButton: React.FC<FavoritesEditButtonProps> = ({
  onPress
}) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const iconAnimationProgress = useSharedValue(0);
  const buttonAnimationProgress = useSharedValue(0);

  const animatedButtonStyle = useAnimatedButtonStyle(theme)(
    buttonAnimationProgress
  );
  const animatedIconStyles = useAnimatedIconStyles(iconAnimationProgress);

  const handleButtonPress = () => {
    const newIsEditing = !isEditing;
    iconAnimationProgress.value = withTiming(+newIsEditing, ANIMATION_CONFIG);
    buttonAnimationProgress.value = withTiming(+newIsEditing, ANIMATION_CONFIG);
    if (onPress) onPress(newIsEditing);
    setIsEditing(newIsEditing);
  };

  return (
    <ButtonWrapper style={animatedButtonStyle} shadowed>
      <TouchableWrapper onPress={handleButtonPress}>
        <AnimatedIconWrapper style={animatedIconStyles.edit}>
          <Icon name="edit" />
        </AnimatedIconWrapper>
        <AnimatedIconWrapper style={animatedIconStyles.editOff}>
          <Icon name="edit-off" />
        </AnimatedIconWrapper>
      </TouchableWrapper>
    </ButtonWrapper>
  );
};

export default React.memo(FavoritesEditButton);
