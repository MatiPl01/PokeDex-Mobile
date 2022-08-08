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
  PokemonImage,
  BackgroundClip,
  BackgroundTextWrapper,
  BackgroundText,
  CardTitle,
  PokemonId,
  TypeBadgesWrapper,
  TypeBadgeWrapper,
  CardTitleSkeletonWrapper,
  TypeBadgeSkeletonWrapper,
  PlaceholderImageIcon,
  PokemonIdSkeletonWrapper,
  AddToFavoritesButtonWrapper,
  FAVORITES_BUTTON_SIZE
} from './PokemonCard.styles';
import AddToFavoritesButton from '@components/shared/AddToFavoritesButton/AddToFavoritesButton';

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
  const [isImageLoading, setIsImageLoading] = useState(!!pokemon?.imageUrl);

  if (isLoading) return <PokemonCardSkeleton />;
  if (!pokemon) return null;
  const { id, name, types, imageUrl, imageExtension } = pokemon;

  const renderImage = () => {
    if (imageExtension === 'svg') {
      return isImageLoading ? (
        <>
          {/* The Svg component below is used to determine if the Svg image was fetched from the server and finished loading. Using this Svg component to display the image results in showing cropped image. Therefore, another library is used for displaying the actual image */}
          <Svg
            source={{ uri: pokemon.imageUrl }}
            onLoadEnd={() => setIsImageLoading(false)}
          />
          <SkeletonPlaceholder />
        </>
      ) : (
        <PokemonSvg uri={imageUrl} />
      );
    } else {
      return imageUrl ? (
        <>
          {isImageLoading && <SkeletonPlaceholder />}
          <PokemonImage
            source={{ uri: imageUrl }}
            onLoadEnd={() => setIsImageLoading(false)}
          />
        </>
      ) : (
        <PlaceholderImageIcon />
      );
    }
  };

  return (
    <CardWrapper>
      <BackgroundWrapper>
        <BackgroundClip>
          <BackgroundTextWrapper>
            <BackgroundText numberOfLines={1} ellipsizeMode="clip">
              {name}
            </BackgroundText>
          </BackgroundTextWrapper>
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
        {renderImage()}
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
