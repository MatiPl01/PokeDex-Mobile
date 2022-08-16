import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { flexCenter } from '@styles/shared';

export const TouchableWrapper = styled(TouchableWithoutFeedback)<{
  size: number;
}>`
  position: relative;
  ${flexCenter};

  ${({ size }) => css`
    height: ${size}px;
    width: ${size}px;
  `};
`;

export const HeartIconOutline = styled(AntDesignIcon).attrs({
  name: 'hearto'
})`
  position: absolute;
  color: ${({ theme }) => theme.color.red.dark};
`;

export const HeartIconFilled = styled(
  Animated.createAnimatedComponent(AntDesignIcon)
).attrs({
  name: 'heart'
})`
  color: ${({ theme }) => theme.color.red.dark};
`;

export const HeartIconEffect = styled(
  Animated.createAnimatedComponent(AntDesignIcon)
).attrs({
  name: 'heart'
})`
  position: absolute;
  top: 0;

  color: ${({ theme }) => theme.color.red.light};
`;
