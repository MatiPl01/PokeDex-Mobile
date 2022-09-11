import React from 'react';
import { PokemonType } from '@store/pokemon/pokemon.types';
import {
  BadgeWrapper,
  BadgeText,
  TypeBadgeSize
} from './PokemonTypeBadge.styles';

type PokemonTypeBadgeProps = {
  type: PokemonType;
  size?: TypeBadgeSize;
};

const PokemonTypeBadge: React.FC<PokemonTypeBadgeProps> = ({
  type,
  size = 'small'
}) => (
  <BadgeWrapper pokemonType={type} colors={[]} size={size}>
    <BadgeText pokemonType={type} size={size}>{type}</BadgeText>
  </BadgeWrapper>
);

export default PokemonTypeBadge;
