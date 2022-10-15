import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions } from '@types';
import { SIZE } from '@constants';
import { PokemonType } from '@store/pokemon/pokemon.types';
import { createAnimatedStyles } from '@utils/reanimated';
import SwipeGallery, {
  SwipeGalleryProps
} from '@components/shared/react/SwipeGallery/SwipeGallery';
import GalleryImage from '@components/shared/react/GalleryImage/GalleryImage';
import {
  ImageText,
  BackgroundGradient,
  ImageWrapper,
  ImageTextWrapper,
  AnimatedGradientWrapper
} from './PokemonImageGallery.styles';

const useAnimatedGradientStyles = createAnimatedStyles({
  primary: {
    opacity: {
      inputRange: [-SIZE.SCREEN.HEIGHT / 4, 0],
      outputRange: [0, 1]
    }
  },
  secondary: {
    opacity: {
      inputRange: [-SIZE.SCREEN.HEIGHT / 4, 0],
      outputRange: [1, 0]
    }
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
  const { pokemonTypes, scrollY, fullScreenSettings, ...restProps } = props;
  const theme = useTheme();
  const edges = useSafeAreaInsets();

  const animatedGradientStyles = scrollY && useAnimatedGradientStyles(scrollY);

  const renderImage = useCallback(
    ({
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
    ),
    []
  );

  const renderFullScreenImage = useCallback(
    ({
      url,
      dimensions,
      name
    }: {
      url: string;
      dimensions: Dimensions;
      name?: string;
    }) => (
      <ImageWrapper>
        <ImageTextWrapper top={theme.space.sm}>
          <ImageText size="large">{name}</ImageText>
        </ImageTextWrapper>
        <GalleryImage url={url} dimensions={dimensions} />
      </ImageWrapper>
    ),
    []
  );

  const renderBackground = useCallback(
    () =>
      pokemonTypes.length === 1 ? (
        <BackgroundGradient pokemonType={pokemonTypes[0]} colors={[]} />
      ) : (
        <>
          <AnimatedGradientWrapper style={animatedGradientStyles?.primary}>
            <BackgroundGradient pokemonType={pokemonTypes[0]} colors={[]} />
          </AnimatedGradientWrapper>
          <AnimatedGradientWrapper style={animatedGradientStyles?.secondary}>
            <BackgroundGradient pokemonType={pokemonTypes[1]} colors={[]} />
          </AnimatedGradientWrapper>
        </>
      ),
    [pokemonTypes]
  );

  return (
    <View style={{ flex: 1 }}>
      <SwipeGallery
        scrollY={scrollY}
        renderImage={renderImage}
        renderBackground={renderBackground}
        fullScreenSettings={{
          renderImage: renderFullScreenImage,
          ...fullScreenSettings
        }}
        {...restProps}
      />
    </View>
  );
};

export default React.memo(PokemonImageGallery);
