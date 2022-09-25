import React, { useEffect } from 'react';
import { useTheme } from 'styled-components';
import {
  Easing,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import GalleryImage from '@components/shared/react/SwipeGallery/GalleryImage/GalleryImage';
import { createAnimatedThemedStyle } from '@utils/reanimated';
import { ThumbnailWrapper } from './Thumbnail.styles';
import { Position } from '@types';

const useAnimatedAppearanceStyle = createAnimatedThemedStyle<{
  thumbnailSize: number;
  position: Position;
}>((theme, { thumbnailSize, position }) => {
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

const useAnimatedActiveStyle = createAnimatedThemedStyle<{
  thumbnailSize: number;
}>((theme, { thumbnailSize }) => ({
  borderWidth: [0, theme.space.sm],
  width: [thumbnailSize, 1.2 * thumbnailSize],
  height: [thumbnailSize, 1.2 * thumbnailSize]
}));

type ThumbnailProps = {
  url: string;
  size: number;
  index: number;
  activeIndex: number;
  position: Position;
  visible?: boolean;
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

  const animatedAppearanceStyle = useAnimatedAppearanceStyle(theme, {
    thumbnailSize: size,
    position
  })(appearanceAnimationProgress);
  const animatedActiveStyle = useAnimatedActiveStyle(theme, {
    thumbnailSize: size
  })(activeAnimationProgress);

  useEffect(() => {
    appearanceAnimationProgress.value = withDelay(
      Math.abs(activeIndex - index) * 100,
      withTiming(+!!visible, {
        duration: 500,
        easing: Easing.bezier(0.62, -0.41, 0.34, 1.5)
      })
    );
  }, [visible]);

  useEffect(() => {
    activeAnimationProgress.value = withTiming(+(index === activeIndex), {
      duration: 200,
      easing: Easing.bezier(0.4, 0, 0.9, 0.65)
    });
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
