import React from 'react';
import { PokemonItem as PokemonItemType } from '@store/pokemon/pokemon.types';
import SkeletonPlaceholder from '@components/shared/react/SkeletonPlaceholder/SkeletonPlaceholder';

type PokemonItemProps = {
  id: string;
  item: PokemonItemType | null;
  isLoading: boolean;
};

const PokemonItem: React.FC<PokemonItemProps> = ({ id, item, isLoading }) => {
  return <SkeletonPlaceholder />;
};

export default PokemonItem;
