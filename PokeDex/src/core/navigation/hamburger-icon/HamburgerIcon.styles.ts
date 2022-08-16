import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { absoluteFill } from '@styles/shared';
import { TouchableWrapper as DefaultTouchableWrapper } from '@components/shared/styled/buttons';

export const AnimatedButton = styled(Animated.View)`
  ${absoluteFill};
`;

export const TouchableWrapper = styled(DefaultTouchableWrapper)`
  padding: 20%;
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
