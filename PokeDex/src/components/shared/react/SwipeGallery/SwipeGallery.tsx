import React, { ComponentType, useState } from 'react';
import { ListRenderItem, FlatListProps, LayoutChangeEvent } from 'react-native';
import { Dimensions } from '@types';
import GalleryImage from './GalleryImage/GalleryImage';
import { GalleryWrapper, ImageList, ImageWrapper } from './SwipeGallery.styles';

export type ImageData = {
  name?: string;
  url: string;
};

type SwipeGalleryProps = {
  images: ImageData[];
  renderImage?: (data: {
    url: string;
    dimensions: Dimensions;
    name?: string;
  }) => JSX.Element;
};

const SwipeGallery: React.FC<SwipeGalleryProps> = ({ images, renderImage }) => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    height: 0,
    width: 0
  });

  const measureGallery = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };

  const renderItem: ListRenderItem<ImageData> = ({ item: { name, url } }) => (
    <ImageWrapper width={dimensions.width} height={dimensions.height}>
      {renderImage ? (
        renderImage({ url, name, dimensions })
      ) : (
        <GalleryImage url={url} dimensions={dimensions} />
      )}
    </ImageWrapper>
  );

  return (
    <GalleryWrapper onLayout={measureGallery}>
      <ImageList<ComponentType<FlatListProps<ImageData>>>
        data={images}
        keyExtractor={({ url }) => url}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={1}
        horizontal
        pagingEnabled
      />
    </GalleryWrapper>
  );
};

export default SwipeGallery;
