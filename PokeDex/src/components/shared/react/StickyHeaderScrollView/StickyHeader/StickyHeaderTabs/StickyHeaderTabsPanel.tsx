import React, { useState, useCallback } from 'react';
import {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue
} from 'react-native-reanimated';
import { calcActiveTabIdx } from './utils';
import StickyHeaderTabs from './StickyHeaderTabs';
import StickyHeaderTab, { HeaderTab } from './StickyHeaderTab';
import {
  ActiveTabBackground,
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
  const scrollX = useSharedValue(0);
  const [tabWidths, setTabWidths] = useState<number[]>(
    new Array(tabs.length).fill(0)
  );

  const animatedTabsScrollStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -scrollX.value }]
  }));

  const updateTabWidth = useCallback((tabIndex: number, width: number) => {
    tabWidths[tabIndex] = width;
    setTabWidths([...tabWidths]);
  }, []);

  useDerivedValue(() => {
    console.log({ scrollY, active: calcActiveTabIdx(scrollY.value, tabs) });
  }, [scrollY]);

  return (
    <Wrapper>
      <ActiveTabBackground width={tabWidths[0]} />
      <MaskedWrapper
        maskElement={
          <>
            {/* <StickyHeaderTabs
              tabs={tabs}
              scrollX={scrollX}
              onMeasurement={updateTabWidth}
              scrollToIndex={scrollToIndex}
              activeTabIndex={activeTabIndex}
            /> */}
            <TabListMask style={animatedTabsScrollStyle}>
              {tabs.map(({ heading }) => (
                <StickyHeaderTab key={heading} heading={heading} />
              ))}
            </TabListMask>
            <ActiveTabBackground
              width={tabWidths[0]}
              style={{ backgroundColor: 'transparent' }}
            />
          </>
        }
      >
        <StickyHeaderTabs
          tabs={tabs}
          scrollX={scrollX}
          onMeasurement={updateTabWidth}
          scrollToIndex={scrollToIndex}
          activeTabIndex={activeTabIndex}
          active
        />
        <ActiveTabBackground
          pointerEvents="none"
          width={tabWidths[0]}
          style={{
            backgroundColor: 'black',
            position: 'absolute',
            zIndex: 1
          }}
        />
      </MaskedWrapper>
    </Wrapper>
  );
};

export default StickyHeaderTabsPanel;
