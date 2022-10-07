import React, { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable
} from 'react-native';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedScrollHandler,
  useDerivedValue,
} from 'react-native-reanimated';
import { useTheme } from 'styled-components';
import { SIZE } from '@constants';
import StickyHeaderTab, { HeaderTab } from './StickyHeaderTab';
import { calcActiveTabIdxOnTabsScroll } from './utils';
import { TabsScrollView } from './StickyHeaderTabs.styles';

type StickyHeaderTabsProps = {
  tabs: HeaderTab[];
  scrollX: SharedValue<number>;
  tabWidths: SharedValue<number[]>;
  tabOffsets: SharedValue<number[]>;
  activeTabIndex: SharedValue<number>;
  activeSectionIndex: SharedValue<number>;
  updateActiveTabIndex: SharedValue<boolean>;
  updateActiveSectionIndex: SharedValue<boolean>;
  onMeasurement: (tabIndex: number, width: number) => void;
  active?: boolean;
};

const StickyHeaderTabs: React.FC<StickyHeaderTabsProps> = ({
  tabs,
  active,
  scrollX,
  tabWidths,
  tabOffsets,
  onMeasurement,
  activeTabIndex,
  activeSectionIndex,
  updateActiveTabIndex,
  updateActiveSectionIndex
}) => {
  const theme = useTheme();
  const scrollViewRef = useRef<Animated.ScrollView | null>(null);
  const [tabListPadding, setTabListPadding] = useState(0);

  const handleScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
    }
  });

  const scrollToTab = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: tabOffsets.value[index] });
  };

  useDerivedValue(() => {
    if (!tabWidths.value.length) return;
    const lastTabWidth = tabWidths.value[tabWidths.value.length - 1];
    runOnJS(setTabListPadding)(
      SIZE.SCREEN.WIDTH - lastTabWidth - theme.space.lg
    );
  }, [tabWidths]);

  useDerivedValue(() => {
    runOnJS(scrollToTab)(activeTabIndex.value);
  }, [activeTabIndex]);

  const setActiveTabAndSection = (index: number) => {
    updateActiveTabIndex.value = false;
    activeSectionIndex.value = index;
    activeTabIndex.value = index;
  };

  const handleScrollEnd = ({
    nativeEvent: {
      contentOffset: { x }
    }
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (updateActiveSectionIndex.value) {
      activeTabIndex.value = activeSectionIndex.value =
        calcActiveTabIdxOnTabsScroll(x, tabOffsets.value);
    }
  };

  return (
    <TabsScrollView
      ref={scrollViewRef}
      scrollEventThrottle={1}
      contentContainerStyle={{
        paddingRight: tabListPadding
      }}
      showsHorizontalScrollIndicator={false}
      onScroll={handleScroll}
      onScrollBeginDrag={() => {
        updateActiveTabIndex.value = false;
        updateActiveSectionIndex.value = true;
      }}
      onMomentumScrollEnd={handleScrollEnd}
      decelerationRate={0.5}
      horizontal
    >
      {tabs.map((tab, index) => (
        <Pressable
          key={tab.anchor}
          onPress={() => setActiveTabAndSection(index)}
        >
          <StickyHeaderTab
            onMeasurement={onMeasurement && onMeasurement.bind(null, index)}
            active={active}
            {...tab}
          />
        </Pressable>
      ))}
    </TabsScrollView>
  );
};

export default StickyHeaderTabs;
