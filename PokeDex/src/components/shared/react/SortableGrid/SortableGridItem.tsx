import React, { PropsWithChildren, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Vector2D } from '@types';
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
  interpolate
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
} from './SortableGridItem.styles';

const DROP_ANIMATION_DURATION = 500;
const MOVE_ANIMATION_DURATION = 250;

type DragContext = {
  startPosition: Vector2D;
  dropPosition: Vector2D;
};

type AnimatedPosition = {
  x: SharedValue<number>;
  y: SharedValue<number>;
};

type SortableGridItemProps = PropsWithChildren<{
  itemKey: string;
  itemsOrder: SharedValue<{ [key: string]: number }>;
  gridConfig: GridConfig;
  draggable: boolean;
  onOrderChange: (itemKey: string, newOrder: number) => void;
  onDragStart: (itemKey: string) => void;
  onDragEnd: (itemKey: string) => void;
}>;

const SortableGridItem: React.FC<SortableGridItemProps> = ({
  itemKey,
  itemsOrder,
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

  useEffect(() => {
    const position = getItemPosition(itemsOrder.value[itemKey], gridConfig);
    itemPosition.x.value = position.x;
    itemPosition.y.value = position.y;
    console.log(position, itemKey);
  }, [gridConfig]);

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
      const newPosition = getItemPosition(newOrder, gridConfig);
      translateWithTiming(itemPosition, newPosition, {
        duration: MOVE_ANIMATION_DURATION
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
      onDragStart(itemKey);
    },
    onActive: ({ translationX, translationY }, ctx) => {
      if (!isDragging.value) {
        isDragging.value = true;
        itemAnimationProgress.value = withTiming(1, {
          duration: MOVE_ANIMATION_DURATION
        });
      }
      const x = (itemPosition.x.value = ctx.startPosition.x + translationX);
      const y = (itemPosition.y.value = ctx.startPosition.y + translationY);
      const newDropPosition = getItemDropPosition({ x, y }, gridConfig);
      if (
        newDropPosition.x !== ctx.dropPosition.x ||
        newDropPosition.y !== ctx.dropPosition.y
      ) {
        ctx.dropPosition = newDropPosition;
        translateWithTiming(dropIndicatorPosition, newDropPosition, {
          duration: MOVE_ANIMATION_DURATION
        });
        onOrderChange(itemKey, getItemOrder(newDropPosition, gridConfig));
      }
    },
    onEnd: (_, ctx) => {
      itemAnimationProgress.value = withTiming(0, {
        duration: MOVE_ANIMATION_DURATION
      });
      translateWithTiming(itemPosition, ctx.dropPosition, {
        duration: DROP_ANIMATION_DURATION,
        callback: () => {
          isDragging.value = false;
          onDragEnd(itemKey);
        }
      });
    }
  });

  return (
    <>
      <ItemDropIndicator
        width={gridConfig.itemWidth}
        height={gridConfig.itemHeight}
        style={animatedDropIndicatorStyle}
      />
      <AnimatedItemWrapper
        width={gridConfig.itemWidth}
        height={gridConfig.itemHeight}
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
