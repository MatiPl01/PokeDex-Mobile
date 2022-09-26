import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderTab } from './StickyHeaderTabs/StickyHeaderTab';
import StickyHeaderTabsPanel from './StickyHeaderTabs/StickyHeaderTabsPanel';
import { HeaderWrapper, HeaderTitle } from './StickyHeader.styles';

type StickyHeaderProps = {
  title: string;
  tabs: HeaderTab[];
  id?: string;
};

const StickyHeader: React.FC<StickyHeaderProps> = ({ title, tabs, id }) => {
  const edges = useSafeAreaInsets();

  return (
    <HeaderWrapper statusBarHeight={edges.top}>
      <HeaderTitle>{title}</HeaderTitle>
      <StickyHeaderTabsPanel tabs={tabs} />
    </HeaderWrapper>
  );
};

export default StickyHeader;
