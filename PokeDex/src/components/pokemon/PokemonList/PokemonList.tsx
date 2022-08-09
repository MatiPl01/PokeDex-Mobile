import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  ListRenderItem,
  ViewToken,
  FlatList,
  RefreshControl
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createAnimatedStyle } from '@utils/reanimated';
import {
  fetchNextPokemonBatchAsync,
  refetchPokemonList
} from '@store/pokemon/pokemon.actions';
import {
  selectDisplayedPokemonList,
  selectPokemonAreAllDisplayed,
  selectPokemonReachedEnd
} from '@store/pokemon/pokemon.selector';
import { SinglePokemonState } from '@store/pokemon/pokemon.reducer';
import ScrollTopButton from '@components/shared/ScrollTopButton/ScrollTopButton';
import {
  SCREEN_HEIGHT,
  LOGO_BAR_HEIGHT
} from '@core/splash-screen/SplashScreen';
import {
  SEARCH_BAR_HEIGHT,
  SEARCH_BAR_PADDING_TOP
} from '@components/shared/SearchBar/SearchBar.styles';
import PokemonCard from '../PokemonCard/PokemonCard';
import PokemonListFooter from './PokemonListFooter';
import { CARD_HEIGHT } from '../PokemonCard/PokemonCard.styles';
import {
  LIST_SEPARATOR_HEIGHT,
  CardListWrapper,
  CardList,
  ListSeparator,
  EmptyListFooter,
  PokemonListHeader
} from './PokemonList.styles';

const LIST_CONTAINER_HEIGHT = SCREEN_HEIGHT - LOGO_BAR_HEIGHT;
const LIST_ITEM_HEIGHT = CARD_HEIGHT + LIST_SEPARATOR_HEIGHT;
const POKEMON_LIST_PADDING_TOP = SEARCH_BAR_HEIGHT + SEARCH_BAR_PADDING_TOP;

const useAnimatedCardListHeaderStyle = createAnimatedStyle({
  paddingTop: [0, POKEMON_LIST_PADDING_TOP]
});

type PokemonListProps = {
  isSearchBarOpen?: boolean;
};

const PokemonList: React.FC<PokemonListProps> = ({
  isSearchBarOpen = false
}) => {
  const edges = useSafeAreaInsets();
  const dispatch = useDispatch();
  const theme = useTheme();
  const cardListRef = useRef<FlatList | null>(null);
  // Data
  const pokemonList = useSelector(selectDisplayedPokemonList);
  const reachedEnd = useSelector(selectPokemonReachedEnd);
  const areAllDisplayed = useSelector(selectPokemonAreAllDisplayed);
  // Animated values
  const scrollY = useRef(new Animated.Value(0)).current;
  const cardListHeaderAnimationProgress = useSharedValue(0);
  // Animated styles
  const animatedCardListHeaderStyle = useAnimatedCardListHeaderStyle(
    cardListHeaderAnimationProgress
  );
  // Interpolation input range
  const inputRange = [
    -LIST_ITEM_HEIGHT,
    -LIST_ITEM_HEIGHT * 0.25,
    LIST_CONTAINER_HEIGHT - LIST_ITEM_HEIGHT * 0.75 - edges.top,
    LIST_CONTAINER_HEIGHT - edges.top
  ];
  // Component state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [scrollTopButtonVisible, setScrollTopButtonVisible] = useState(false);

  useEffect(() => {
    if (areAllDisplayed && !pokemonList.length) loadMorePokemon();
  }, []);

  useEffect(() => {
    if (isRefreshing && pokemonList.length) setIsRefreshing(false);
  }, [pokemonList]);

  useEffect(() => {
    cardListHeaderAnimationProgress.value = withTiming(+isSearchBarOpen, {
      duration: 500
    });
  }, [isSearchBarOpen]);

  const handleVisibleCardsChange = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const firstCardIdx = viewableItems[0]?.index || 0;
      setScrollTopButtonVisible(firstCardIdx > 0);
    },
    []
  );

  const refreshPokemonList = () => {
    setIsRefreshing(true);
    dispatch(refetchPokemonList());
  };

  const loadMorePokemon = () => {
    dispatch(fetchNextPokemonBatchAsync());
  };

  const scrollToTop = () => {
    cardListRef.current?.scrollToOffset({
      offset: 0
    });
  };

  const renderItem: ListRenderItem<SinglePokemonState> = ({
    item: { pokemon, isLoading },
    index
  }) => {
    const position = Animated.subtract(index * LIST_ITEM_HEIGHT, scrollY);

    const scale = position.interpolate({
      inputRange,
      outputRange: [0.5, 1, 1, 0.5]
    });

    const opacity = position.interpolate({
      inputRange,
      outputRange: [0.25, 1, 1, 0.25]
    });

    const translateY = position.interpolate({
      inputRange,
      outputRange: [LIST_ITEM_HEIGHT * 0.25, 0, 0, -LIST_ITEM_HEIGHT * 0.25]
    });

    return (
      <Animated.View
        style={{ transform: [{ scale }, { translateY }], opacity }}
      >
        <PokemonCard pokemon={pokemon} isLoading={isLoading} />
      </Animated.View>
    );
  };

  const renderHeader = () => (
    <PokemonListHeader style={animatedCardListHeaderStyle} />
  );

  const renderFooter = () =>
    areAllDisplayed ? (
      <PokemonListFooter reachedEnd={reachedEnd} />
    ) : (
      <EmptyListFooter />
    );

  return (
    <CardListWrapper>
      <CardList
        ref={cardListRef}
        data={pokemonList}
        keyExtractor={(item: SinglePokemonState) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={ListSeparator}
        onEndReached={areAllDisplayed ? loadMorePokemon : undefined}
        onViewableItemsChanged={handleVisibleCardsChange}
        onEndReachedThreshold={1}
        scrollEventThrottle={16}
        updateCellsBatchingPeriod={200}
        maxToRenderPerBatch={8}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={renderHeader}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            colors={[theme.color.accent.primary]}
            tintColor={theme.color.accent.primary}
            onRefresh={refreshPokemonList}
            progressViewOffset={15}
          />
        }
      />
      <ScrollTopButton
        isVisible={scrollTopButtonVisible}
        onScrollTop={scrollToTop}
      />
    </CardListWrapper>
  );
};

export default PokemonList;
