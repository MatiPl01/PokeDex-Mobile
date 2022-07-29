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
import { useTheme } from 'styled-components';
import {
  getSearchSuggestions,
  SearchItem as SearchItemType,
  SearchSuggestionItem
} from '@utils/search';
import { createAnimatedStyle, createAnimatedStyles } from '@utils/reanimated';
import {
  SEARCH_BAR_HEIGHT,
  FOCUSED_SEARCH_BAR_HEIGHT
} from './SearchBar.styles';
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
  ScrollTopIcon,
  SUGGESTION_ITEM_HEIGHT,
  SUGGESTIONS_FOOTER_HEIGHT
} from './SearchSuggestions.styles';

const useAnimatedRevealStyles = createAnimatedStyles({
  wrapper: {
    top: [SEARCH_BAR_HEIGHT, FOCUSED_SEARCH_BAR_HEIGHT],
    opacity: [0, 1]
  }
});

const useAnimatedShowMoreFooterStyle = createAnimatedStyle({
  height: [0, SUGGESTIONS_FOOTER_HEIGHT],
  opacity: [0, 1]
});

const useAnimatedScrollTopButtonStyle = createAnimatedStyle({
  transform: [{ scale: [0.5, 1] }],
  opacity: [0, 1]
});

const useAnimatedScrollTopIconStyle = createAnimatedStyle({
  transform: [{ scale: [0.5, 1] }],
  opacity: [0, 1]
});

type SearchSuggestionsProps = {
  data: SearchItemType[];
  searchValue: string;
  onSelect: (item: SearchItemType) => void;
  onSearchFetchRequest?: () => void;
  isRevealed?: boolean;
  limit?: number;
  loadMoreOnScroll?: boolean;
};

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  data,
  searchValue,
  onSelect,
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
  const animatedRevealStyles = useAnimatedRevealStyles(revealProgress);
  const animatedShowMoreFooterStyle =
    useAnimatedShowMoreFooterStyle(showMoreProgress);
  const animatedShowMoreWrapperStyle = createAnimatedStyle({
    maxHeight: [
      limit * SUGGESTION_ITEM_HEIGHT,
      limit * SUGGESTION_ITEM_HEIGHT +
        (+loadMoreOnScroll && SUGGESTIONS_FOOTER_HEIGHT)
    ]
  })(showMoreProgress);
  const animatedScrollTopButtonStyle = useAnimatedScrollTopButtonStyle(
    scrollTopButtonProgress
  );
  const animatedScrollTopIconStyle = useAnimatedScrollTopIconStyle(
    scrollTopIconProgress
  );

  useEffect(() => {
    const newSuggestions = getSearchSuggestions(searchValue, data);
    setSuggestions(newSuggestions);
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
      100,
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
    item: { item, prefix, suffix }
  }) => (
    <SuggestionItem onPress={() => onSelect(item)}>
      <SuggestionTextBold>{prefix}</SuggestionTextBold>
      <SuggestionText>{searchValue}</SuggestionText>
      <SuggestionTextBold>{suffix}</SuggestionTextBold>
    </SuggestionItem>
  );

  if (!suggestions.length) return null;

  return (
    <OuterWrapper
      style={[animatedRevealStyles.wrapper, animatedShowMoreWrapperStyle]}
      itemCount={Math.min(suggestions.length, limit)}
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
            <TouchableOpacity onPress={scrollToTop}>
              <ScrollTopIcon
                name="chevron-up"
                size={30}
                style={animatedScrollTopIconStyle}
              />
            </TouchableOpacity>
          </ScrollTopButton>
        </>
      )}
    </OuterWrapper>
  );
};

export default SearchSuggestions;
