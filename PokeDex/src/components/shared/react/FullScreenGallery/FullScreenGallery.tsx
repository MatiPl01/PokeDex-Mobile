import React, { ComponentType, useEffect, useMemo, useRef } from 'react';
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from '@types';
import { SIZE } from '@constants';
import { createAnimatedStyle, createAnimatedStyles } from '@utils/reanimated';
import {
  CloseButton,
  CloseIcon,
  ContentWrapper,
  ImageList,
  ImageWrapper,
  OuterWrapper
} from './FullScreenGallery.styles';
import GalleryImage from '../GalleryImage/GalleryImage';
import GalleryPagination, { PaginationSettings } from '../GalleryPagination';

const useAnimatedModalVisibilityStyles = createAnimatedStyles({
  wrapper: {
    opacity: [0, 1]
  },
  closeButton: {
    transform: [
      {
        scale: [0, 1]
      }
    ],
    opacity: [0, 1]
  }
});

const useAnimatedImagesVisibilityStyle = createAnimatedStyle({
  transform: [
    {
      scale: [0.5, 1]
    }
  ],
  opacity: [0, 1]
});

export type FullScreenGalleryProps = {
  images: Image[];
  visible: boolean;
  onClose: () => void;
  renderImage?: (data: { url: string; name?: string }) => JSX.Element;
  paginationSettings?: PaginationSettings;
};

const FullScreenGallery: React.FC<FullScreenGalleryProps> = ({
  images,
  visible,
  paginationSettings,
  onClose,
  renderImage
}) => {
  const edges = useSafeAreaInsets();
  const listRef = useRef<FlatList | null>(null);

  const imageDimensions = useMemo(
    () => ({
      width: SIZE.SCREEN.WIDTH,
      height: SIZE.SCREEN.HEIGHT
    }),
    []
  );

  const activeImageIndex = useSharedValue(0);
  const isPaginationVisible = useSharedValue(false);
  const visibilityAnimationProgress = useSharedValue(0);
  const imagesVisibilityAnimationProgress = useSharedValue(0);

  const animatedModalVisibilityStyles = useAnimatedModalVisibilityStyles(
    visibilityAnimationProgress
  );
  const animatedImagesVisibilityStyle = useAnimatedImagesVisibilityStyle(
    imagesVisibilityAnimationProgress
  );

  useEffect(() => {
    visibilityAnimationProgress.value = withTiming(+visible, {
      duration: 300
    });
    imagesVisibilityAnimationProgress.value = withDelay(
      200,
      withTiming(+visible, {
        duration: 300,
        easing: Easing.bezier(0.6, 0, 0.4, 1)
      })
    );
    isPaginationVisible.value = visible;
  }, [visible]);

  const scrollToIndex = (index: number) => {
    listRef.current?.scrollToIndex({ index });
    activeImageIndex.value = Math.min(Math.max(index, 0), images.length - 1);
  };

  const updateActiveImage = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    activeImageIndex.value = Math.min(
      Math.max(
        Math.floor(event.nativeEvent.contentOffset.x / SIZE.SCREEN.WIDTH),
        0
      ),
      images.length - 1
    );
  };

  const renderItem: ListRenderItem<Image> = ({ item: { name, url } }) => (
    <ImageWrapper>
      {renderImage ? (
        renderImage({ url, name })
      ) : (
        <GalleryImage url={url} dimensions={imageDimensions} />
      )}
    </ImageWrapper>
  );

  return (
    <Modal transparent visible={visible}>
      <OuterWrapper style={animatedModalVisibilityStyles.wrapper}>
        <ContentWrapper top={edges.top}>
          <CloseButton
            style={animatedModalVisibilityStyles.closeButton}
            onPress={onClose}
          >
            <CloseIcon />
          </CloseButton>

          <Animated.View style={animatedImagesVisibilityStyle}>
            <ImageList<ComponentType<FlatListProps<Image>>>
              ref={listRef}
              data={images}
              keyExtractor={({ url }) => url}
              renderItem={renderItem}
              initialNumToRender={1}
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={updateActiveImage}
              horizontal
              pagingEnabled
            />
          </Animated.View>

          {paginationSettings && (
            <GalleryPagination
              images={images}
              visible={isPaginationVisible}
              dimensions={imageDimensions}
              activeImageIndex={activeImageIndex}
              paginationSettings={paginationSettings}
              scrollToIndex={scrollToIndex}
            />
          )}
        </ContentWrapper>
      </OuterWrapper>
    </Modal>
  );
};

export default FullScreenGallery;
