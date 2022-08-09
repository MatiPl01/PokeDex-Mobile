import React from 'react';
import { View, Text } from 'react-native';
import { Pokemon } from '@store/pokemon/pokemon.types';

type FavoritePokemonCardProps = {
  pokemon: Pokemon | null;
  isLoading: boolean;
};

const FavoritePokemonCard: React.FC<FavoritePokemonCardProps> = ({
  pokemon,
  isLoading
}) => {
  return (
    <View>
      <Text>{pokemon?.name}</Text>
    </View>
  );
};

export default FavoritePokemonCard;
