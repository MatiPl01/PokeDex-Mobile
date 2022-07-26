import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@store';
import { PokemonType } from '@store/pokemon/pokemon.types';
import { selectSinglePokemonState } from '@store/pokemon/pokemon.selector';
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
  pokemonId: string;
};

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemonId }) => {
  const { pokemon, isLoading } = useSelector((state: RootState) =>
    selectSinglePokemonState(state, pokemonId)
  );

  if (isLoading) return <PokemonCardSkeleton />;
  if (!pokemon) return null;
  const { id, name, types, imageUrl } = pokemon;

  return (
    <CardWrapper>
      <BackgroundWrapper>
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
                key={`${id}-${type}-gradient`}
                colors={[]}
              />
            ))}
          </BackgroundGradientsWrapper>
        </BackgroundClip>
        <PokemonSvg uri={imageUrl} />
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

export default PokemonCard;
