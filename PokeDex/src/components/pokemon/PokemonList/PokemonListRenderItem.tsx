import React from 'react';
import { Animated, Pressable } from 'react-native';
import { Pokemon } from '@store/pokemon/pokemon.types';
import { RootStackParamList } from '@core/navigation/DrawerNavigation';
import { StackNavigationProp } from '@react-navigation/stack';
import PokemonCard from '../PokemonCard/PokemonCard';

type PokemonListRenderItemProps = {
  scale: Animated.AnimatedInterpolation;
  translateY: Animated.AnimatedInterpolation;
  opacity: Animated.AnimatedInterpolation;
  pokemonId: string;
  pokemon: Pokemon | null;
  isLoading: boolean;
  navigation: StackNavigationProp<RootStackParamList, 'PokemonDetails'>;
};

const PokemonListRenderItem: React.FC<PokemonListRenderItemProps> = ({
  scale,
  translateY,
  opacity,
  pokemonId,
  pokemon,
  isLoading,
  navigation
}) => (
  <Animated.View style={{ transform: [{ scale }, { translateY }], opacity }}>
    <Pressable
      key={pokemonId}
      onPress={() => navigation.push('PokemonDetails', { pokemonId })}
    >
      <PokemonCard pokemon={pokemon} isLoading={isLoading} />
    </Pressable>
  </Animated.View>
);

export default React.memo(PokemonListRenderItem);
