import React from 'react';
import { DefaultTheme, useTheme } from 'styled-components';
import {
  Easing,
  runOnJS,
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { Position } from '@types';
import GalleryImage from '@components/shared/react/SwipeGallery/GalleryImage/GalleryImage';
import { createAnimatedParametrizedStyle } from '@utils/reanimated';
import { ThumbnailWrapper } from './Thumbnail.styles';

const useAnimatedAppearanceStyle = createAnimatedParametrizedStyle<{
  theme: DefaultTheme;
  thumbnailSize: number;
  position: Position;
}>(({ theme, thumbnailSize, position }) => {
  let translate;
  switch (position) {
    case 'top':
      translate = { translateY: [-(thumbnailSize + theme.space.lg * 2), 0] };
      break;
    case 'bottom':
      translate = { translateY: [thumbnailSize + theme.space.lg * 2, 0] };
      break;
    case 'left':
      translate = { translateX: [-(thumbnailSize + theme.space.lg * 2), 0] };
      break;
    case 'right':
      translate = { translateX: [thumbnailSize + theme.space.lg * 2, 0] };
  }

  return {
    opacity: [0, 1],
    transform: [{ scale: [0, 1] }, translate]
  };
});

const useAnimatedActiveStyle = createAnimatedParametrizedStyle<{
  theme: DefaultTheme;
  thumbnailSize: number;
}>(({ theme, thumbnailSize }) => ({
  borderWidth: [0, theme.space.sm],
  width: [thumbnailSize, 1.2 * thumbnailSize],
  height: [thumbnailSize, 1.2 * thumbnailSize]
}));

type ThumbnailProps = {
  url: string;
  size: number;
  index: number;
  position: Position;
  visible: SharedValue<boolean>;
  activeIndex: SharedValue<number>;
};

const Thumbnail: React.FC<ThumbnailProps> = ({
  url,
  size,
  index,
  activeIndex,
  position,
  visible
}) => {
  const theme = useTheme();
  const appearanceAnimationProgress = useSharedValue(0);
  const activeAnimationProgress = useSharedValue(0);

  const animatedAppearanceStyle = useAnimatedAppearanceStyle({
    theme,
    thumbnailSize: size,
    position
  })(appearanceAnimationProgress);
  const animatedActiveStyle = useAnimatedActiveStyle({
    theme,
    thumbnailSize: size
  })(activeAnimationProgress);

  const animateThumbnailAppearance = (isVisible: boolean) => {
    appearanceAnimationProgress.value = withDelay(
      Math.abs(activeIndex.value - index) * 100,
      withTiming(+isVisible, {
        duration: 500,
        easing: Easing.bezier(0.62, -0.41, 0.34, 1.5)
      })
    );
  };

  const animateThumbnailActivity = (isActive: boolean) => {
    activeAnimationProgress.value = withTiming(+isActive, {
      duration: 200,
      easing: Easing.bezier(0.4, 0, 0.9, 0.65)
    });
  };

  useDerivedValue(() => {
    runOnJS(animateThumbnailAppearance)(visible.value);
  }, [visible]);

  useDerivedValue(() => {
    runOnJS(animateThumbnailActivity)(index === activeIndex.value);
  }, [index, activeIndex]);

  return (
    <ThumbnailWrapper
      size={size}
      style={[animatedActiveStyle, animatedAppearanceStyle]}
    >
      <GalleryImage
        url={url}
        dimensions={{ width: 0.9 * size, height: 0.9 * size }}
        loadingIndicatorType="skeleton"
      />
    </ThumbnailWrapper>
  );
};

export default Thumbnail;
