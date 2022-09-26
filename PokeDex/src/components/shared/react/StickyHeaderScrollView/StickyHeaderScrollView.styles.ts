import styled from 'styled-components/native';

export const Wrapper = styled.View`
  flex: 1;
`;

export const SectionsContentWrapper = styled.View`
  background-color: ${({ theme }) => theme.color.background.primary};
`;

export const TitlePlaceholder = styled.View`
  height: ${({ theme }) => theme.fontSize.h3 + theme.space.lg * 2}px;
`;

export const SectionContentWrapper = styled.View``;
