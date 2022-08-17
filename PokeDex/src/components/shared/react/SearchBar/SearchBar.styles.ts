import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { flexCenter, absoluteFill } from '@styles/shared';
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

export const IconWrapper = styled(Animated.View)`
  opacity: 0;
  transform: scale(0.5);
  ${absoluteFill};
  ${flexCenter};
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
    /* TODO - maybe think of better theme structure (use something else than theme.color.text) for border color */
    border: 1px solid ${theme.color.text.tertiary};
    background-color: ${theme.color.background.secondary};
    color: ${theme.color.text.primary};
    ${theme.shadow.soft.sm};
  `};
`;

export const SearchInput = Animated.createAnimatedComponent(StyledTextInput);

export const SearchButtonWrapper = styled(
  Animated.createAnimatedComponent(AbsoluteRoundButtonWrapper)
).attrs(({ theme }) => ({
  size: theme.size.lg
}))``;
