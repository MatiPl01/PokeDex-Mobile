import React, { ComponentType, useRef, useEffect } from 'react';
import { FlatList, FlatListProps, Pressable } from 'react-native';
import { SIZE } from '@constants';
import StickyHeaderTab, { HeaderTab } from './StickyHeaderTab';
import { TabList } from './StickyHeaderTabs.styles';

type StickyHeaderTabsProps = {
  tabs: HeaderTab[];
  activeTabIndex: number;
  onMeasurement: (tabIndex: number, width: number) => void;
  scrollToIndex: (index: number) => void;
  setTabListRef: (ref: React.MutableRefObject<FlatList<any> | null>) => void;
};

const StickyHeaderTabs: React.FC<StickyHeaderTabsProps> = ({
  tabs,
  activeTabIndex,
  scrollToIndex,
  onMeasurement,
  setTabListRef
}) => {
  const tabListRef = useRef<FlatList | null>(null);

  useEffect(() => {
    setTabListRef(tabListRef);
  }, []);

  const renderItem = ({
    item: tab,
    index
  }: {
    item: HeaderTab;
    index: number;
  }) => (
    <Pressable key={tab.anchor} onPress={() => scrollToIndex(index)}>
      <StickyHeaderTab
        onMeasurement={onMeasurement.bind(null, index)}
        active={index === activeTabIndex}
        {...tab}
      />
    </Pressable>
  );

  return (
    <TabList<ComponentType<FlatListProps<HeaderTab>>>
      ref={tabListRef}
      // TODO - fix this data property
      data={tabs.filter(Boolean)}
      renderItem={renderItem}
      // TODO - fix this key extractor
      keyExtractor={item => item?.heading}
      contentContainerStyle={{
        paddingRight: SIZE.SCREEN.WIDTH
      }}
      showsHorizontalScrollIndicator={false}
      horizontal
    />
  );
};

export default React.memo(StickyHeaderTabs);
