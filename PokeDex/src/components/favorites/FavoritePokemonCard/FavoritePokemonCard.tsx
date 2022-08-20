import React, { useEffect } from 'react';
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { createAnimatedStyle } from '@utils/reanimated';
import { Pokemon, PokemonType } from '@store/pokemon/pokemon.types';
import { TouchableWrapper } from '@components/shared/styled/buttons';
import SkeletonPlaceholder from '@components/shared/react/SkeletonPlaceholder/SkeletonPlaceholder';
import PokemonCardImage from '@components/pokemon/PokemonCardImage/PokemonCardImage';
import { RoundedBackgroundClip } from '@components/shared/styled/backgrounds';
import {
  BackgroundGradient,
  BackgroundGradientsWrapper
} from '@components/pokemon/PokemonCard/PokemonCard.styles';
import {
  BackgroundWrapper,
  CardFooter,
  CardWrapper,
  CardTitle,
  PokemonImageWrapper,
  CardTitleSkeletonWrapper,
  DeleteButtonWrapper,
  DeleteButtonIcon
} from './FavoritePokemonCard.styles';

const useAnimatedDeleteButtonStyle = createAnimatedStyle({
  // opacity: [0, 1]
  transform: [{ scale: [0, 1] }]
});

type FavoritePokemonCardSkeletonProps = {
  width: number;
};

const FavoritePokemonCardSkeleton: React.FC<
  FavoritePokemonCardSkeletonProps
> = ({ width }) => (
  <CardWrapper>
    <BackgroundWrapper>
      <RoundedBackgroundClip>
        <SkeletonPlaceholder />
      </RoundedBackgroundClip>
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
  deletable?: boolean;
  onDelete?: (id: string) => void;
};

const FavoritePokemonCard: React.FC<FavoritePokemonCardProps> = ({
  pokemon,
  isLoading,
  width,
  onDelete,
  deletable = false
}) => {
  if (isLoading) return <FavoritePokemonCardSkeleton width={width} />;
  if (!pokemon) return null;

  const { id, name, types, imageUrl, imageExtension } = pokemon;

  const deleteButtonAnimationProgress = useSharedValue(0);
  const animatedDeleteButtonStyle = useAnimatedDeleteButtonStyle(
    deleteButtonAnimationProgress
  );

  useEffect(() => {
    deleteButtonAnimationProgress.value = withTiming(+deletable, {
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.9, 0.65)
    });
    console.log({ id, deletable, deleteButtonAnimationProgress });
  }, [deletable]);

  return (
    <CardWrapper>
      <BackgroundWrapper>
        <RoundedBackgroundClip>
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
        </RoundedBackgroundClip>
      </BackgroundWrapper>
      <CardFooter>
        <CardTitle>{name}</CardTitle>
      </CardFooter>

      <DeleteButtonWrapper style={animatedDeleteButtonStyle}>
        <TouchableWrapper onPress={onDelete && (() => onDelete(id))}>
          <DeleteButtonIcon />
        </TouchableWrapper>
      </DeleteButtonWrapper>
    </CardWrapper>
  );
};

export default FavoritePokemonCard;
