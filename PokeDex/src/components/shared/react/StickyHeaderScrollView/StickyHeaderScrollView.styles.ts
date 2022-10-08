import styled, { css } from 'styled-components/native';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import FeatherIcon from 'react-native-vector-icons/Feather';

export const Wrapper = styled.View`
  flex: 1;
`;

export const SectionsContentWrapper = styled.View`
  background-color: ${({ theme }) => theme.color.background.primary};
`;

export const SectionContentWrapper = styled.View``;

export const ContentTitlePlaceholder = styled.View`
  ${({ theme }) => css`
    height: ${theme.fontSize.h4 + theme.space.lg + theme.space.md}px;
  `}
`;

export const ContentTitle = styled(Animated.Text)`
  text-transform: uppercase;
  position: absolute;

  ${({ theme }) => css`
    color: ${theme.color.text.primary};
    padding: ${theme.space.lg}px;
    font-size: ${theme.fontSize.h4}px;
    font-weight: ${theme.fontWeight.bold};
    padding-bottom: ${theme.space.md}px;
  `}
`;

export const StickyHeaderWrapper = styled(Animated.View)`
  position: absolute;
  width: 100%;
`;

export const BackButton = styled(Animated.createAnimatedComponent(Pressable))<{
  top: number;
}>`
  position: absolute;
  z-index: 1;

  ${({ theme, top }) => css`
    top: ${top + theme.space.lg}px;
    left: ${theme.space.md}px;
  `}
`;

export const BackButtonIcon = styled(FeatherIcon).attrs(({ theme }) => ({
  name: 'arrow-left',
  size: theme.size.sm
}))`
  ${({ theme }) => css`
    color: ${theme.color.text.secondary};
    ${theme.shadow.box.soft.md};
  `}
`;
