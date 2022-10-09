import React from 'react';
import { SharedValue } from 'react-native-reanimated';
import {
  OuterWrapper,
  InnerWrapper
} from './ScrollViewGallery.styles';

type ScrollViewGalleryProps = {
  scrollY: SharedValue<number>;
  children: React.ReactElement<{ scrollY: SharedValue<number> }>;
};

const ScrollViewGallery: React.FC<ScrollViewGalleryProps> = ({
  scrollY,
  children
}) => (
  <OuterWrapper>
    <InnerWrapper>{React.cloneElement(children, { scrollY })}</InnerWrapper>
  </OuterWrapper>
);

export default ScrollViewGallery;
