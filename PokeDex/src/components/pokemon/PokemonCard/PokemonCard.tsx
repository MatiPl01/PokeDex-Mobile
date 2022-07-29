import React, { useState } from 'react';
import Svg from 'react-native-remote-svg';
import { Pokemon, PokemonType } from '@store/pokemon/pokemon.types';
import SkeletonPlaceholder from '@components/shared/SkeletonPlaceholder/SkeletonPlaceholder';
import PokemonTypeBadge from '../PokemonTypeBadge/PokemonTypeBadge';
import {
  CardWrapper,
  BackgroundWrapper,
  BackgroundGradient,
  BackgroundGradientsWrapper,
  CardFooter,
  PokemonSvg,
  BackgroundClip,
  BackgroundTextWrapper,
  BackgroundText,
  CardTitle,
  TypeBadgesWrapper,
  TypeBadgeWrapper,
  CardTitleSkeletonWrapper,
  TypeBadgeSkeletonWrapper
} from './PokemonCard.styles';

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
  const { id, name, types, imageUrl } = pokemon;

  return (
    <CardWrapper>
      <BackgroundWrapper>
        {isImageLoading ? (
          <>
            <SkeletonPlaceholder />
            {/* The Svg component below is used to determine if the Svg image was fetched from the server and finished loading. Using this Svg component to display the image results in showing cropped image. Therefore, another library is used for displaying the actual image */}
            <Svg
              source={{ uri: pokemon.imageUrl }}
              onLoadEnd={() => setIsImageLoading(false)}
            />
          </>
        ) : (
          <>
            <BackgroundClip>
              <BackgroundTextWrapper>
                <BackgroundText numberOfLines={1} ellipsizeMode="clip">
                  {name}
                </BackgroundText>
              </BackgroundTextWrapper>
              <BackgroundGradientsWrapper>
                {types.map((type: PokemonType) => (
                  <BackgroundGradient
                    pokemonType={type}
                    key={`${id}-${type}`}
                    colors={[]}
                  />
                ))}
              </BackgroundGradientsWrapper>
            </BackgroundClip>
            <PokemonSvg uri={imageUrl} />
          </>
        )}
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
      </CardFooter>
    </CardWrapper>
  );
};

export default React.memo(PokemonCard);
