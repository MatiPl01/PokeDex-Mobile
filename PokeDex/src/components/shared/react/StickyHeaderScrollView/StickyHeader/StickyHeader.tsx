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
  activeTabIndex: SharedValue<number>;
  activeSectionIndex: SharedValue<number>;
  updateActiveTabIndex: SharedValue<boolean>;
  updateActiveSectionIndex: SharedValue<boolean>;
  setHeaderHeight: (height: number) => void;
};

const StickyHeader: React.FC<StickyHeaderProps> = props => {
  const { setHeaderHeight, ...restProps } = props;
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
      <StickyHeaderTabsPanel {...restProps} />
    </HeaderWrapper>
  );
};

export default React.memo(StickyHeader);
