import React from 'react';
import {
  useSharedValue,
  withTiming,
  Easing,
  SharedValue,
  useDerivedValue
} from 'react-native-reanimated';
import { createAnimatedStyle } from '@utils/reanimated';
import { Pokemon, PokemonType } from '@store/pokemon/pokemon.types';
import { TouchableWrapper } from '@components/shared/styled/buttons';
import SkeletonPlaceholder from '@components/shared/react/SkeletonPlaceholder/SkeletonPlaceholder';
import PokemonCardImage from '@components/pokemon/PokemonCardImage/PokemonCardImage';
import { RoundedBackgroundClip } from '@components/shared/styled/backgrounds';
import {
  BackgroundGradient,
  BarBackgroundWrapper
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
  deletable?: SharedValue<boolean>;
  onDelete?: (id: string) => void;
};

const FavoritePokemonCard: React.FC<FavoritePokemonCardProps> = ({
  pokemon,
  isLoading,
  width,
  onDelete,
  deletable
}) => {
  if (isLoading) return <FavoritePokemonCardSkeleton width={width} />;
  if (!pokemon) return null;

  const { id, name, types, images } = pokemon;

  const deleteButtonAnimationProgress = useSharedValue(0);
  const animatedDeleteButtonStyle = useAnimatedDeleteButtonStyle(
    deleteButtonAnimationProgress
  );

  useDerivedValue(() => {
    deleteButtonAnimationProgress.value = withTiming(+(deletable?.value || 0), {
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.9, 0.65)
    });
  }, [deletable]);

  const handleDelete = () => {
    if (deletable?.value && onDelete) onDelete(id);
  };

  return (
    <CardWrapper>
      <BackgroundWrapper>
        <RoundedBackgroundClip>
          <BarBackgroundWrapper>
            {types.map((type: PokemonType) => (
              <BackgroundGradient
                pokemonType={type}
                key={`${id}-${type}`}
                colors={[]}
              />
            ))}
          </BarBackgroundWrapper>
        </RoundedBackgroundClip>
        <PokemonImageWrapper>
          {!isLoading && (
            <PokemonCardImage
              width={0.75 * width}
              height={0.65 * width}
              imageUrl={images[0]?.url || null}
            />
          )}
        </PokemonImageWrapper>
      </BackgroundWrapper>
      <CardFooter>
        <CardTitle>{name}</CardTitle>
      </CardFooter>

      <DeleteButtonWrapper style={animatedDeleteButtonStyle}>
        <TouchableWrapper onPress={handleDelete}>
          <DeleteButtonIcon />
        </TouchableWrapper>
      </DeleteButtonWrapper>
    </CardWrapper>
  );
};

export default FavoritePokemonCard;
