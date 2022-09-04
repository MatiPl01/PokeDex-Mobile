import React, { PropsWithChildren, RefObject } from 'react';
import { StyleSheet } from 'react-native';
import { Vector2D } from '@types';
import { ANIMATION } from '@constants';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  useAnimatedReaction,
  SharedValue,
  interpolate,
  scrollTo
} from 'react-native-reanimated';
import {
  GridConfig,
  getItemOrder,
  getItemPosition,
  getItemDropPosition
} from './sortableGrid.utils';
import {
  ItemDropIndicator,
  AnimatedItemWrapper
} from './SortableGridItemWrapper.styles';

const keepInRange = (value: number, range: [number, number]): number => {
  'worklet';
  return Math.max(range[0], Math.min(range[1], value));
};

type DragContext = {
  startPosition: Vector2D;
  dropPosition: Vector2D;
};

type AnimatedPosition = {
  x: SharedValue<number>;
  y: SharedValue<number>;
};

export type SortableGridItemProps = PropsWithChildren<{
  itemKey: string;
  itemsOrder: SharedValue<Record<string, number>>;
  scrollY: SharedValue<number>;
  maxScroll: SharedValue<number>;
  contentHeight: number;
  editablePaddingTop: number;
  scrollViewRef: RefObject<Animated.ScrollView>;
  gridConfig: SharedValue<GridConfig>;
  draggable: boolean;
  onOrderChange: (itemKey: string, newOrder: number) => void;
  onDragStart: (itemKey: string) => void;
  onDragEnd: (newOrder: Record<string, number>) => void;
}>;

const SortableGridItem: React.FC<SortableGridItemProps> = ({
  itemKey,
  itemsOrder,
  scrollY,
  maxScroll,
  contentHeight,
  editablePaddingTop,
  scrollViewRef,
  gridConfig,
  draggable,
  onOrderChange,
  onDragStart,
  onDragEnd,
  children
}) => {
  const isDragging = useSharedValue(false);
  const itemAnimationProgress = useSharedValue(0);
  const itemPosition: AnimatedPosition = {
    x: useSharedValue(0),
    y: useSharedValue(0)
  };
  const dropIndicatorPosition: AnimatedPosition = {
    x: useSharedValue(0),
    y: useSharedValue(0)
  };

  const animatedItemStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: itemPosition.x.value },
      { translateY: itemPosition.y.value },
      { scale: interpolate(itemAnimationProgress.value, [0, 1], [1, 1.1]) }
    ],
    zIndex: +isDragging.value
  }));

  const animatedDropIndicatorStyle = useAnimatedStyle(() => ({
    opacity: +isDragging.value,
    transform: [
      { translateX: dropIndicatorPosition.x.value },
      { translateY: dropIndicatorPosition.y.value }
    ]
  }));

  const translateWithTiming = (
    animatedPosition: AnimatedPosition,
    targetPosition: Vector2D,
    { duration, callback }: { duration?: number; callback?: () => void } = {}
  ) => {
    'worklet';
    const animationConfig = {
      duration: duration || 1000
    };
    animatedPosition.x.value = withTiming(targetPosition.x, animationConfig);
    animatedPosition.y.value = withTiming(
      targetPosition.y,
      animationConfig,
      callback
    );
  };

  useAnimatedReaction(
    () => itemsOrder.value[itemKey],
    newOrder => {
      const newPosition = getItemPosition(newOrder, gridConfig.value);
      translateWithTiming(itemPosition, newPosition, {
        duration: ANIMATION.DURATION.FAVORITES_MOVE
      });
    }
  );

  const handleItemDrag = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    DragContext
  >({
    onStart: (_, ctx) => {
      ctx.startPosition = ctx.dropPosition = {
        x: itemPosition.x.value,
        y: itemPosition.y.value
      };
      dropIndicatorPosition.x.value = itemPosition.x.value;
      dropIndicatorPosition.y.value = itemPosition.y.value;
      onDragStart(itemKey);
    },
    onActive: ({ translationX, translationY }, ctx) => {
      // Drag
      if (!isDragging.value) {
        isDragging.value = true;
        itemAnimationProgress.value = withTiming(1, {
          duration: ANIMATION.DURATION.FAVORITES_MOVE
        });
      }
      const x = (itemPosition.x.value = ctx.startPosition.x + translationX);
      const y = (itemPosition.y.value = ctx.startPosition.y + translationY);
      const newDropPosition = getItemDropPosition({ x, y }, gridConfig.value);
      if (
        newDropPosition.x !== ctx.dropPosition.x ||
        newDropPosition.y !== ctx.dropPosition.y
      ) {
        ctx.dropPosition = newDropPosition;
        translateWithTiming(dropIndicatorPosition, newDropPosition, {
          duration: ANIMATION.DURATION.FAVORITES_MOVE
        });
        onOrderChange(itemKey, getItemOrder(newDropPosition, gridConfig.value));
      }

      // Scroll
      scrollY.value = Math.max(0, Math.min(scrollY.value, maxScroll.value));
      const lowerBound = scrollY.value - editablePaddingTop;
      const upperBound =
        lowerBound + contentHeight - gridConfig.value.itemHeight;
      let diff = 0;

      if (y < lowerBound) diff = y - lowerBound;
      else if (y > upperBound) diff = y - upperBound;

      const translation =
        keepInRange(scrollY.value + diff, [0, maxScroll.value]) - scrollY.value;
      scrollY.value += translation;
      itemPosition.y.value += translation;
      ctx.startPosition.y += translation;
      scrollTo(scrollViewRef, 0, scrollY.value, false);
    },
    onEnd: (_, ctx) => {
      itemAnimationProgress.value = withTiming(0, {
        duration: ANIMATION.DURATION.FAVORITES_MOVE
      });
      translateWithTiming(itemPosition, ctx.dropPosition, {
        duration: ANIMATION.DURATION.FAVORITES_DROP,
        callback: () => {
          isDragging.value = false;
          onDragEnd(itemsOrder.value);
        }
      });
    }
  });

  return (
    <>
      <ItemDropIndicator
        width={gridConfig.value.itemWidth}
        height={gridConfig.value.itemHeight}
        style={animatedDropIndicatorStyle}
      />
      <AnimatedItemWrapper
        width={gridConfig.value.itemWidth}
        height={gridConfig.value.itemHeight}
        style={animatedItemStyle}
      >
        <PanGestureHandler onGestureEvent={handleItemDrag} enabled={draggable}>
          <Animated.View style={StyleSheet.absoluteFill}>
            {children}
          </Animated.View>
        </PanGestureHandler>
      </AnimatedItemWrapper>
    </>
  );
};

export default React.memo(SortableGridItem);
