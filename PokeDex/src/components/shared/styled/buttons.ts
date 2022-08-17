import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native';
import { flexCenter, relativeFill } from '@styles/shared';

export const RoundButtonWrapper = styled(
  Animated.createAnimatedComponent(TouchableOpacity)
).attrs({
  activeOpacity: 1
})<{
  size: number;
  type?: 'primary'; // TODO - maybe add some secondary button type
  shadowed?: boolean;
}>`
  ${flexCenter};
  ${({ theme, size, type, shadowed }) => css`
    width: ${size}px;
    height: ${size}px;
    border-radius: ${size}px;
    background-color: ${theme.color.accent.primary};
    ${shadowed && theme.shadow.medium.md};
  `};
`;

export const AbsoluteRoundButtonWrapper = styled(RoundButtonWrapper).attrs(
  ({ theme }) => ({
    size: theme.size.lg,
    shadowed: true
  })
)`
  position: absolute;
  z-index: 1;
`;

export const TouchableWrapper = styled(TouchableOpacity).attrs({
  activeOpacity: 1
})`
  ${relativeFill}
  ${flexCenter};
`;
