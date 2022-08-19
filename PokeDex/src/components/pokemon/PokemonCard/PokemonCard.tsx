import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { Pokemon, PokemonType } from '@store/pokemon/pokemon.types';
import SkeletonPlaceholder from '@components/shared/react/SkeletonPlaceholder/SkeletonPlaceholder';
import AddToFavoritesButton from '@components/shared/react/AddToFavoritesButton/AddToFavoritesButton';
import { RoundedBackgroundClip } from '@components/shared/styled/backgrounds';
import { CardTitle } from '@components/shared/styled/cards';
import PokemonTypeBadge from '../PokemonTypeBadge/PokemonTypeBadge';
import PokemonCardImage from '../PokemonCardImage/PokemonCardImage';
import {
  CardWrapper,
  BackgroundWrapper,
  BackgroundGradient,
  BackgroundGradientsWrapper,
  CardFooter,
  BackgroundTextWrapper,
  BackgroundText,
  PokemonId,
  TypeBadgesWrapper,
  TypeBadgeWrapper,
  CardTitleSkeletonWrapper,
  TypeBadgeSkeletonWrapper,
  PokemonIdSkeletonWrapper,
  AddToFavoritesButtonWrapper,
  MAX_IMAGE_WIDTH,
  MAX_IMAGE_HEIGHT
} from './PokemonCard.styles';

const PokemonCardSkeleton: React.FC = () => (
  <CardWrapper>
    <BackgroundWrapper>
      <RoundedBackgroundClip>
        <SkeletonPlaceholder />
      </RoundedBackgroundClip>
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
  const theme = useTheme();
  const [isImageLoading, setIsImageLoading] = useState(true);

  if (isLoading) return <PokemonCardSkeleton />;
  if (!pokemon) return null;
  const { id, name, types, imageUrl, imageExtension } = pokemon;

  return (
    <CardWrapper>
      <BackgroundWrapper>
        <RoundedBackgroundClip>
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
        </RoundedBackgroundClip>
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
          <AddToFavoritesButton pokemonId={id} size={theme.size.xs} />
        </AddToFavoritesButtonWrapper>
      </CardFooter>
    </CardWrapper>
  );
};

export default React.memo(PokemonCard);
