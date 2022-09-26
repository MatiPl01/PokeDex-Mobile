import React from 'react';
import { TabWrapper, TabText } from './StickyHeaderTab.styles';

export type HeaderTab = {
  heading: string;
  anchor: number;
};

type StickyHeaderTabProps = HeaderTab & {
  onMeasurement: (width: number) => void;
  active?: boolean;
};

const StickyHeaderTab: React.FC<StickyHeaderTabProps> = ({
  heading,
  anchor,
  onMeasurement,
  active = false
}) => (
  <TabWrapper
    onLayout={({
      nativeEvent: {
        layout: { width }
      }
    }) => onMeasurement(width)}
  >
    <TabText active={true}>{heading}</TabText>
  </TabWrapper>
);

export default StickyHeaderTab;