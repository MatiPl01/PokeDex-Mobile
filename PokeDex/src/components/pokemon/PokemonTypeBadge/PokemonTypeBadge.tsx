import React from 'react';
import { useTheme } from 'styled-components';
import { PokemonType } from '@store/pokemon/pokemon.types';
import { BadgeWrapper, BadgeText } from './PokemonTypeBadge.styles';

type PokemonTypeBadgeProps = {
  type: PokemonType;
};

const PokemonTypeBadge: React.FC<PokemonTypeBadgeProps> = ({ type }) => {
  const theme = useTheme();

  return (
    <BadgeWrapper pokemonType={type} colors={[]}>
      <BadgeText pokemonType={type}>{type}</BadgeText>
    </BadgeWrapper>
  );
};

export default PokemonTypeBadge;
