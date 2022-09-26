import React from 'react';
import { TabWrapper, TabText } from './StickyHeaderTab.styles';

export type HeaderTab = {
  heading: string;
  anchor: number;
};

type StickyHeaderTabProps = {
  heading: string;
  onMeasurement: (width: number) => void;
  active?: boolean;
};

const StickyHeaderTab: React.FC<StickyHeaderTabProps> = ({
  heading,
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
    <TabText active={active}>{heading}</TabText>
  </TabWrapper>
);

export default StickyHeaderTab;
