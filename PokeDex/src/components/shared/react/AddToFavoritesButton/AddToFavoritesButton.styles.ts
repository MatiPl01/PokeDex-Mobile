import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { TouchableWrapper as DefaultTouchableWrapper } from '@components/shared/styled/buttons';

export const TouchableWrapper = styled(DefaultTouchableWrapper)<{
  size: number;
}>`
  ${({ size }) => css`
    height: ${size}px;
    width: ${size}px;
  `};
`;

export const HeartIconOutline = styled(AntDesignIcon).attrs({
  name: 'hearto'
})`
  position: absolute;
  color: ${({ theme }) => theme.color.red.primary};
`;

export const HeartIconFilled = styled(
  Animated.createAnimatedComponent(AntDesignIcon)
).attrs({
  name: 'heart'
})`
  color: ${({ theme }) => theme.color.red.primary};
`;

export const HeartIconEffect = styled(
  Animated.createAnimatedComponent(AntDesignIcon)
).attrs({
  name: 'heart'
})`
  position: absolute;
  top: 0;

  color: ${({ theme }) => theme.color.red.secondary};
`;
