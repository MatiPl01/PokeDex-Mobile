import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { AbsoluteRoundButtonWrapper } from '@components/shared/styled/buttons';

export const ButtonWrapper = styled(AbsoluteRoundButtonWrapper).attrs(
  ({ theme }) => ({
    size: theme.size.md
  })
)`
  ${({ theme }) => css`
    bottom: ${theme.space.lg}px;
    right: ${theme.space.lg}px;
  `};
`;

export const ButtonIcon = styled(
  Animated.createAnimatedComponent(EntypoIcon)
).attrs(({ theme }) => ({
  size: theme.size.sm
}))`
  ${({ theme }) => css`
    color: ${theme.color.white};
    ${theme.shadow.strong.md};
  `};
`;
