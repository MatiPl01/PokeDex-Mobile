import { flexCenter } from './../../styles/shared';
import { SearchSuggestionItem } from './../../utils/search';
import { FlatList, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {
  SEARCH_BAR_HEIGHT,
  SEARCH_BAR_HORIZONTAL_PADDING
} from './SearchBar.styles';

export const SUGGESTION_ITEM_HEIGHT = 50;
export const SUGGESTIONS_FOOTER_HEIGHT = 50;
export const SUGGESTION_LIST_PADDING = SEARCH_BAR_HORIZONTAL_PADDING;
const SCROLL_TOP_BUTTON_PADDING = SUGGESTION_LIST_PADDING / 2;
const SCROLL_TOP_BUTTON_SIZE =
  SUGGESTIONS_FOOTER_HEIGHT - 2 * SCROLL_TOP_BUTTON_PADDING;

export const OuterWrapper = styled(Animated.View)<{ itemCount: number }>`
  position: absolute;
  width: 100%;
  z-index: -2;
  top: ${SEARCH_BAR_HEIGHT}px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.color.background.secondary};
  border: 1px solid ${({ theme }) => theme.color.text.tertiary};
  min-height: ${({ itemCount }) => SUGGESTION_ITEM_HEIGHT * itemCount}px;
  ${({ theme }) => theme.shadow.strong.lg};
`;

export const SuggestionList = styled(
  FlatList as new () => FlatList<SearchSuggestionItem>
)``;

export const SuggestionItem = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  height: ${SUGGESTION_ITEM_HEIGHT}px;
  padding: 0 ${SUGGESTION_LIST_PADDING}px;
`;

export const SuggestionText = styled.Text`
  font-size: ${({ theme }) => theme.fontSize.body};
  color: ${({ theme }) => theme.color.text.secondary};
`;

export const SuggestionTextBold = styled(SuggestionText)`
  font-weight: bold;
`;

export const ListSeparator = styled.View`
  margin: 0 ${SUGGESTION_LIST_PADDING}px;
  height: 1px;
  background-color: ${({ theme }) => theme.color.text.tertiary};
`;

export const Footer = styled(Animated.View)`
  align-items: center;
  justify-content: center;
  height: ${SUGGESTIONS_FOOTER_HEIGHT}px;
`;

export const FooterText = styled.Text`
  font-size: ${({ theme }) => theme.fontSize.caption};
  color: ${({ theme }) => theme.color.text.tertiary};
`;

export const ScrollTopButton = styled(Animated.View)`
  position: absolute;
  bottom: ${SCROLL_TOP_BUTTON_PADDING}px;
  right: ${SCROLL_TOP_BUTTON_PADDING}px;
  width: ${SCROLL_TOP_BUTTON_SIZE}px;
  height: ${SCROLL_TOP_BUTTON_SIZE}px;
  border-radius: ${SCROLL_TOP_BUTTON_SIZE}px;
  background-color: ${({ theme }) => theme.color.accent.primary};
  ${({ theme }) => theme.shadow.soft.sm};
  ${flexCenter};
`;

const StyledScrollTopIcon = styled(EntypoIcon)`
  color: ${({ theme }) => theme.color.white};
`;

export const ScrollTopIcon =
  Animated.createAnimatedComponent(StyledScrollTopIcon);
