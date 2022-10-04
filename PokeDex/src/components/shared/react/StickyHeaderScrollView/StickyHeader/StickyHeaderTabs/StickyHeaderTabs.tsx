import React, { ComponentType, useRef, useState } from 'react';
import { FlatList, FlatListProps, Pressable } from 'react-native';
import {
  runOnJS,
  SharedValue,
  useAnimatedScrollHandler,
  useDerivedValue
} from 'react-native-reanimated';
import { useTheme } from 'styled-components';
import { SIZE } from '@constants';
import StickyHeaderTab, { HeaderTab } from './StickyHeaderTab';
import { TabList } from './StickyHeaderTabs.styles';
import { calcActiveTabIdxOnTabsScroll } from './utils';

type StickyHeaderTabsProps = {
  tabs: HeaderTab[];
  scrollX: SharedValue<number>;
  tabWidths: SharedValue<number[]>;
  tabOffsets: SharedValue<number[]>;
  activeTabIndex: SharedValue<number>;
  onMeasurement: (tabIndex: number, width: number) => void;
  scrollToIndex: (index: number) => void;
  active?: boolean;
};

const StickyHeaderTabs: React.FC<StickyHeaderTabsProps> = ({
  tabs,
  active,
  scrollX,
  tabWidths,
  tabOffsets,
  activeTabIndex,
  scrollToIndex,
  onMeasurement
}) => {
  const theme = useTheme();
  const tabListRef = useRef<FlatList | null>(null);
  const [tabListPadding, setTabListPadding] = useState(0);

  const handleScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
    }
  });

  // TODO - fix flatlist ref is null
  const scrollToTab = (tabIdx: number) => {
    if (tabIdx < tabs.length)
      tabListRef.current?.scrollToIndex({ index: tabIdx });
  };

  const setActiveTab = (index: number) => {
    activeTabIndex.value = index;
    scrollToIndex(index);
  };

  useDerivedValue(() => {
    if (activeTabIndex) runOnJS(scrollToTab)(activeTabIndex.value);
  }, [activeTabIndex]);

  useDerivedValue(() => {
    if (!tabWidths.value.length) return;
    const lastTabWidth = tabWidths.value[tabWidths.value.length - 1];
    runOnJS(setTabListPadding)(
      SIZE.SCREEN.WIDTH - lastTabWidth - theme.space.lg
    );
  }, [tabWidths]);

  // useDerivedValue(() => {
  //   const newActiveTabIdx = calcActiveTabIdxOnTabsScroll(
  //     scrollX.value,
  //     tabOffsets.value
  //   );
  //   console.log({ newActiveTabIdx, activeTabIndex });
  //   if (newActiveTabIdx !== activeTabIndex.value)
  //     runOnJS(scrollToIndex)(activeTabIndex.value);
  //   activeTabIndex.value = newActiveTabIdx;
  // }, [scrollX]);

  const renderItem = ({
    item: tab,
    index
  }: {
    item: HeaderTab;
    index: number;
  }) => (
    <Pressable key={tab.anchor} onPress={() => setActiveTab(index)}>
      <StickyHeaderTab
        onMeasurement={onMeasurement && onMeasurement.bind(null, index)}
        active={active}
        {...tab}
      />
    </Pressable>
  );

  return (
    <TabList<ComponentType<FlatListProps<HeaderTab>>>
      ref={tabListRef}
      scrollEventThrottle={1}
      // TODO - fix this data property
      data={tabs.filter(Boolean)}
      renderItem={renderItem}
      // TODO - fix this key extractor
      keyExtractor={item => item?.heading}
      contentContainerStyle={{
        paddingRight: tabListPadding
      }}
      onMomentumScrollEnd={() => scrollToTab(activeTabIndex.value)}
      showsHorizontalScrollIndicator={false}
      onScroll={handleScroll}
      horizontal
    />
  );
};

export default React.memo(StickyHeaderTabs);
