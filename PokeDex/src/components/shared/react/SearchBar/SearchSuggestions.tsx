import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FlatList,
  ListRenderItem,
  ViewToken,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import {
  Easing,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { DefaultTheme, useTheme } from 'styled-components';
import {
  getSearchSuggestions,
  SearchItem as SearchItemType,
  SearchSuggestionItem
} from '@utils/search';
import {
  createAnimatedStyle,
  createAnimatedParametrizedStyle
} from '@utils/reanimated';
import {
  OuterWrapper,
  SuggestionList,
  SuggestionItem,
  SuggestionText,
  SuggestionTextBold,
  ListSeparator,
  Footer,
  FooterText,
  ScrollTopButton,
  ScrollTopIcon
} from './SearchSuggestions.styles';
import { TouchableWrapper } from '@components/shared/styled/buttons';

const useAnimatedScrollTopButtonStyle = createAnimatedStyle({
  transform: [{ scale: [0.5, 1] }],
  opacity: [0, 1]
});

const useAnimatedScrollTopIconStyle = createAnimatedStyle({
  transform: [{ scale: [0.5, 1] }],
  opacity: [0, 1]
});

const useAnimatedWrapperRevealStyle =
  createAnimatedParametrizedStyle<DefaultTheme>(theme => ({
    top: [theme.size.md, theme.size.lg],
    opacity: [0, 1]
  }));

const useAnimatedShowMoreFooterStyle =
  createAnimatedParametrizedStyle<DefaultTheme>(theme => ({
    height: [0, theme.size.md],
    opacity: [0, 1]
  }));

type SearchSuggestionsProps = {
  data: SearchItemType[];
  searchValue: string;
  onSelect: (item: SearchItemType) => void;
  isRevealed?: boolean;
  limit?: number;
  loadMoreOnScroll?: boolean;
  onSuggestionsChange?: (items: SearchSuggestionItem[]) => void;
  onSearchFetchRequest?: () => void;
};

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  data,
  searchValue,
  onSelect,
  onSuggestionsChange,
  onSearchFetchRequest,
  isRevealed = true,
  limit = 5,
  loadMoreOnScroll = true
}) => {
  const theme = useTheme();
  const flatListRef = useRef<FlatList | null>(null);
  // Component state
  const [suggestions, setSuggestions] = useState<SearchSuggestionItem[]>([]);
  const [lastVisibleItemIdx, setLastVisibleItemIdx] = useState(-1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Animation progress values
  const revealProgress = useSharedValue(0);
  const showMoreProgress = useSharedValue(0);
  const scrollTopButtonProgress = useSharedValue(0);
  const scrollTopIconProgress = useSharedValue(0);
  // Animated styles
  const animatedWrapperRevealStyle =
    useAnimatedWrapperRevealStyle(theme)(revealProgress);
  const animatedShowMoreFooterStyle =
    useAnimatedShowMoreFooterStyle(theme)(showMoreProgress);
  const animatedScrollTopButtonStyle = useAnimatedScrollTopButtonStyle(
    scrollTopButtonProgress
  );
  const animatedScrollTopIconStyle = useAnimatedScrollTopIconStyle(
    scrollTopIconProgress
  );
  const animatedShowMoreWrapperStyle = createAnimatedStyle({
    maxHeight: [
      limit * theme.size.md,
      limit * theme.size.md + (+loadMoreOnScroll && theme.size.md)
    ]
  })(showMoreProgress);

  useEffect(() => {
    const newSuggestions = getSearchSuggestions(searchValue, data);
    setSuggestions(newSuggestions);
    if (onSuggestionsChange) onSuggestionsChange(newSuggestions);
  }, [data, searchValue]);

  useEffect(() => {
    revealProgress.value = withTiming(+isRevealed, {
      duration: 200
    });
  }, [isRevealed]);

  useEffect(() => {
    // Show more footer animation
    showMoreProgress.value = withTiming(
      +(lastVisibleItemIdx < suggestions.length - 1),
      {
        duration: 300,
        easing: Easing.bezier(0.175, 0.885, 0.32, 1.275)
      }
    );
    // Scroll top button animations
    const showScrollTopButton = +(lastVisibleItemIdx > limit);
    scrollTopButtonProgress.value = withTiming(+showScrollTopButton, {
      duration: 250
    });
    scrollTopIconProgress.value = withDelay(
      75,
      withTiming(+showScrollTopButton, {
        duration: 200
      })
    );
  }, [lastVisibleItemIdx]);

  useEffect(() => {
    // Stop refreshing if the new search data was provided
    setIsRefreshing(false);
  }, [data]);

  const handleSuggestionListChange = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      let lastItemIdx = viewableItems.length - 1;
      const lastViewableItem = viewableItems[lastItemIdx];
      if (lastItemIdx > 0 && lastViewableItem.index) {
        lastItemIdx = lastViewableItem.index;
      }
      setLastVisibleItemIdx(lastItemIdx);
    },
    []
  );

  const handleSearchRefresh = useCallback(() => {
    if (!onSearchFetchRequest) return;
    setIsRefreshing(true);
    onSearchFetchRequest();
  }, []);

  const scrollToNextItems = () => {
    flatListRef.current?.scrollToIndex({
      index: Math.min(lastVisibleItemIdx + 1, suggestions.length - 1)
    });
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({
      offset: 0
    });
  };

  const renderItem: ListRenderItem<SearchSuggestionItem> = ({
    item: { item, prefix, infix, suffix }
  }) => (
    <SuggestionItem onPress={() => onSelect(item)}>
      <SuggestionTextBold>{prefix}</SuggestionTextBold>
      <SuggestionText>{infix}</SuggestionText>
      <SuggestionTextBold>{suffix}</SuggestionTextBold>
    </SuggestionItem>
  );

  if (!suggestions.length) return null;

  return (
    <OuterWrapper
      style={[animatedWrapperRevealStyle, animatedShowMoreWrapperStyle]}
      itemCount={Math.min(suggestions.length, limit)}
      pointerEvents={isRevealed ? 'auto' : 'none'}
    >
      <SuggestionList
        ref={flatListRef}
        data={suggestions}
        keyExtractor={(item: SearchSuggestionItem) => item.item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={ListSeparator}
        scrollEnabled={loadMoreOnScroll}
        onViewableItemsChanged={handleSuggestionListChange}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 25
        }}
        onScrollToIndexFailed={() => flatListRef.current?.scrollToEnd()}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            colors={[theme.color.accent.primary]}
            tintColor={theme.color.accent.primary}
            onRefresh={handleSearchRefresh}
            progressViewOffset={15}
          />
        }
      />
      {loadMoreOnScroll && suggestions.length > limit && (
        <>
          <Footer style={animatedShowMoreFooterStyle}>
            <TouchableOpacity onPress={scrollToNextItems}>
              <FooterText>Scroll to see more suggestions</FooterText>
            </TouchableOpacity>
          </Footer>
          <ScrollTopButton style={animatedScrollTopButtonStyle}>
            <TouchableWrapper onPress={scrollToTop}>
              <ScrollTopIcon
                name="chevron-up"
                size={30}
                style={animatedScrollTopIconStyle}
              />
            </TouchableWrapper>
          </ScrollTopButton>
        </>
      )}
    </OuterWrapper>
  );
};

export default SearchSuggestions;
