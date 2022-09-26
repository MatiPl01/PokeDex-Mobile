import React from 'react';
import { View } from 'react-native';
import { useTheme, DefaultTheme } from 'styled-components';
import { SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createAnimatedParametrizedStyle } from '@utils/reanimated';
import { HeaderTab } from './StickyHeaderTabs/StickyHeaderTab';
import StickyHeaderTabsPanel from './StickyHeaderTabs/StickyHeaderTabsPanel';
import { GALLERY_HEIGHT } from '../ScrollViewGallery/ScrollViewGallery.styles';
import {
  HeaderWrapper,
  TitleWrapper,
  Title,
  TitlePlaceholder
} from './StickyHeader.styles';
import { SIZE } from '@constants';

const useAnimatedTitleStyle = createAnimatedParametrizedStyle<DefaultTheme>(
  theme => ({
    fontSize: {
      inputRange: [0, GALLERY_HEIGHT],
      outputRange: [theme.fontSize.h3, theme.fontSize.h4]
    },
    transform: [
      {
        translateY: {
          inputRange: [-SIZE.SCREEN.HEIGHT, 0, GALLERY_HEIGHT],
          outputRange: [
            SIZE.SCREEN.HEIGHT + GALLERY_HEIGHT,
            GALLERY_HEIGHT - theme.fontSize.h3,
            0
          ]
        }
      }
    ]
  })
);

type StickyHeaderProps = {
  title: string;
  tabs: HeaderTab[];
  activeTabIndex: number;
  scrollY: SharedValue<number>;
  scrollToIndex: (index: number) => void;
  setHeaderHeight: (height: number) => void;
};

const StickyHeader: React.FC<StickyHeaderProps> = ({
  title,
  tabs,
  scrollY,
  activeTabIndex,
  scrollToIndex,
  setHeaderHeight
}) => {
  const theme = useTheme();
  const edges = useSafeAreaInsets();

  const animatedTitleStyle = useAnimatedTitleStyle(theme)(scrollY);

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
        <View>
          <Title style={animatedTitleStyle}>{title}</Title>
          <TitlePlaceholder />
        </View>
      </TitleWrapper>
      <StickyHeaderTabsPanel
        tabs={tabs}
        scrollToIndex={scrollToIndex}
        activeTabIndex={activeTabIndex}
      />
    </HeaderWrapper>
  );
};

export default StickyHeader;
