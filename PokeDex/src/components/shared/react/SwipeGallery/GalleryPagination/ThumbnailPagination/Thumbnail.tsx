import React, { useEffect } from 'react';
import { useTheme } from 'styled-components';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import GalleryImage from '@components/shared/react/SwipeGallery/GalleryImage/GalleryImage';
import { createAnimatedThemedStyles } from '@utils/reanimated';
import { ThumbnailWrapper, ImageWrapper } from './Thumbnail.styles';

const useAnimatedActiveStyles = createAnimatedThemedStyles(theme => ({
  wrapper: {
    borderWidth: [0, theme.space.sm]
  },
  image: {
    transform: [
      {
        scale: [0.9, 0.75]
      }
    ]
  }
}));

type ThumbnailProps = {
  url: string;
  size: number;
  active?: boolean;
};

const Thumbnail: React.FC<ThumbnailProps> = ({
  url,
  size,
  active
}) => {
  const theme = useTheme();
  const activeAnimationProgress = useSharedValue(0);
  const activeAnimationStyles = useAnimatedActiveStyles(theme)(
    activeAnimationProgress
  );

  useEffect(() => {
    activeAnimationProgress.value = withTiming(+!!active, {
      duration: 150,
      easing: Easing.bezier(0.4, 0, 0.9, 0.65)
    });
  }, [active]);

  return (
    <ThumbnailWrapper size={size} style={activeAnimationStyles.wrapper}>
      <ImageWrapper style={activeAnimationStyles.image}>
        <GalleryImage
          url={url}
          dimensions={{ width: size, height: size }}
          loadingIndicatorType="skeleton"
        />
      </ImageWrapper>
    </ThumbnailWrapper>
  );
};

export default Thumbnail;
