import React from 'react';
import StickyHeaderTab, { HeaderTab } from './StickyHeaderTab';
import { TabsWrapper } from './StickyHeaderTabs.styles';

type StickyHeaderTabsProps = {
  tabs: HeaderTab[];
  onMeasurement: (tabIndex: number, width: number) => void;
};

const StickyHeaderTabs: React.FC<StickyHeaderTabsProps> = ({
  tabs,
  onMeasurement
}) => (
  <TabsWrapper>
    {tabs.map((tab, index) => (
      <StickyHeaderTab
        key={tab.anchor}
        onMeasurement={onMeasurement.bind(null, index)}
        {...tab}
      />
    ))}
  </TabsWrapper>
);

export default StickyHeaderTabs;
