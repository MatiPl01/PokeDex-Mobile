import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'styled-components/native';
import {
  ListRenderItem,
  ViewToken,
  FlatList,
  RefreshControl,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import {
  fetchNextPokemonListAsync,
  refetchPokemonList
} from '@store/pokemon/pokemon.actions';
import ScrollTopButton from '@components/shared/ScrollTopButton/ScrollTopButton';
import { CardListWrapper, CardList, ListSeparator } from './PokemonList.styles';
import PokemonCard from '../PokemonCard/PokemonCard';
import { selectPokemonList } from '@store/pokemon/pokemon.selector';
import { SinglePokemonState } from '@store/pokemon/pokemon.reducer';

const PokemonList: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const cardListRef = useRef<FlatList | null>(null);
  // Data
  const pokemonList = useSelector(selectPokemonList);
  // Component state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [scrollTopButtonVisible, setScrollTopButtonVisible] = useState(false);

  useEffect(() => {
    loadMorePokemon();
  }, []);

  useEffect(() => {
    if (isRefreshing && pokemonList.length) setIsRefreshing(false);
  }, [pokemonList]);

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
    dispatch(fetchNextPokemonListAsync());
  };

  const scrollToTop = () => {
    cardListRef.current?.scrollToOffset({
      offset: 0
    });
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
  };

  const renderItem: ListRenderItem<SinglePokemonState> = ({
    item: { pokemon, isLoading }
  }) => <PokemonCard pokemon={pokemon} isLoading={isLoading} />;

  return (
    <CardListWrapper>
      <CardList
        ref={cardListRef}
        data={pokemonList}
        keyExtractor={(item: SinglePokemonState) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={ListSeparator}
        onEndReached={loadMorePokemon}
        onEndReachedThreshold={0.5}
        scrollEventThrottle={16}
        onViewableItemsChanged={handleVisibleCardsChange}
        onScroll={handleScroll}
        maxToRenderPerBatch={8}
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
