import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions } from '@types';
import { PokemonType } from '@store/pokemon/pokemon.types';
import SwipeGallery, {
  SwipeGalleryProps
} from '@components/shared/react/SwipeGallery/SwipeGallery';
import GalleryImage from '@components/shared/react/SwipeGallery/GalleryImage/GalleryImage';
import {
  ImageText,
  BackgroundGradient,
  ImageWrapper,
  ImageTextWrapper
} from './PokemonImageGallery.styles';

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
  pokemonType: PokemonType;
};

const PokemonImageGallery: React.FC<PokemonImageGalleryProps> = props => {
  const { pokemonType, ...restProps } = props;
  const edges = useSafeAreaInsets();

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

  const renderBackground = () => (
    <BackgroundGradient pokemonType={pokemonType} colors={[]} />
  );

  return (
    <View style={{ flex: 1 }}>
      <SwipeGallery
        renderImage={renderImage}
        renderBackground={renderBackground}
        {...restProps}
      />
    </View>
  );
};

export default React.memo(PokemonImageGallery);
