import React, { useCallback, useRef, useState } from 'react';
import { ListRenderItem, ViewToken, FlatList } from 'react-native';
import { PokemonListItem } from '@store/pokemon/pokemon.types';
import ScrollTopButton from '@components/shared/ScrollTopButton/ScrollTopButton';
import { CardListWrapper, CardList, ListSeparator } from './PokemonList.styles';
import PokemonCard from '../PokemonCard/PokemonCard';

type PokemonListProps = {
  pokemonList: PokemonListItem[];
  onFetchNextRequest: () => void;
};

const PokemonList: React.FC<PokemonListProps> = ({
  pokemonList,
  onFetchNextRequest
}) => {
  const cardListRef = useRef<FlatList | null>(null);
  const [scrollTopButtonVisible, setScrollTopButtonVisible] = useState(false);

  const renderItem: ListRenderItem<PokemonListItem> = ({ item: { id } }) => {
    return <PokemonCard pokemonId={id} />;
  };

  const handleVisibleCardsChange = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const firstCardIdx = viewableItems[0]?.index || 0;
      setScrollTopButtonVisible(firstCardIdx > 0);
    },
    []
  );

  const scrollToTop = () => {
    cardListRef.current?.scrollToOffset({
      offset: 0
    });
  };

  return (
    <CardListWrapper style={{ flex: 1 }}>
      <CardList
        ref={cardListRef}
        data={pokemonList}
        keyExtractor={(item: PokemonListItem) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={ListSeparator}
        onEndReached={() => onFetchNextRequest()}
        onEndReachedThreshold={0.5}
        onViewableItemsChanged={handleVisibleCardsChange}
      />
      <ScrollTopButton
        isVisible={scrollTopButtonVisible}
        onScrollTop={scrollToTop}
      />
    </CardListWrapper>
  );
};

export default PokemonList;
