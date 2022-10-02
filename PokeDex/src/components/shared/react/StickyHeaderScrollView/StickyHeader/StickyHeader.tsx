import React from 'react';
import { SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderTab } from './StickyHeaderTabs/StickyHeaderTab';
import StickyHeaderTabsPanel from './StickyHeaderTabs/StickyHeaderTabsPanel';
import {
  HeaderWrapper,
  TitleWrapper,
  TitlePlaceholder
} from './StickyHeader.styles';

type StickyHeaderProps = {
  tabs: HeaderTab[];
  scrollY: SharedValue<number>;
  activeTabIndex: SharedValue<number>;
  scrollToIndex: (index: number) => void;
  setHeaderHeight: (height: number) => void;
};

const StickyHeader: React.FC<StickyHeaderProps> = ({
  tabs,
  scrollY,
  activeTabIndex,
  scrollToIndex,
  setHeaderHeight
}) => {
  const edges = useSafeAreaInsets();

  return (
    <HeaderWrapper
      statusBarHeight={edges.top}
      onLayout={({
        nativeEvent: {
          layout: { height }
        }
      }) => setHeaderHeight(height)}
    >
      <TitleWrapper>
        <TitlePlaceholder />
      </TitleWrapper>
      <StickyHeaderTabsPanel
        tabs={tabs}
        scrollY={scrollY}
        scrollToIndex={scrollToIndex}
        activeTabIndex={activeTabIndex}
      />
    </HeaderWrapper>
  );
};

export default StickyHeader;
