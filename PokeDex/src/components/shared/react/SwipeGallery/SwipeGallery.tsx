import React, { ComponentType, useEffect, useRef, useState } from 'react';
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
  onSwipeStart: () => void,
  onSwipeEnd: () => void,
  { type: paginationType, ...restPaginationProps }: GalleryPagination,
  dimensions: Dimensions,
  visible: boolean,
  images: Image[]
): React.ReactNode => {
  const props = {
    activeImageIndex,
    scrollToIndex,
    onSwipeStart,
    onSwipeEnd,
    dimensions,
    visible,
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
  paginationHideTimeout?: number;
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
  paginationHideTimeout,
  scrollDirection = 'horizontal'
}) => {
  const listRef = useRef<FlatList | null>(null);
  const paginationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const [isSwiping, setIsSwiping] = useState(false);
  const [isPaginationVisible, setIsPaginationVisible] = useState(false);
  const [dimensions, setDimensions] = useState<Dimensions>({
    height: 0,
    width: 0
  });
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (isSwiping) setIsPaginationVisible(true);
    if (!paginationHideTimeout) return;
    if (paginationTimeoutRef.current)
      clearTimeout(paginationTimeoutRef.current);
    paginationTimeoutRef.current = setTimeout(() => {
      setIsPaginationVisible(false);
    }, paginationHideTimeout);
  }, [isSwiping]);

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
    setIsSwiping(true);
    setActiveImageIndex(Math.min(Math.max(index, 0), images.length - 1));
  };

  const handleScrollStart = () => {
    setIsSwiping(true);
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIsSwiping(false);
    updateActiveImage(event);
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
        onMomentumScrollBegin={handleScrollStart}
        onMomentumScrollEnd={handleScrollEnd}
        initialNumToRender={1}
        showsHorizontalScrollIndicator={false}
        horizontal={scrollDirection === 'horizontal'}
        pagingEnabled
      />
      {pagination &&
        renderPagination(
          activeImageIndex,
          scrollToIndex,
          () => setIsSwiping(true),
          () => setIsSwiping(false),
          pagination,
          dimensions,
          isPaginationVisible,
          images
        )}
    </GalleryWrapper>
  );
};

export default SwipeGallery;
