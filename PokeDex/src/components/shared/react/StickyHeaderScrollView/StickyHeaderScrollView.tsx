import React, { useState, useRef, Children, ReactElement } from 'react';
import { View } from 'react-native';
import { HeaderTab } from './StickyHeader/StickyHeaderTabs/StickyHeaderTab';
import { ScrollViewSectionProps } from './ScrollViewSection/ScrollViewSection';
import StickyHeader from './StickyHeader/StickyHeader';
import { Wrapper, SectionsScrollView } from './StickyHeaderScrollView.styles';

type StickyHeaderScrollViewProps = {
  title: string;
  images: { name?: string; url: string }[];
  children:
    | ReactElement<ScrollViewSectionProps>
    | ReactElement<ScrollViewSectionProps>[];
  id?: string;
};

const StickyHeaderScrollView: React.FC<StickyHeaderScrollViewProps> = ({
  id,
  title,
  images,
  children
}) => {
  const renderedTabsCount = useRef(0);
  const [tabs, setTabs] = useState<HeaderTab[]>([]);

  // Reset the rendered sections counter on every component rerender
  renderedTabsCount.current = 0;

  return (
    <Wrapper>
      <SectionsScrollView scrollEventThrottle={1}>
        {Children.map(children, (child, idx) => (
          <View
            onLayout={({
              nativeEvent: {
                layout: { y: anchor }
              }
            }) => {
              tabs[idx] = { heading: child.props.heading, anchor };
              renderedTabsCount.current = renderedTabsCount.current + 1;
              if (
                !children.length ||
                renderedTabsCount.current === children.length
              ) {
                setTabs([...tabs]);
              }
            }}
          >
            {child}
          </View>
        ))}
      </SectionsScrollView>
      <StickyHeader id={id} title={title} tabs={tabs} />
    </Wrapper>
  );
};

export default StickyHeaderScrollView;
