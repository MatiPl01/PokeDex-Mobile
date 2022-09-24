import React from 'react';
import { View } from 'react-native';
import { Dimensions, Orientation } from '@types';
import { PokemonImage, PokemonType } from '@store/pokemon/pokemon.types';
import SwipeGallery, {
  GalleryPagination
} from '@components/shared/react/SwipeGallery/SwipeGallery';
import GalleryImage from '@components/shared/react/SwipeGallery/GalleryImage/GalleryImage';
import { ImageText, BackgroundGradient } from './PokemonImageGallery.styles';

type PokemonImageGalleryProps = {
  images: PokemonImage[];
  pokemonType: PokemonType;
  pagination?: GalleryPagination;
  scrollDirection?: Orientation;
  paginationHideTimeout?: number;
};

// TODO - add fullscreen gallery mode
const PokemonImageGallery: React.FC<PokemonImageGalleryProps> = props => {
  const { pokemonType, ...restProps } = props;

  const renderImage = ({
    url,
    dimensions,
    name
  }: {
    url: string;
    dimensions: Dimensions;
    name?: string;
  }) => (
    <>
      <ImageText>{name}</ImageText>
      <GalleryImage
        url={url}
        dimensions={{
          height: 0.75 * dimensions.height,
          width: 0.9 * dimensions.width
        }}
      />
    </>
  );

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient pokemonType={pokemonType} colors={[]} />
      <SwipeGallery renderImage={renderImage} {...restProps} />
    </View>
  );
};

export default PokemonImageGallery;
