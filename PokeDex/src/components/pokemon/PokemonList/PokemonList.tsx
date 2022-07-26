import React from 'react';
import { ListRenderItem } from 'react-native';
import { Pokemon, PokemonListItem } from '@store/pokemon/pokemon.types';
import { PokemonCardList, ListSeparator } from './PokemonList.styles';
import PokemonCard from '../PokemonCard/PokemonCard';

type PokemonListProps = {
  pokemonList: PokemonListItem[];
  onFetchNextRequest: () => void;
};

const PokemonList: React.FC<PokemonListProps> = ({
  pokemonList,
  onFetchNextRequest
}) => {
  const renderItem: ListRenderItem<PokemonListItem> = ({
    item: { id }
  }) => {
    return <PokemonCard pokemonId={id} />;
  };

  return (
    <PokemonCardList
      data={pokemonList}
      keyExtractor={(item: PokemonListItem) => item.id}
      renderItem={renderItem}
      ItemSeparatorComponent={ListSeparator}
      onEndReached={() => onFetchNextRequest()}
      onEndReachedThreshold={.5}
    />
  );
};

export default PokemonList;
