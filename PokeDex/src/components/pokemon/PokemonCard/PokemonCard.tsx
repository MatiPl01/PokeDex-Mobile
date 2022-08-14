import React, { useState } from 'react';
import { Pokemon, PokemonType } from '@store/pokemon/pokemon.types';
import SkeletonPlaceholder from '@components/shared/SkeletonPlaceholder/SkeletonPlaceholder';
import PokemonTypeBadge from '../PokemonTypeBadge/PokemonTypeBadge';
import {
  CardWrapper,
  BackgroundWrapper,
  BackgroundGradient,
  BackgroundGradientsWrapper,
  CardFooter,
  BackgroundClip,
  BackgroundTextWrapper,
  BackgroundText,
  CardTitle,
  PokemonId,
  TypeBadgesWrapper,
  TypeBadgeWrapper,
  CardTitleSkeletonWrapper,
  TypeBadgeSkeletonWrapper,
  PokemonIdSkeletonWrapper,
  AddToFavoritesButtonWrapper,
  FAVORITES_BUTTON_SIZE,
  MAX_IMAGE_WIDTH,
  MAX_IMAGE_HEIGHT
} from './PokemonCard.styles';
import AddToFavoritesButton from '@components/shared/AddToFavoritesButton/AddToFavoritesButton';
import { PokemonCardImage } from '../PokemonCardImage/PokemonCardImage';

const PokemonCardSkeleton: React.FC = () => (
  <CardWrapper>
    <BackgroundWrapper>
      <BackgroundClip>
        <SkeletonPlaceholder />
      </BackgroundClip>
    </BackgroundWrapper>
    <CardFooter>
      <CardTitleSkeletonWrapper>
        <SkeletonPlaceholder />
      </CardTitleSkeletonWrapper>
      <TypeBadgesWrapper>
        <TypeBadgeSkeletonWrapper>
          <SkeletonPlaceholder />
        </TypeBadgeSkeletonWrapper>
        <TypeBadgeSkeletonWrapper>
          <SkeletonPlaceholder />
        </TypeBadgeSkeletonWrapper>
      </TypeBadgesWrapper>
      <PokemonId>
        <PokemonIdSkeletonWrapper>
          <SkeletonPlaceholder />
        </PokemonIdSkeletonWrapper>
      </PokemonId>
      <AddToFavoritesButtonWrapper>
        <SkeletonPlaceholder />
      </AddToFavoritesButtonWrapper>
    </CardFooter>
  </CardWrapper>
);

type PokemonCardProps = {
  pokemon: Pokemon | null;
  isLoading?: boolean;
};

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, isLoading }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  if (isLoading) return <PokemonCardSkeleton />;
  if (!pokemon) return null;
  const { id, name, types, imageUrl, imageExtension } = pokemon;

  return (
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
          <BackgroundTextWrapper>
            <BackgroundText numberOfLines={1} ellipsizeMode="clip">
              {name}
            </BackgroundText>
          </BackgroundTextWrapper>
        </BackgroundClip>
        <PokemonCardImage
          width={MAX_IMAGE_WIDTH}
          height={MAX_IMAGE_HEIGHT}
          extension={imageExtension}
          imageUrl={imageUrl}
          onLoadEnd={() => setIsImageLoading(false)}
        />
      </BackgroundWrapper>
      <CardFooter>
        <CardTitle>{name}</CardTitle>
        <TypeBadgesWrapper>
          {types.map((type: PokemonType) => (
            <TypeBadgeWrapper key={`${id}-${type}-badge`}>
              <PokemonTypeBadge type={type} />
            </TypeBadgeWrapper>
          ))}
        </TypeBadgesWrapper>
        <PokemonId>#{id}</PokemonId>
        <AddToFavoritesButtonWrapper>
          <AddToFavoritesButton pokemonId={id} size={FAVORITES_BUTTON_SIZE} />
        </AddToFavoritesButtonWrapper>
      </CardFooter>
    </CardWrapper>
  );
};

export default React.memo(PokemonCard);
