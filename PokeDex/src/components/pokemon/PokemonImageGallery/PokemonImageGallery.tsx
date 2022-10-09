import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions } from '@types';
import { SIZE } from '@constants';
import { PokemonType } from '@store/pokemon/pokemon.types';
import { createAnimatedStyle } from '@utils/reanimated';
import SwipeGallery, {
  SwipeGalleryProps
} from '@components/shared/react/SwipeGallery/SwipeGallery';
import GalleryImage from '@components/shared/react/GalleryImage/GalleryImage';
import {
  ImageText,
  BackgroundGradient,
  ImageWrapper,
  ImageTextWrapper
} from './PokemonImageGallery.styles';

const useAnimatedGradientStyle = createAnimatedStyle({
  opacity: {
    inputRange: [-SIZE.SCREEN.HEIGHT / 3, 0],
    outputRange: [0, 1]
  }
});

type PokemonImageGalleryProps = Pick<
  SwipeGalleryProps,
  | 'images'
  | 'paginationSettings'
  | 'scrollDirection'
  | 'enableFullScreen'
  | 'fullScreenSettings'
  | 'scrollY'
  | 'overlayStyle'
> & {
  pokemonTypes: PokemonType[];
};

const PokemonImageGallery: React.FC<PokemonImageGalleryProps> = props => {
  const { pokemonTypes, scrollY, ...restProps } = props;
  const edges = useSafeAreaInsets();

  const animatedGradientStyle = scrollY && useAnimatedGradientStyle(scrollY);

  const renderImage = ({
    url,
    dimensions,
    name
  }: {
    url: string;
    dimensions: Dimensions;
    name?: string;
  }) => (
    <ImageWrapper>
      <ImageTextWrapper top={edges.top}>
        <ImageText>{name}</ImageText>
      </ImageTextWrapper>
      <GalleryImage
        url={url}
        dimensions={{
          height: 0.75 * (dimensions.height - edges.top),
          width: 0.9 * dimensions.width
        }}
      />
    </ImageWrapper>
  );

  const renderBackground = () =>
    pokemonTypes.length === 1 ? (
      <BackgroundGradient pokemonType={pokemonTypes[0]} colors={[]} />
    ) : (
      <>
        <BackgroundGradient
          pokemonType={pokemonTypes[0]}
          colors={[]}
          style={animatedGradientStyle}
        />
        <BackgroundGradient pokemonType={pokemonTypes[1]} colors={[]} />
      </>
    );

  return (
    <View style={{ flex: 1 }}>
      <SwipeGallery
        scrollY={scrollY}
        renderImage={renderImage}
        renderBackground={renderBackground}
        {...restProps}
      />
    </View>
  );
};

export default React.memo(PokemonImageGallery);
