import React, { useState, useRef, Children, ReactElement } from 'react';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue
} from 'react-native-reanimated';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components';
import { DefaultTheme } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { SIZE } from '@constants';
import { createAnimatedParametrizedStyles } from '@utils/reanimated';
import { HeaderTab } from './StickyHeader/StickyHeaderTabs/StickyHeaderTab';
import { ScrollViewSectionProps } from './ScrollViewSection/ScrollViewSection';
import StickyHeader from './StickyHeader/StickyHeader';
import { calcActiveTabIdxOnSectionsScroll } from './StickyHeader/StickyHeaderTabs/utils';
import { GALLERY_HEIGHT } from './ScrollViewGallery/ScrollViewGallery.styles';
import ScrollViewGallery from './ScrollViewGallery/ScrollViewGallery';
import AddToFavoritesButton from '../AddToFavoritesButton/AddToFavoritesButton';
import {
  Wrapper,
  SectionContentWrapper,
  SectionsContentWrapper,
  ContentTitle,
  StickyHeaderWrapper,
  ContentTitlePlaceholder,
  BackButtonIcon,
  BackButton,
  FavoritesButtonWrapper
} from './StickyHeaderScrollView.styles';

const useAnimatedScrollStyles = createAnimatedParametrizedStyles<{
  theme: DefaultTheme;
  edges: EdgeInsets;
  headerHeight: number;
}>(({ theme, edges, headerHeight }) => {
  const headerScrollEndPosition =
    GALLERY_HEIGHT -
    headerHeight +
    theme.fontSize.h4 +
    theme.space.lg +
    theme.space.md;
  const headerScrollStartPosition = 0.25 * headerScrollEndPosition;

  return {
    header: {
      top: {
        inputRange: [headerScrollStartPosition, headerScrollEndPosition],
        outputRange: [-headerHeight, 0]
      },
      opacity: {
        inputRange: [headerScrollStartPosition, headerScrollEndPosition],
        outputRange: [0, 1]
      }
    },
    title: {
      top: {
        inputRange: [
          -SIZE.SCREEN.HEIGHT,
          0,
          headerScrollStartPosition,
          headerScrollEndPosition
        ],
        outputRange: [
          SIZE.SCREEN.HEIGHT + GALLERY_HEIGHT,
          GALLERY_HEIGHT,
          GALLERY_HEIGHT - headerScrollStartPosition,
          edges.top
        ]
      },
      left: {
        inputRange: [headerScrollStartPosition, headerScrollEndPosition],
        outputRange: [0, theme.size.sm]
      },
      fontSize: {
        inputRange: [headerScrollStartPosition, headerScrollEndPosition],
        outputRange: [theme.fontSize.h4, theme.fontSize.h5]
      }
    },
    gallery: {
      top: {
        inputRange: [-SIZE.SCREEN.HEIGHT, 0],
        outputRange: [-SIZE.SCREEN.HEIGHT, 0]
      }
    }
  };
});

type StickyHeaderScrollViewProps = {
  id: string;
  title: string;
  children:
    | ReactElement<ScrollViewSectionProps>
    | ReactElement<ScrollViewSectionProps>[];
  ImageGalleryComponent: React.ReactElement<{ scrollY: SharedValue<number> }>;
};

const StickyHeaderScrollView: React.FC<StickyHeaderScrollViewProps> = ({
  id,
  title,
  children,
  ImageGalleryComponent
}) => {
  const theme = useTheme();
  const edges = useSafeAreaInsets();
  const navigation = useNavigation();

  const scrollY = useSharedValue(0);
  const activeTabIndex = useSharedValue(0);
  const activeSectionIndex = useSharedValue(-1);
  const updateActiveTabIndex = useSharedValue(true);
  const updateActiveSectionIndex = useSharedValue(true);
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const renderedTabsIndexesRef = useRef<Set<number>>(new Set());

  const [tabs, setTabs] = useState<HeaderTab[]>([]);
  const [headerHeight, setHeaderHeight] = useState(0);

  const animatedScrollStyles = useAnimatedScrollStyles({
    theme,
    edges,
    headerHeight
  })(scrollY);

  const handleScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
      if (updateActiveTabIndex.value)
        activeTabIndex.value = calcActiveTabIdxOnSectionsScroll(
          scrollY.value,
          tabs
        );
    }
  });

  const scrollToSection = (index: number) => {
    if (tabs[index]?.anchor !== undefined)
      scrollViewRef.current?.scrollTo({ y: tabs[index].anchor });
  };

  useDerivedValue(() => {
    runOnJS(scrollToSection)(activeSectionIndex.value);
  }, [activeSectionIndex, tabs]);

  return (
    <Wrapper>
      <BackButton onPress={() => navigation.goBack()} top={edges.top}>
        <BackButtonIcon />
      </BackButton>
      <Animated.ScrollView
        ref={scrollViewRef}
        scrollEventThrottle={1}
        onScroll={handleScroll}
        contentContainerStyle={{
          minHeight: SIZE.SCREEN.HEIGHT + headerHeight + edges.top
        }}
        onScrollBeginDrag={() => {
          updateActiveSectionIndex.value = false;
          updateActiveTabIndex.value = true;
        }}
        onMomentumScrollEnd={() => (updateActiveSectionIndex.value = true)}
        showsVerticalScrollIndicator={false}
      >
        <ScrollViewGallery scrollY={scrollY}>
          {ImageGalleryComponent}
        </ScrollViewGallery>
        <SectionsContentWrapper>
          <ContentTitlePlaceholder />
          <FavoritesButtonWrapper>
            <AddToFavoritesButton pokemonId={id} size={theme.size.sm} />
          </FavoritesButtonWrapper>
          {headerHeight
            ? Children.map(children, (child, idx) => (
                <SectionContentWrapper
                  onLayout={({
                    nativeEvent: {
                      layout: { y }
                    }
                  }) => {
                    tabs[idx] = {
                      heading: child.props.heading,
                      anchor: y + GALLERY_HEIGHT - headerHeight
                    };
                    renderedTabsIndexesRef.current.add(idx);
                    if (
                      !(children instanceof Array) ||
                      renderedTabsIndexesRef.current.size === children.length
                    ) {
                      setTabs([...tabs]);
                    }
                  }}
                >
                  {child}
                </SectionContentWrapper>
              ))
            : null}
        </SectionsContentWrapper>
      </Animated.ScrollView>
      <StickyHeaderWrapper style={animatedScrollStyles.header}>
        <StickyHeader
          tabs={tabs}
          activeTabIndex={activeTabIndex}
          setHeaderHeight={setHeaderHeight}
          activeSectionIndex={activeSectionIndex}
          updateActiveTabIndex={updateActiveTabIndex}
          updateActiveSectionIndex={updateActiveSectionIndex}
        />
      </StickyHeaderWrapper>
      <ContentTitle style={animatedScrollStyles.title}>{title}</ContentTitle>
    </Wrapper>
  );
};

export default StickyHeaderScrollView;
