import React, { useState } from 'react';
import { Pokemon, PokemonType } from '@store/pokemon/pokemon.types';
import { PokemonCardImage } from '../PokemonCardImage/PokemonCardImage';
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
  PokemonImageWrapper
} from './FavoritePokemonCard.styles';

const FavoritePokemonCardSkeleton: React.FC = () => null;

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
  const [isImageLoading, setIsImageLoading] = useState(true);

  if (isLoading) return <FavoritePokemonCardSkeleton />;
  if (!pokemon) return null;
  const { id, name, types, imageUrl, imageExtension } = pokemon;

  return (
    <>
      {isLoading ? (
        <FavoritePokemonCardSkeleton />
      ) : (
        <CardWrapper>
          <BackgroundWrapper>
            <BackgroundClip>
              {!isImageLoading && (
                <BackgroundGradientsWrapper>
                  {types.map((type: PokemonType) => (
                    <BackgroundGradient
                      pokemonType={type}
                      key={`${id}-${type}`}
                      colors={[]}
                    />
                  ))}
                </BackgroundGradientsWrapper>
              )}
            </BackgroundClip>
            <PokemonImageWrapper>
              <PokemonCardImage
                width={0.75 * width}
                height={0.65 * width}
                extension={imageExtension}
                imageUrl={imageUrl}
                onLoadEnd={() => setIsImageLoading(false)}
              />
            </PokemonImageWrapper>
          </BackgroundWrapper>
          <CardFooter>
            <CardTitle>{name}</CardTitle>
          </CardFooter>
        </CardWrapper>
      )}
    </>
  );
};

export default FavoritePokemonCard;
