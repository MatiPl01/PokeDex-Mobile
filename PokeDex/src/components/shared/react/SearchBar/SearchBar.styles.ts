import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { AnimatedIconWrapper } from '@components/shared/styled/icons';
import { AbsoluteRoundButtonWrapper } from '@components/shared/styled/buttons';

export const OuterWrapper = styled(Animated.View)`
  position: absolute;
  z-index: 1;

  ${({ theme }) => css`
    height: ${theme.size.lg}px;
    left: ${theme.space.lg}px;
    top: ${theme.space.lg}px;
    padding-top: ${(theme.size.lg - theme.size.md) / 2}px;
    padding-right: ${theme.size.lg / 2}px;
  `};
`;

export const IconWrapper = styled(AnimatedIconWrapper)`
  opacity: 0;
  transform: scale(0.5);
`;

export const InputWrapper = styled(Animated.View)`
  z-index: -1;
  width: 100%;
  overflow: hidden;
  height: ${({ theme }) => theme.size.md}px;
`;

const StyledTextInput = styled.TextInput`
  height: 100%;

  ${({ theme }) => css`
    padding: 0 ${theme.size.lg - 10}px 0 10px;
    font-size: ${theme.fontSize.title}px;
    border: 1px solid ${theme.color.text.tertiary};
    background-color: ${theme.color.background.secondary};
    color: ${theme.color.text.primary};
    ${theme.shadow.text.soft.sm};
  `};
`;

export const SearchInput = Animated.createAnimatedComponent(StyledTextInput);

export const SearchButtonWrapper = styled(AbsoluteRoundButtonWrapper).attrs(
  ({ theme }) => ({
    size: theme.size.lg
  })
)``;
