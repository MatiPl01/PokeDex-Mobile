import React, { useCallback } from 'react';
import {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue
} from 'react-native-reanimated';
import { useTheme } from 'styled-components';
import { calcActiveTabBackgroundWidth, calcTabOffsets } from './utils';
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
  activeTabIndex: SharedValue<number>;
  activeSectionIndex: SharedValue<number>;
  updateActiveTabIndex: SharedValue<boolean>;
  updateActiveSectionIndex: SharedValue<boolean>;
};

const StickyHeaderTabsPanel: React.FC<StickyHeaderTabsPanelProps> = props => {
  const { tabs, ...restProps } = props;
  const theme = useTheme();
  const activeTabBackgroundWidth = useSharedValue(0);
  const tabOffsets = useSharedValue<number[]>([]);
  const tabWidths = useSharedValue<number[]>(new Array(tabs.length).fill(0));
  const scrollX = useSharedValue(0);

  const animatedTabsScrollStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -scrollX.value }]
  }));

  const animatedActiveTabBackgroundStyle = useAnimatedStyle(() => ({
    width: activeTabBackgroundWidth.value
  }));

  useDerivedValue(() => {
    if (!tabWidths.value.every(value => !!value)) return;
    const newTabOffsets = calcTabOffsets(tabWidths.value, theme.space.lg);
    if (
      newTabOffsets.some((offset, index) => tabOffsets.value[index] !== offset)
    ) {
      tabOffsets.value = newTabOffsets;
    }
  }, [tabWidths]);

  useDerivedValue(() => {
    activeTabBackgroundWidth.value = calcActiveTabBackgroundWidth(
      scrollX.value,
      tabWidths.value,
      tabOffsets.value
    );
  }, [scrollX, tabWidths]);

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
          {...restProps}
          tabs={tabs}
          scrollX={scrollX}
          tabWidths={tabWidths}
          tabOffsets={tabOffsets}
          onMeasurement={updateTabWidth}
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
