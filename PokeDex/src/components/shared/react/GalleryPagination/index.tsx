import React from 'react';
import { SharedValue } from 'react-native-reanimated';
import { Dimensions, Image, Position } from '@types';
import { PaginationSize } from './shared';
import ThumbnailPagination from './ThumbnailPagination/ThumbnailPagination';

export type GalleryPaginationType = 'thumbnail';

export type PaginationSettings = {
  position: Position;
  type: GalleryPaginationType;
  timeout?: number;
  size?: PaginationSize;
};

type GalleryPaginationProps = {
  activeImageIndex: SharedValue<number>;
  paginationSettings: PaginationSettings;
  dimensions: Dimensions;
  visible: SharedValue<boolean>;
  images: Image[];
  scrollToIndex: (index: number) => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
};

const GalleryPagination: React.FC<GalleryPaginationProps> = ({
  paginationSettings,
  ...restProps
}) => {
  const { type: paginationType, ...restPaginationProps } = paginationSettings;

  const props = {
    ...restProps,
    ...restPaginationProps
  };

  switch (paginationType) {
    case 'thumbnail':
      return <ThumbnailPagination {...props} />;
  }
};

export default GalleryPagination;
