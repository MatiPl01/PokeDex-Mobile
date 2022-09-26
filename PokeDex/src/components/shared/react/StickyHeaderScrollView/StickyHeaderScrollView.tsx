import React, { useState, useRef, Children, ReactElement } from 'react';
import { ScrollView } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { HeaderTab } from './StickyHeader/StickyHeaderTabs/StickyHeaderTab';
import ScrollViewGallery from './ScrollViewGallery/ScrollViewGallery';
import { ScrollViewSectionProps } from './ScrollViewSection/ScrollViewSection';
import { GALLERY_HEIGHT } from './ScrollViewGallery/ScrollViewGallery.styles';
import StickyHeader from './StickyHeader/StickyHeader';
import {
  Wrapper,
  SectionContentWrapper,
  SectionsContentWrapper,
  TitlePlaceholder
} from './StickyHeaderScrollView.styles';

type StickyHeaderScrollViewProps = {
  title: string;
  children:
    | ReactElement<ScrollViewSectionProps>
    | ReactElement<ScrollViewSectionProps>[];
  id?: string;
  ImageGalleryComponent?: React.ReactNode;
};

const StickyHeaderScrollView: React.FC<StickyHeaderScrollViewProps> = ({
  id,
  title,
  children,
  ImageGalleryComponent
}) => {
  const renderedTabsIndexesRef = useRef<Set<number>>(new Set());
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [tabs, setTabs] = useState<HeaderTab[]>([]);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const scrollY = useSharedValue(0);

  const scrollToIndex = (index: number) => {
    setActiveTabIdx(index);
    if (tabs[index]) scrollViewRef.current?.scrollTo({ y: tabs[index].anchor });
  };

  return (
    <Wrapper>
      <ScrollView
        ref={scrollViewRef}
        scrollEventThrottle={1}
        onScroll={event => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
      >
        {ImageGalleryComponent && (
          <ScrollViewGallery scrollY={scrollY}>
            {ImageGalleryComponent}
          </ScrollViewGallery>
        )}
        <SectionsContentWrapper>
          <TitlePlaceholder />
          {Children.map(children, (child, idx) => (
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
          ))}
        </SectionsContentWrapper>
      </ScrollView>
      <StickyHeader
        tabs={tabs}
        title={title}
        scrollY={scrollY}
        scrollToIndex={scrollToIndex}
        activeTabIndex={activeTabIdx}
        setHeaderHeight={setHeaderHeight}
      />
    </Wrapper>
  );
};

export default StickyHeaderScrollView;
