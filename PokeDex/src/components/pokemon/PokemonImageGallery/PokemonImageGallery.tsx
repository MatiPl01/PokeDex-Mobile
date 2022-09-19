import React from 'react';
import { View } from 'react-native';
import { Dimensions } from '@types';
import { PokemonImage, PokemonType } from '@store/pokemon/pokemon.types';
import SwipeGallery from '@components/shared/react/SwipeGallery/SwipeGallery';
import GalleryImage from '@components/shared/react/SwipeGallery/GalleryImage/GalleryImage';
import { ImageText, BackgroundGradient } from './PokemonImageGallery.styles';

type PokemonImageGalleryProps = {
  images: PokemonImage[];
  pokemonType: PokemonType;
};

// TODO - add fullscreen gallery mode
const PokemonImageGallery: React.FC<PokemonImageGalleryProps> = ({
  images,
  pokemonType
}) => {
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
      <SwipeGallery images={images} renderImage={renderImage} />
    </View>
  );
};

export default PokemonImageGallery;
