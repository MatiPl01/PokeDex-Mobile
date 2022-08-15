import React from 'react';
import { Pokemon, PokemonType } from '@store/pokemon/pokemon.types';
import PokemonCardImage from '../PokemonCardImage/PokemonCardImage';
import {
  BackgroundClip,
  BackgroundGradient,
  BackgroundGradientsWrapper
} from '../PokemonCard/PokemonCard.styles';
import {
  BackgroundWrapper,
  CardFooter,
  CardWrapper,
  CardTitle,
  PokemonImageWrapper,
  CardTitleSkeletonWrapper
} from './FavoritePokemonCard.styles';
import SkeletonPlaceholder from '@components/shared/SkeletonPlaceholder/SkeletonPlaceholder';

type FavoritePokemonCardSkeletonProps = {
  width: number;
};

const FavoritePokemonCardSkeleton: React.FC<
  FavoritePokemonCardSkeletonProps
> = ({ width }) => (
  <CardWrapper>
    <BackgroundWrapper>
      <BackgroundClip>
        <SkeletonPlaceholder />
      </BackgroundClip>
    </BackgroundWrapper>
    <CardFooter>
      <CardTitleSkeletonWrapper width={0.5 * width}>
        <SkeletonPlaceholder />
      </CardTitleSkeletonWrapper>
    </CardFooter>
  </CardWrapper>
);

type FavoritePokemonCardProps = {
  pokemon: Pokemon | null;
  isLoading: boolean;
  width: number;
};

const FavoritePokemonCard: React.FC<FavoritePokemonCardProps> = ({
  pokemon,
  isLoading,
  width
}) => {
  if (isLoading) return <FavoritePokemonCardSkeleton width={width} />;
  if (!pokemon) return null;
  const { id, name, types, imageUrl, imageExtension } = pokemon;

  return (
    <CardWrapper>
      <BackgroundWrapper>
        <BackgroundClip>
          <BackgroundGradientsWrapper>
            {types.map((type: PokemonType) => (
              <BackgroundGradient
                pokemonType={type}
                key={`${id}-${type}`}
                colors={[]}
              />
            ))}
          </BackgroundGradientsWrapper>
          <PokemonImageWrapper>
            <PokemonCardImage
              width={0.75 * width}
              height={0.65 * width}
              extension={imageExtension}
              imageUrl={imageUrl}
            />
          </PokemonImageWrapper>
        </BackgroundClip>
      </BackgroundWrapper>
      <CardFooter>
        <CardTitle>{name}</CardTitle>
      </CardFooter>
    </CardWrapper>
  );
};

export default FavoritePokemonCard;
