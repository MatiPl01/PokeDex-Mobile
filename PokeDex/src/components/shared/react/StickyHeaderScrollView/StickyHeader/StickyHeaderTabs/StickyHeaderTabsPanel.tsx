import React, { useState, useCallback } from 'react';
import { HeaderTab } from './StickyHeaderTab';
import StickyHeaderTabs from './StickyHeaderTabs';
import { ActiveTabBackground, Wrapper } from './StickyHeaderTabsPanel.styles';

type StickyHeaderTabsPanelProps = {
  tabs: HeaderTab[];
};

const StickyHeaderTabsPanel: React.FC<StickyHeaderTabsPanelProps> = ({
  tabs
}) => {
  const [tabWidths, setTabWidths] = useState<number[]>(
    new Array(tabs.length).fill(0)
  );

  const updateTabWidth = useCallback((tabIndex: number, width: number) => {
    tabWidths[tabIndex] = width;
    setTabWidths([...tabWidths]);
  }, []);

  return (
    <Wrapper>
      <StickyHeaderTabs tabs={tabs} onMeasurement={updateTabWidth} />
      <ActiveTabBackground width={tabWidths[0]} />
    </Wrapper>
  );
};

export default StickyHeaderTabsPanel;
