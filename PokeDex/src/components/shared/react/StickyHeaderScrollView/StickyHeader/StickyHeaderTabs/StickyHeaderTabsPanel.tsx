import React, { useCallback } from 'react';
import {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue
} from 'react-native-reanimated';
import { useTheme } from 'styled-components';
import {
  calcActiveTabBackgroundWidth,
  calcActiveTabIdx,
  calcTabOffsets
} from './utils';
import StickyHeaderTabs from './StickyHeaderTabs';
import StickyHeaderTab, { HeaderTab } from './StickyHeaderTab';
import {
  ActiveTabBackground,
  ActiveTabBackgroundMask,
  ActiveTabTextMask,
  MaskedWrapper,
  TabListMask,
  Wrapper
} from './StickyHeaderTabsPanel.styles';

type StickyHeaderTabsPanelProps = {
  tabs: HeaderTab[];
  scrollY: SharedValue<number>;
  activeTabIndex: SharedValue<number>;
  scrollToIndex: (index: number) => void;
};

const StickyHeaderTabsPanel: React.FC<StickyHeaderTabsPanelProps> = ({
  tabs,
  scrollY,
  activeTabIndex,
  scrollToIndex
}) => {
  const theme = useTheme();
  const scrollX = useSharedValue(0);
  const activeTabBackgroundWidth = useSharedValue(0);
  const tabOffsets = useSharedValue<number[]>([]);
  const tabWidths = useSharedValue<number[]>(new Array(tabs.length).fill(0));

  const animatedTabsScrollStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -scrollX.value }]
  }));

  const animatedActiveTabBackgroundStyle = useAnimatedStyle(() => ({
    width: activeTabBackgroundWidth.value
  }));

  useDerivedValue(() => {
    if (!tabWidths.value.every(value => !!value)) return;
    tabOffsets.value = calcTabOffsets(tabWidths.value, theme.space.lg);
  }, [tabWidths]);

  useDerivedValue(() => {
    console.log({ scrollY, active: calcActiveTabIdx(scrollY.value, tabs) });
  }, [scrollY]);

  useDerivedValue(() => {
    activeTabBackgroundWidth.value = calcActiveTabBackgroundWidth(
      scrollX.value,
      tabWidths.value,
      tabOffsets.value
    );
  }, [scrollX, tabOffsets]);

  const updateTabWidth = useCallback((tabIndex: number, width: number) => {
    tabWidths.value[tabIndex] = width;
    tabWidths.value = [...tabWidths.value];
  }, []);

  return (
    <Wrapper>
      <ActiveTabBackground style={animatedActiveTabBackgroundStyle} />
      <MaskedWrapper
        maskElement={
          <>
            <TabListMask style={animatedTabsScrollStyle}>
              {tabs.map(({ heading }) => (
                <StickyHeaderTab key={heading} heading={heading} />
              ))}
            </TabListMask>
            <ActiveTabBackgroundMask style={animatedActiveTabBackgroundStyle} />
          </>
        }
      >
        <StickyHeaderTabs
          tabs={tabs}
          scrollX={scrollX}
          tabWidths={tabWidths}
          tabOffsets={tabOffsets}
          onMeasurement={updateTabWidth}
          scrollToIndex={scrollToIndex}
          activeTabIndex={activeTabIndex}
          active
        />
        <ActiveTabTextMask
          pointerEvents="none"
          style={animatedActiveTabBackgroundStyle}
        />
      </MaskedWrapper>
    </Wrapper>
  );
};

export default StickyHeaderTabsPanel;
