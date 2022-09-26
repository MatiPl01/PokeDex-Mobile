import React, { PropsWithChildren } from 'react';
import { SharedValue } from 'react-native-reanimated';
import { SIZE } from '@constants';
import { createAnimatedStyle } from '@utils/reanimated';
import {
  OuterWrapper,
  InnerWrapper,
  GALLERY_HEIGHT
} from './ScrollViewGallery.styles';

const useAnimatedGalleryStyle = createAnimatedStyle({
  transform: [
    {
      scale: {
        inputRange: [-SIZE.SCREEN.HEIGHT, 0],
        outputRange: [SIZE.SCREEN.HEIGHT / GALLERY_HEIGHT, 1]
      }
    },
    {
      translateY: {
        inputRange: [-SIZE.SCREEN.HEIGHT, 0, GALLERY_HEIGHT],
        outputRange: [-GALLERY_HEIGHT * 0.75, 0, GALLERY_HEIGHT / 2]
      }
    }
  ]
});

type ScrollViewGalleryProps = PropsWithChildren<{
  scrollY: SharedValue<number>;
}>;

const ScrollViewGallery: React.FC<ScrollViewGalleryProps> = ({
  scrollY,
  children
}) => {
  const animatedGalleryStyle = useAnimatedGalleryStyle(scrollY);

  return (
    <OuterWrapper style={animatedGalleryStyle}>
      <InnerWrapper>{children}</InnerWrapper>
    </OuterWrapper>
  );
};

export default ScrollViewGallery;
