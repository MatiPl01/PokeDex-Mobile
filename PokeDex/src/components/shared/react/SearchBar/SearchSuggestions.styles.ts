import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { FlatList, FlatListProps, TouchableOpacity } from 'react-native';
import { SearchSuggestionItem } from '@utils/search';
import { flexCenter } from '@styles/shared';

export const OuterWrapper = styled(Animated.View)<{ itemCount: number }>`
  position: absolute;
  width: 100%;
  z-index: -2;
  overflow: hidden;

  ${({ theme, itemCount }) => css`
    background-color: ${theme.color.background.secondary};
    border: 1px solid ${theme.color.text.tertiary};
    min-height: ${theme.size.md * itemCount}px;
    top: ${theme.size.md}px;
    ${theme.shadow.box.strong.lg};
  `};
`;

export const SuggestionList = styled(
  FlatList as new (
    props: FlatListProps<SearchSuggestionItem>
  ) => FlatList<SearchSuggestionItem>
)``;

export const SuggestionItem = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;

  ${({ theme }) => css`
    height: ${theme.size.md}px;
    padding: 0 ${theme.space.lg}px;
  `};
`;

export const SuggestionText = styled.Text`
  ${({ theme }) => css`
    font-size: ${theme.fontSize.body}px;
    color: ${theme.color.text.secondary};
  `};
`;

export const SuggestionTextBold = styled(SuggestionText)`
  font-weight: bold;
`;

export const ListSeparator = styled.View`
  height: 1px;
  ${({ theme }) => css`
    margin: 0 ${theme.space.lg}px;
    background-color: ${theme.color.text.tertiary};
  `};
`;

export const Footer = styled(Animated.View)`
  align-items: center;
  justify-content: center;
  height: ${({ theme }) => theme.size.md}px;
`;

export const FooterText = styled.Text`
  ${({ theme }) => css`
    font-size: ${theme.fontSize.caption}px;
    color: ${theme.color.text.tertiary};
  `};
`;

export const ScrollTopButton = styled(Animated.View)`
  position: absolute;
  ${flexCenter};

  ${({ theme }) => css`
    bottom: ${theme.space.md}px;
    right: ${theme.space.md}px;
    
    width: ${theme.size.md - 2 * theme.space.md}px;
    height: ${theme.size.md - 2 * theme.space.md}px;
    border-radius: ${theme.size.md - 2 * theme.space.md}px;
    background-color: ${theme.color.accent.primary};
    ${theme.shadow.box.soft.sm};
  `};
`;

export const ScrollTopIcon = styled(
  Animated.createAnimatedComponent(EntypoIcon)
)`
  color: ${({ theme }) => theme.color.white};
`;
