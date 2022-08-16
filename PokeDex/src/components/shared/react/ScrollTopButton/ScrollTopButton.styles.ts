import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import EntypoIcon from 'react-native-vector-icons/Entypo';

export const ButtonWrapper = styled(Animated.View)`
  position: absolute;

  ${({ theme }) => css`
    bottom: ${theme.space.lg}px;
    right: ${theme.space.lg}px;
    width: ${theme.size.lg}px;
    height: ${theme.size.lg}px;
    border-radius: ${theme.size.lg}px;
    background-color: ${theme.color.accent.primary};
    ${theme.shadow.medium.md};
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
