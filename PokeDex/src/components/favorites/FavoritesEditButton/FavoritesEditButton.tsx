import React, { useState } from 'react';
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { createAnimatedStyle, createAnimatedStyles } from '@utils/reanimated';
import {
  Icon,
  ButtonWrapper,
  IconWrapper,
  BUTTON_SIZE,
  BUTTON_OFFSET_TOP,
  BUTTON_OFFSET_RIGHT
} from './FavoritesEditButton.styles';
import { TouchableWrapper } from '@components/shared';

const CLOSED_BUTTON_SCALE = 2;
const CLOSED_BUTTON_SIZE = CLOSED_BUTTON_SCALE * BUTTON_SIZE;

const useAnimatedButtonStyle = createAnimatedStyle({
  width: [CLOSED_BUTTON_SIZE, BUTTON_SIZE],
  height: [CLOSED_BUTTON_SIZE, BUTTON_SIZE],
  paddingTop: [CLOSED_BUTTON_SIZE * 0.35, 0],
  paddingRight: [CLOSED_BUTTON_SIZE * 0.35, 0],
  transform: [
    {
      translateX: [CLOSED_BUTTON_SIZE / 2 + BUTTON_OFFSET_TOP, 0]
    },
    {
      translateY: [-(CLOSED_BUTTON_SIZE / 2 + BUTTON_OFFSET_RIGHT), 0]
    }
  ]
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
  onPress?: (isEditing: boolean) => void;
};

const FavoritesEditButton: React.FC<FavoritesEditButtonProps> = ({
  onPress
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const iconAnimationProgress = useSharedValue(0);
  const buttonAnimationProgress = useSharedValue(0);
  const animatedButtonStyle = useAnimatedButtonStyle(buttonAnimationProgress);
  const animatedIconStyles = useAnimatedIconStyles(iconAnimationProgress);

  const handleButtonPress = () => {
    const newIsEditing = !isEditing;
    iconAnimationProgress.value = withTiming(+newIsEditing, {
      duration: 250,
      easing: Easing.bezier(0.4, 0, 0.9, 0.65)
    });
    buttonAnimationProgress.value = withTiming(+newIsEditing, {
      duration: 250,
      easing: Easing.bezier(0.4, 0, 0.9, 0.65)
    });
    if (onPress) onPress(newIsEditing);
    setIsEditing(newIsEditing);
  };

  return (
    <ButtonWrapper style={animatedButtonStyle}>
      <TouchableWrapper onPress={handleButtonPress}>
        <IconWrapper style={animatedIconStyles.edit}>
          <Icon name="edit" />
        </IconWrapper>
        <IconWrapper style={animatedIconStyles.editOff}>
          <Icon name="edit-off" />
        </IconWrapper>
      </TouchableWrapper>
    </ButtonWrapper>
  );
};

export default FavoritesEditButton;
