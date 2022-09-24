import React, { ComponentType, useRef, useState } from 'react';
import {
  ListRenderItem,
  FlatListProps,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatList
} from 'react-native';
import { Dimensions, Image, Orientation, Position } from '@types';
import GalleryImage from './GalleryImage/GalleryImage';
import { GalleryWrapper, ImageList, ImageWrapper } from './SwipeGallery.styles';
import ThumbnailPagination from './GalleryPagination/ThumbnailPagination/ThumbnailPagination';
import { PaginationSize } from './GalleryPagination/shared';

type GalleryPaginationType = 'thumbnail';

export type GalleryPagination = {
  position: Position;
  type: GalleryPaginationType;
  size?: PaginationSize;
};

const renderPagination = (
  activeImageIndex: number,
  scrollToIndex: (index: number) => void,
  { type: paginationType, ...restPaginationProps }: GalleryPagination,
  dimensions: Dimensions,
  images: Image[]
): React.ReactNode => {
  const props = {
    activeImageIndex,
    scrollToIndex,
    dimensions,
    ...restPaginationProps
  };

  switch (paginationType) {
    case 'thumbnail':
      return <ThumbnailPagination images={images} {...props} />;
  }
};

type SwipeGalleryProps = {
  images: Image[];
  pagination?: GalleryPagination;
  scrollDirection?: Orientation;
  renderImage?: (data: {
    url: string;
    dimensions: Dimensions;
    name?: string;
  }) => JSX.Element;
};

const SwipeGallery: React.FC<SwipeGalleryProps> = ({
  images,
  renderImage,
  pagination,
  scrollDirection = 'horizontal'
}) => {
  const listRef = useRef<FlatList | null>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({
    height: 0,
    width: 0
  });
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const measureGallery = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };

  const updateActiveImage = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const { x, y } = event.nativeEvent.contentOffset;

    let activeIndex: number;
    if (scrollDirection === 'horizontal')
      activeIndex = Math.floor(x / dimensions.width);
    else activeIndex = Math.ceil(y / dimensions.height);

    setActiveImageIndex(Math.min(Math.max(activeIndex, 0), images.length - 1));
  };

  const scrollToIndex = (index: number) => {
    listRef.current?.scrollToIndex({ index });
    setActiveImageIndex(Math.min(Math.max(index, 0), images.length - 1));
  };

  const renderItem: ListRenderItem<Image> = ({ item: { name, url } }) => (
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
      <ImageList<ComponentType<FlatListProps<Image>>>
        ref={listRef}
        data={images}
        keyExtractor={({ url }) => url}
        renderItem={renderItem}
        onMomentumScrollEnd={updateActiveImage}
        initialNumToRender={1}
        showsHorizontalScrollIndicator={false}
        horizontal={scrollDirection === 'horizontal'}
        pagingEnabled
      />
      {pagination &&
        renderPagination(
          activeImageIndex,
          scrollToIndex,
          pagination,
          dimensions,
          images
        )}
    </GalleryWrapper>
  );
};

export default SwipeGallery;
