import styled, { css } from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { flexCenter } from '@styles/shared';

export const BUTTON_DISTANCE = 20;
export const BUTTON_SIZE = 60;
export const ICON_SIZE = BUTTON_SIZE / 2;

export const ButtonWrapper = styled(Animated.View)`
  position: absolute;
  bottom: ${BUTTON_DISTANCE}px;
  right: ${BUTTON_DISTANCE}px;
  width: ${BUTTON_SIZE}px;
  height: ${BUTTON_SIZE}px;
  border-radius: ${BUTTON_SIZE}px;

  ${({ theme }) => css`
    background-color: ${theme.color.accent.primary};
    ${theme.shadow.medium.md};
  `};
`;

export const ButtonTouchable = styled(TouchableOpacity)`
  width: 100%;
  height: 100%;
  ${flexCenter};
`;

export const ButtonIcon = styled(
  Animated.createAnimatedComponent(EntypoIcon)
).attrs({
  size: ICON_SIZE
})`
  ${({ theme }) => css`
    color: ${theme.color.white};
    ${theme.shadow.strong.md};
  `};
`;
