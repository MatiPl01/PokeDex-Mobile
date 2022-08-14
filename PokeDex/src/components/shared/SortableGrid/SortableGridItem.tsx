import React, { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
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
  SharedValue
} from 'react-native-reanimated';
import {
  GridConfig,
  getItemDropOrder,
  getDistanceBetweenItems,
  Translation
} from './sortableGrid.utils';
import {
  GridItemWrapper,
  AnimatedItemWrapper
} from './SortableGridItem.styles';

const DROP_ANIMATION_DURATION = 500;
const MOVE_ANIMATION_DURATION = 250;

type DragContext = {
  startTranslation: Translation;
  startOrder: number;
  currOrder: number;
  dropOrder: number;
};

type SortableGridItemProps = PropsWithChildren<{
  itemKey: string;
  itemsOrder: SharedValue<{ [key: string]: number }>;
  size: number;
  gap: number;
  gridConfig: GridConfig;
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
  onOrderChange,
  onDragStart,
  onDragEnd,
  children
}) => {
  if (itemsOrder.value[itemKey] === undefined) return null;
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const renderOrder = useSharedValue(itemsOrder.value[itemKey]);

  const animatedItemWrapperStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: isDragging.value ? 1.1 : 1 }
    ]
  }));

  const translateWithTiming = (
    translation: Translation,
    { duration, callback }: { duration?: number; callback?: () => void } = {}
  ) => {
    'worklet';
    const animationConfig = {
      duration: duration || 1000
    };
    translateX.value = withTiming(translation.x, animationConfig);
    translateY.value = withTiming(translation.y, animationConfig, callback);
  };

  useAnimatedReaction(
    () => itemsOrder.value[itemKey],
    newOrder => {
      const translation = getDistanceBetweenItems(
        renderOrder.value,
        newOrder,
        gridConfig
      );
      translateWithTiming(translation, {
        duration: MOVE_ANIMATION_DURATION
      });
    }
  );

  const handleItemDrag = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    DragContext
  >({
    onStart: (_, ctx) => {
      console.log('start', itemKey); // TODO - fix inability to start dragging (happens only for some cards quite randomly)
      ctx.dropOrder = ctx.startOrder = itemsOrder.value[itemKey];
      ctx.startTranslation = getDistanceBetweenItems(
        renderOrder.value,
        ctx.startOrder,
        gridConfig
      );
      onDragStart(itemKey);
    },
    onActive: ({ translationX, translationY }, ctx) => {
      isDragging.value = true;
      translateX.value = ctx.startTranslation.x + translationX;
      translateY.value = ctx.startTranslation.y + translationY;
      ctx.currOrder = itemsOrder.value[itemKey];
      ctx.dropOrder = getItemDropOrder(
        ctx.startOrder,
        { x: translationX, y: translationY },
        gridConfig
      );
      if (ctx.currOrder !== ctx.dropOrder) {
        onOrderChange(itemKey, ctx.dropOrder);
      }
    },
    onEnd: (_, ctx) => {
      const translation = getDistanceBetweenItems(
        renderOrder.value,
        ctx.dropOrder,
        gridConfig
      );
      translateWithTiming(translation, {
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
      <AnimatedItemWrapper style={animatedItemWrapperStyle}>
        <PanGestureHandler onGestureEvent={handleItemDrag}>
          <Animated.View style={StyleSheet.absoluteFill}>
            {children}
          </Animated.View>
        </PanGestureHandler>
      </AnimatedItemWrapper>
    </GridItemWrapper>
  );
};

export default React.memo(SortableGridItem);
