import React, { PropsWithChildren } from 'react';
import {
  SectionWrapper,
  SectionHeading,
  SectionContent
} from './ScrollViewSection.styles';

export type ScrollViewSectionProps = PropsWithChildren<{
  heading: string;
}>;

const ScrollViewSection: React.FC<ScrollViewSectionProps> = ({
  heading,
  children
}) => (
  <SectionWrapper>
    <SectionHeading>{heading}</SectionHeading>
    <SectionContent>{children}</SectionContent>
  </SectionWrapper>
);

export default ScrollViewSection;
