import React from 'react';
import { PokemonType } from '@store/pokemon/pokemon.types';
import { BadgeWrapper, BadgeText } from './PokemonTypeBadge.styles';

type PokemonTypeBadgeProps = {
  type: PokemonType;
};

const PokemonTypeBadge: React.FC<PokemonTypeBadgeProps> = ({ type }) => (
  <BadgeWrapper pokemonType={type} colors={[]}>
    <BadgeText pokemonType={type}>{type}</BadgeText>
  </BadgeWrapper>
);

export default PokemonTypeBadge;
