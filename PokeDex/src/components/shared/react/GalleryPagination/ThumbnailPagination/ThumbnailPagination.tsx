import React, { ComponentType, useRef } from 'react';
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  Pressable
} from 'react-native';
import {
  runOnJS,
  SharedValue,
  useDerivedValue,
  useSharedValue
} from 'react-native-reanimated';
import { DefaultTheme, useTheme } from 'styled-components';
import { Dimensions, Image, Position } from '@types';
import { Separator } from '@components/shared/styled/layout';
import { PaginationSize, PaginationWrapper } from '../shared';
import Thumbnail from './Thumbnail';
import { ThumbnailsList } from './ThumbnailPagination.styles';

const getThumbnailSize = (theme: DefaultTheme, size?: PaginationSize) => {
  switch (size) {
    case 'small':
      return theme.size.md;
    case 'large':
      return theme.size.xl;
    case 'medium':
    default:
      return theme.size.lg;
  }
};

type ThumbnailPaginationProps = {
  activeImageIndex: SharedValue<number>;
  images: Image[];
  position: Position;
  dimensions: Dimensions;
  scrollToIndex: (index: number) => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
  visible?: SharedValue<boolean>;
  size?: PaginationSize;
};

const ThumbnailPagination: React.FC<ThumbnailPaginationProps> = ({
  activeImageIndex,
  images,
  position,
  dimensions,
  scrollToIndex,
  onSwipeStart,
  onSwipeEnd,
  visible = useSharedValue(true),
  size = 'medium'
}) => {
  const theme = useTheme();
  const LIST_PADDING = theme.space.lg;
  const LIST_GAP = theme.space.sm;

  const listRef = useRef<FlatList | null>(null);
  const isHorizontal = ['top', 'bottom'].includes(position);
  const thumbnailSize = getThumbnailSize(theme, size);
  const orientationProps = isHorizontal
    ? { horizontal: true, showsHorizontalScrollIndicator: false }
    : { showsVerticalScrollIndicator: false };

  const scrollToThumbnail = (index: number) => {
    const offset =
      LIST_PADDING +
      index * (thumbnailSize + LIST_GAP) +
      thumbnailSize / 2 -
      (isHorizontal ? dimensions.width / 2 : dimensions.height / 2);
    listRef.current?.scrollToOffset({ offset });
  };

  useDerivedValue(() => {
    runOnJS(scrollToThumbnail)(activeImageIndex.value);
  }, [activeImageIndex, dimensions]);

  const renderItem: ListRenderItem<Image> = ({ item: { url }, index }) => (
    <Pressable onPress={() => scrollToIndex(index)}>
      <Thumbnail
        url={url}
        size={thumbnailSize}
        index={index}
        activeIndex={activeImageIndex}
        position={position}
        visible={visible}
      />
    </Pressable>
  );

  const renderSeparator = () => (
    <Separator width={LIST_GAP} height={LIST_GAP} />
  );

  return (
    <PaginationWrapper position={position}>
      <ThumbnailsList<ComponentType<FlatListProps<Image>>>
        ref={listRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={({ url }) => url}
        onMomentumScrollBegin={onSwipeStart}
        onMomentumScrollEnd={onSwipeEnd}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={
          <Separator width={LIST_PADDING} height={LIST_PADDING} />
        }
        ListFooterComponent={
          <Separator width={LIST_PADDING} height={LIST_PADDING} />
        }
        contentContainerStyle={{
          alignItems: ['top', 'left'].includes(position)
            ? 'flex-start'
            : 'flex-end'
        }}
        {...orientationProps}
      />
    </PaginationWrapper>
  );
};

export default ThumbnailPagination;
