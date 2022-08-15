import React, { PropsWithChildren } from 'react';
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
  getItemDropOrder,
  getDistanceBetweenItems
} from './sortableGrid.utils';
import {
  GridItemWrapper,
  ItemDropIndicator,
  AnimatedItemWrapper
} from './SortableGridItem.styles';

const DROP_ANIMATION_DURATION = 500;
const MOVE_ANIMATION_DURATION = 250;

type DragContext = {
  startTranslation: Vector2D;
  dropTranslation: Vector2D;
  startOrder: number;
  currOrder: number;
  dropOrder: number;
};

type AnimatedTranslation = {
  x: SharedValue<number>;
  y: SharedValue<number>;
};

type SortableGridItemProps = PropsWithChildren<{
  itemKey: string;
  itemsOrder: SharedValue<{ [key: string]: number }>;
  size: number;
  gap: number;
  gridConfig: GridConfig;
  draggable: boolean;
  onOrderChange: (itemKey: string, newOrder: number) => void;
  onDragStart: (itemKey: string) => void;
  onDragEnd: (itemKey: string) => void;
}>;

const SortableGridItem: React.FC<SortableGridItemProps> = ({
  itemKey,
  itemsOrder,
  size,
  gap,
  gridConfig,
  draggable,
  onOrderChange,
  onDragStart,
  onDragEnd,
  children
}) => {
  if (itemsOrder.value[itemKey] === undefined) return null;
  const renderOrder = useSharedValue(itemsOrder.value[itemKey]);
  const isDragging = useSharedValue(false);
  const itemAnimationProgress = useSharedValue(0);
  const itemTranslation: AnimatedTranslation = {
    x: useSharedValue(0),
    y: useSharedValue(0)
  };
  const dropIndicatorTranslation: AnimatedTranslation = {
    x: useSharedValue(0),
    y: useSharedValue(0)
  };

  const animatedItemStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: itemTranslation.x.value },
      { translateY: itemTranslation.y.value },
      { scale: interpolate(itemAnimationProgress.value, [0, 1], [1, 1.1]) }
    ],
    opacity: interpolate(itemAnimationProgress.value, [0, 1], [1, 0.5])
  }));
  const animatedDropAreaStyle = useAnimatedStyle(() => ({
    opacity: +isDragging.value,
    transform: [
      { translateX: dropIndicatorTranslation.x.value },
      { translateY: dropIndicatorTranslation.y.value }
    ]
  }));

  const translateWithTiming = (
    translationValue: AnimatedTranslation,
    targetTranslation: Vector2D,
    { duration, callback }: { duration?: number; callback?: () => void } = {}
  ) => {
    'worklet';
    const animationConfig = {
      duration: duration || 1000
    };
    translationValue.x.value = withTiming(targetTranslation.x, animationConfig);
    translationValue.y.value = withTiming(
      targetTranslation.y,
      animationConfig,
      callback
    );
  };

  useAnimatedReaction(
    () => itemsOrder.value[itemKey],
    newOrder => {
      const translation = getDistanceBetweenItems(
        renderOrder.value,
        newOrder,
        gridConfig
      );
      translateWithTiming(itemTranslation, translation, {
        duration: MOVE_ANIMATION_DURATION
      });
    }
  );

  const handleItemDrag = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    DragContext
  >({
    onStart: (_, ctx) => {
      ctx.dropOrder = ctx.startOrder = itemsOrder.value[itemKey];
      ctx.dropTranslation = ctx.startTranslation = getDistanceBetweenItems(
        renderOrder.value,
        ctx.startOrder,
        gridConfig
      );
      onDragStart(itemKey);
    },
    onActive: ({ translationX, translationY }, ctx) => {
      if (!isDragging.value) {
        isDragging.value = true;
        itemAnimationProgress.value = withTiming(1, {
          duration: MOVE_ANIMATION_DURATION
        });
      }
      itemTranslation.x.value = ctx.startTranslation.x + translationX;
      itemTranslation.y.value = ctx.startTranslation.y + translationY;
      ctx.currOrder = itemsOrder.value[itemKey];
      ctx.dropOrder = getItemDropOrder(
        ctx.startOrder,
        { x: translationX, y: translationY },
        gridConfig
      );
      if (ctx.currOrder !== ctx.dropOrder) {
        ctx.dropTranslation = getDistanceBetweenItems(
          renderOrder.value,
          ctx.dropOrder,
          gridConfig
        );
        translateWithTiming(dropIndicatorTranslation, ctx.dropTranslation, {
          duration: MOVE_ANIMATION_DURATION
        });
        onOrderChange(itemKey, ctx.dropOrder);
      }
    },
    onEnd: (_, ctx) => {
      itemAnimationProgress.value = withTiming(0, {
        duration: MOVE_ANIMATION_DURATION
      });
      translateWithTiming(itemTranslation, ctx.dropTranslation, {
        duration: DROP_ANIMATION_DURATION,
        callback: () => {
          ctx.startOrder = ctx.dropOrder;
          isDragging.value = false;
          onDragEnd(itemKey);
        }
      });
    }
  });

  return (
    <GridItemWrapper size={size} gap={gap}>
      <ItemDropIndicator style={animatedDropAreaStyle} />
      <AnimatedItemWrapper style={animatedItemStyle}>
        <PanGestureHandler onGestureEvent={handleItemDrag} enabled={draggable}>
          <Animated.View style={StyleSheet.absoluteFill}>
            {children}
          </Animated.View>
        </PanGestureHandler>
      </AnimatedItemWrapper>
    </GridItemWrapper>
  );
};

export default React.memo(SortableGridItem);
