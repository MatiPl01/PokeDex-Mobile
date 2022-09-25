import React, { useState, useRef, Children, ReactElement } from 'react';
import { ScrollView } from 'react-native';
import { HeaderTab } from './StickyHeader/StickyHeaderTabs/StickyHeaderTab';
import { ScrollViewSectionProps } from './ScrollViewSection/ScrollViewSection';
import StickyHeader from './StickyHeader/StickyHeader';
import {
  Wrapper,
  GalleryWrapper,
  SectionsContentWrapper
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
  const renderedTabsCount = useRef(0);
  const [tabs, setTabs] = useState<HeaderTab[]>([]);

  // Reset the rendered sections counter on every component rerender
  renderedTabsCount.current = 0;

  return (
    <Wrapper>
      <ScrollView scrollEventThrottle={1}>
        {ImageGalleryComponent && (
          <GalleryWrapper>{ImageGalleryComponent}</GalleryWrapper>
        )}
        {Children.map(children, (child, idx) => (
          <SectionsContentWrapper
            onLayout={({
              nativeEvent: {
                layout: { y: anchor }
              }
            }) => {
              tabs[idx] = { heading: child.props.heading, anchor };
              renderedTabsCount.current = renderedTabsCount.current + 1;
              if (
                !(children instanceof Array) ||
                renderedTabsCount.current === children.length
              ) {
                setTabs([...tabs]);
              }
            }}
          >
            {child}
          </SectionsContentWrapper>
        ))}
      </ScrollView>
      <StickyHeader id={id} title={title} tabs={tabs} />
    </Wrapper>
  );
};

export default StickyHeaderScrollView;
