import React, { ComponentType, useRef } from 'react';
import { FlatList, FlatListProps, Pressable } from 'react-native';
import {
  runOnJS,
  SharedValue,
  useAnimatedScrollHandler,
  useDerivedValue
} from 'react-native-reanimated';
import { SIZE } from '@constants';
import StickyHeaderTab, { HeaderTab } from './StickyHeaderTab';
import { TabList } from './StickyHeaderTabs.styles';

type StickyHeaderTabsProps = {
  tabs: HeaderTab[];
  scrollX: SharedValue<number>;
  activeTabIndex: SharedValue<number>;
  onMeasurement: (tabIndex: number, width: number) => void;
  scrollToIndex: (index: number) => void;
  active?: boolean;
};

const StickyHeaderTabs: React.FC<StickyHeaderTabsProps> = ({
  tabs,
  active,
  scrollX,
  activeTabIndex,
  scrollToIndex,
  onMeasurement
}) => {
  const tabListRef = useRef<FlatList | null>(null);

  const handleScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
    }
  });

  const scrollToTab = (tabIdx: number) => {
    if (tabIdx < tabs.length)
      tabListRef.current?.scrollToIndex({ index: tabIdx });
  };

  const renderItem = ({
    item: tab,
    index
  }: {
    item: HeaderTab;
    index: number;
  }) => (
    <Pressable
      key={tab.anchor}
      onPress={scrollToIndex && (() => scrollToIndex(index))}
    >
      <StickyHeaderTab
        onMeasurement={onMeasurement && onMeasurement.bind(null, index)}
        active={active}
        {...tab}
      />
    </Pressable>
  );

  useDerivedValue(() => {
    if (activeTabIndex) runOnJS(scrollToTab)(activeTabIndex.value);
  }, [activeTabIndex]);

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
        paddingRight: SIZE.SCREEN.WIDTH
      }}
      showsHorizontalScrollIndicator={false}
      onScroll={handleScroll}
      horizontal
    />
  );
};

export default React.memo(StickyHeaderTabs);
