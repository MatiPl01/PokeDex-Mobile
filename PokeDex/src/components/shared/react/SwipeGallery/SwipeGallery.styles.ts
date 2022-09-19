import styled from 'styled-components/native';

export const GalleryWrapper = styled.View`
  flex: 1;
`;

export const ImageWrapper = styled.View<{ height: number; width: number }>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
`;

export const ImageList = styled.FlatList``;
