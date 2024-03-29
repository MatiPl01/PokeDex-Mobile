import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  ListRenderItem,
  ViewToken,
  FlatList,
  RefreshControl,
  Pressable
} from 'react-native';
import ReAnimated, {
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { DefaultTheme, useTheme } from 'styled-components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SIZE } from '@constants';
import { RootStackParamList } from '@core/Navigation/Navigation';
import { createAnimatedParametrizedStyle } from '@utils/reanimated';
import {
  fetchNextPokemonBatchAsync,
  refetchPokemonList
} from '@store/pokemon/pokemon.actions';
import {
  selectDisplayedPokemonStates,
  selectPokemonAreAllDisplayed,
  selectPokemonReachedEnd
} from '@store/pokemon/pokemon.selector';
import { SinglePokemonState } from '@store/pokemon/pokemon.reducer';
import { Separator } from '@components/shared/styled/layout';
import ScrollTopButton from '@components/shared/react/ScrollTopButton/ScrollTopButton';
import PokemonCard from '../PokemonCard/PokemonCard';
import PokemonListFooter from './PokemonListFooter';
import PokemonListEmptyComponent from './PokemonListEmptyComponent';
import { CARD_HEIGHT } from '../PokemonCard/PokemonCard.styles';
import {
  CardListWrapper,
  CardList,
  EmptyListFooter
} from './PokemonList.styles';
import { selectSearchValue } from '@store/search/search.selector';

const useAnimatedCardListHeaderStyle =
  createAnimatedParametrizedStyle<DefaultTheme>(theme => ({
    paddingTop: [0, theme.size.md + theme.space.lg]
  }));

type PokemonListProps = {
  isSearchBarOpen?: boolean;
};

const PokemonList: React.FC<PokemonListProps> = ({
  isSearchBarOpen = false
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const edges = useSafeAreaInsets();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'FullScreenStack'>>();
  const cardListRef = useRef<FlatList | null>(null);
  const LOGO_BAR_HEIGHT = theme.size.lg;
  const LIST_CONTAINER_HEIGHT = SIZE.SCREEN.HEIGHT - LOGO_BAR_HEIGHT;
  const LIST_SEPARATOR_HEIGHT = theme.space.xl;
  const LIST_ITEM_HEIGHT = CARD_HEIGHT + LIST_SEPARATOR_HEIGHT;
  // Data
  const pokemonList = useSelector(selectDisplayedPokemonStates);
  const reachedEnd = useSelector(selectPokemonReachedEnd);
  const areAllDisplayed = useSelector(selectPokemonAreAllDisplayed);
  const searchValue = useSelector(selectSearchValue);
  // Animated values
  const scrollY = useRef(new Animated.Value(0)).current;
  const cardListHeaderAnimationProgress = useSharedValue(0);
  // Animated styles
  const animatedCardListHeaderStyle = useAnimatedCardListHeaderStyle(theme)(
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
    item: { id: pokemonId, pokemon, isLoading },
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
        <Pressable
          key={pokemonId}
          onPress={() =>
            navigation.navigate('FullScreenStack', {
              screen: 'PokemonDetails',
              params: { pokemonId }
            })
          }
        >
          <PokemonCard pokemon={pokemon} isLoading={isLoading} />
        </Pressable>
      </Animated.View>
    );
  };

  const renderHeader = () => (
    <ReAnimated.View style={animatedCardListHeaderStyle} />
  );

  const renderFooter = () =>
    areAllDisplayed && !searchValue ? (
      <PokemonListFooter reachedEnd={reachedEnd} />
    ) : (
      <EmptyListFooter />
    );

  const renderSeparator = () => <Separator height={LIST_SEPARATOR_HEIGHT} />;

  return (
    <CardListWrapper>
      <CardList
        ref={cardListRef}
        data={pokemonList}
        keyExtractor={(item: SinglePokemonState) => item.id}
        renderItem={renderItem}
        onEndReached={loadMorePokemon}
        onViewableItemsChanged={handleVisibleCardsChange}
        onEndReachedThreshold={1}
        scrollEventThrottle={16}
        maxToRenderPerBatch={8}
        initialNumToRender={8}
        updateCellsBatchingPeriod={100}
        windowSize={41}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={PokemonListEmptyComponent}
        ItemSeparatorComponent={renderSeparator}
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
