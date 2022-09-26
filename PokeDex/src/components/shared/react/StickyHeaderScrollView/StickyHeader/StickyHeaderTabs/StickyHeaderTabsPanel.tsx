import React, { useState, useCallback, useEffect } from 'react';
import { FlatList } from 'react-native';
import { HeaderTab } from './StickyHeaderTab';
import StickyHeaderTabs from './StickyHeaderTabs';
import { ActiveTabBackground, Wrapper } from './StickyHeaderTabsPanel.styles';

type StickyHeaderTabsPanelProps = {
  tabs: HeaderTab[];
  activeTabIndex: number;
  scrollToIndex: (index: number) => void;
};

const StickyHeaderTabsPanel: React.FC<StickyHeaderTabsPanelProps> = ({
  tabs,
  activeTabIndex,
  scrollToIndex
}) => {
  const [tabListRef, setTabListRef] =
    useState<React.MutableRefObject<FlatList<any> | null> | null>(null);
  const [tabWidths, setTabWidths] = useState<number[]>(
    new Array(tabs.length).fill(0)
  );

  useEffect(() => {
    scrollToTab(activeTabIndex);
  }, [activeTabIndex]);

  const scrollToTab = (tabIdx: number) => {
    const tabList = tabListRef?.current;
    if (!tabList) return;
    tabList.scrollToIndex({ index: tabIdx });
  };

  const updateTabWidth = useCallback((tabIndex: number, width: number) => {
    tabWidths[tabIndex] = width;
    setTabWidths([...tabWidths]);
  }, []);

  return (
    <Wrapper>
      <StickyHeaderTabs
        tabs={tabs}
        onMeasurement={updateTabWidth}
        activeTabIndex={activeTabIndex}
        scrollToIndex={scrollToIndex}
        setTabListRef={setTabListRef}
      />
      <ActiveTabBackground width={tabWidths[0]} />
    </Wrapper>
  );
};

export default StickyHeaderTabsPanel;
