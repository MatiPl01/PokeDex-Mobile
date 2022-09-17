import React from 'react';
import { HeaderTab } from './StickyHeaderTabs/StickyHeaderTab';
import StickyHeaderTabsPanel from './StickyHeaderTabs/StickyHeaderTabsPanel';
import { HeaderWrapper, HeaderTitle } from './StickyHeader.styles';

type StickyHeaderProps = {
  title: string;
  tabs: HeaderTab[];
  id?: string;
};

const StickyHeader: React.FC<StickyHeaderProps> = ({ title, tabs, id }) => {
  return (
    <HeaderWrapper>
      <HeaderTitle>{title}</HeaderTitle>
      <StickyHeaderTabsPanel tabs={tabs} />
    </HeaderWrapper>
  );
};

export default StickyHeader;
