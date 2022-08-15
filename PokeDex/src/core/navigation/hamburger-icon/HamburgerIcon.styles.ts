import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { TouchableWrapper as SharedTouchableWrapper } from '@components/shared';

export const AnimatedButton = styled(Animated.View)`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export const TouchableWrapper = styled(SharedTouchableWrapper)`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

export const AnimatedBar = styled(Animated.View)`
  width: 100%;
  height: 3px;
  border-radius: 5px;
  ${({ theme }) => css`
    background-color: ${theme.color.white};
    ${theme.shadow.strong.md};
  `};
`;
