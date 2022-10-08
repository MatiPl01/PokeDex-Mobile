import React, { PropsWithChildren } from 'react';
import { SharedValue } from 'react-native-reanimated';
import { SIZE } from '@constants';
import { createAnimatedParametrizedStyle } from '@utils/reanimated';
import {
  OuterWrapper,
  InnerWrapper,
  GALLERY_HEIGHT
} from './ScrollViewGallery.styles';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

const useAnimatedGalleryStyle = createAnimatedParametrizedStyle<EdgeInsets>(
  edges => ({
    transform: [
      {
        scale: {
          inputRange: [-SIZE.SCREEN.HEIGHT, 0],
          outputRange: [SIZE.SCREEN.HEIGHT / (GALLERY_HEIGHT - edges.top), 1]
        }
      }
    ],
    top: {
      inputRange: [-SIZE.SCREEN.HEIGHT, 0, GALLERY_HEIGHT],
      outputRange: [-(GALLERY_HEIGHT + 4 * edges.top), 0, GALLERY_HEIGHT / 2]
    }
  })
);

type ScrollViewGalleryProps = PropsWithChildren<{
  scrollY: SharedValue<number>;
}>;

const ScrollViewGallery: React.FC<ScrollViewGalleryProps> = ({
  scrollY,
  children
}) => {
  const edges = useSafeAreaInsets();
  const animatedGalleryStyle = useAnimatedGalleryStyle(edges)(scrollY);

  return (
    <OuterWrapper style={animatedGalleryStyle}>
      <InnerWrapper>{children}</InnerWrapper>
    </OuterWrapper>
  );
};

export default ScrollViewGallery;
