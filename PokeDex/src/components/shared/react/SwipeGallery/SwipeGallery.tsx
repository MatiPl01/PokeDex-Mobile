import React, { ComponentType, useRef, useState } from 'react';
import {
  ListRenderItem,
  FlatListProps,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatList,
  StyleProp,
  ViewStyle
} from 'react-native';
import Animated, {
  runOnJS,
  SharedValue,
  useDerivedValue,
  useSharedValue
} from 'react-native-reanimated';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SIZE } from '@constants';
import { Corner, Dimensions, Image, Orientation, Position } from '@types';
import { createAnimatedParametrizedStyles } from '@utils/reanimated';
import GalleryImage from '../GalleryImage/GalleryImage';
import FullScreenGallery from '../FullScreenGallery/FullScreenGallery';
import {
  FullsScreenButton,
  GalleryWrapper,
  ImageWrapper,
  ImageList,
  GalleryOverlayWrapper,
  GalleryOverlay,
  FullScreenIcon
} from './SwipeGallery.styles';
import GalleryPagination, { PaginationSettings } from '../GalleryPagination';

export type RenderImageFunction = (data: {
  url: string;
  dimensions: Dimensions;
  name?: string;
}) => JSX.Element;

export type FullScreenSettings = {
  buttonCorner?: Corner;
  pagination?: PaginationSettings;
  renderImage?: RenderImageFunction;
};

const renderFullScreenButton = (
  images: Image[],
  activeImageIndex: SharedValue<number>,
  renderImage?: RenderImageFunction,
  fullScreenButtonCorner?: Corner,
  paginationSettings?: PaginationSettings,
  paginationPosition?: Position,
  onFullScreenClose?: () => void
) => {
  const [isFullScreenMode, setIsFullScreenMode] = useState(false);

  let corner: Corner;
  if (fullScreenButtonCorner) corner = fullScreenButtonCorner;
  else {
    switch (paginationPosition) {
      case 'bottom':
        corner = 'top-right';
        break;
      case 'right':
        corner = 'bottom-left';
        break;
      case 'top':
      case 'left':
      default:
        corner = 'bottom-right';
    }
  }

  return (
    <>
      <FullsScreenButton
        corner={corner}
        onPress={() => setIsFullScreenMode(true)}
      >
        <FullScreenIcon />
      </FullsScreenButton>
      <FullScreenGallery
        images={images}
        visible={isFullScreenMode}
        activeImageIndex={activeImageIndex}
        paginationSettings={paginationSettings}
        renderImage={renderImage}
        onClose={() => {
          setIsFullScreenMode(false);
          onFullScreenClose?.();
        }}
      />
    </>
  );
};

const useAnimatedPullStyles = createAnimatedParametrizedStyles<{
  edges: EdgeInsets;
  galleryHeight: number;
}>(({ edges, galleryHeight }) => ({
  wrapper: {
    top: {
      inputRange: [-SIZE.SCREEN.HEIGHT, 0, galleryHeight],
      outputRange: [-SIZE.SCREEN.HEIGHT, 0, galleryHeight / 2]
    },
    height: {
      inputRange: [-SIZE.SCREEN.HEIGHT, 0],
      outputRange: [SIZE.SCREEN.HEIGHT + galleryHeight, galleryHeight]
    }
  },
  images: {
    top: {
      inputRange: [-SIZE.SCREEN.HEIGHT, 0],
      outputRange: [SIZE.SCREEN.HEIGHT / 2, 0]
    },
    transform: [
      {
        scale: {
          inputRange: [-SIZE.SCREEN.HEIGHT, 0],
          outputRange: [SIZE.SCREEN.HEIGHT / (galleryHeight - edges.top), 1, 1]
        }
      }
    ]
  }
}));

export type SwipeGalleryProps = {
  images: Image[];
  scrollDirection?: Orientation;
  paginationSettings?: PaginationSettings;
  enableFullScreen?: boolean;
  fullScreenSettings?: FullScreenSettings;
  overlayStyle?: StyleProp<ViewStyle>;
  scrollY?: SharedValue<number>;
  renderImage?: RenderImageFunction;
  renderBackground?: () => JSX.Element;
};

const SwipeGallery: React.FC<SwipeGalleryProps> = ({
  images,
  renderImage,
  renderBackground,
  paginationSettings,
  enableFullScreen,
  fullScreenSettings,
  overlayStyle,
  scrollY = useSharedValue(0),
  scrollDirection = 'horizontal'
}) => {
  const edges = useSafeAreaInsets();
  const listRef = useRef<FlatList | null>(null);
  const paginationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const [dimensions, setDimensions] = useState<Dimensions>({
    height: 0,
    width: 0
  });
  const isSwiping = useSharedValue(false);
  const activeImageIndex = useSharedValue(0);
  const isPaginationVisible = useSharedValue(false);

  const animatedPullStyles = useAnimatedPullStyles({
    edges,
    galleryHeight: dimensions.height
  })(scrollY);

  const handleIsSwiping = (swiping: boolean) => {
    if (swiping) isPaginationVisible.value = true;
    if (!paginationSettings?.timeout) return;
    if (paginationTimeoutRef.current)
      clearTimeout(paginationTimeoutRef.current);
    if (!swiping)
      paginationTimeoutRef.current = setTimeout(() => {
        isPaginationVisible.value = false;
      }, paginationSettings.timeout);
  };

  useDerivedValue(() => {
    runOnJS(handleIsSwiping)(isSwiping.value);
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

    activeImageIndex.value = Math.min(
      Math.max(activeIndex, 0),
      images.length - 1
    );
  };

  const scrollToIndex = (index: number) => {
    listRef.current?.scrollToIndex({ index });
    isSwiping.value = true;
    activeImageIndex.value = Math.min(Math.max(index, 0), images.length - 1);
  };

  const handleScrollStart = () => {
    isSwiping.value = true;
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    isSwiping.value = false;
    updateActiveImage(event);
  };

  const handleFullScreenClose = () => {
    scrollToIndex(activeImageIndex.value);
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
      <Animated.View style={[animatedPullStyles.wrapper]}>
        {renderBackground?.()}
        <Animated.View style={animatedPullStyles.images}>
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
        </Animated.View>

        <GalleryOverlayWrapper style={overlayStyle}>
          <GalleryOverlay>
            {paginationSettings && (
              <GalleryPagination
                activeImageIndex={activeImageIndex}
                scrollToIndex={scrollToIndex}
                onSwipeStart={() => (isSwiping.value = true)}
                onSwipeEnd={() => (isSwiping.value = false)}
                paginationSettings={paginationSettings}
                dimensions={dimensions}
                visible={isPaginationVisible}
                images={images}
              />
            )}

            {enableFullScreen &&
              renderFullScreenButton(
                images,
                activeImageIndex,
                fullScreenSettings?.renderImage,
                fullScreenSettings?.buttonCorner,
                fullScreenSettings?.pagination || paginationSettings,
                paginationSettings?.position,
                handleFullScreenClose
              )}
          </GalleryOverlay>
        </GalleryOverlayWrapper>
      </Animated.View>
    </GalleryWrapper>
  );
};

export default React.memo(SwipeGallery);
