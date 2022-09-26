import styled from 'styled-components/native';
import { SIZE } from '@constants';

export const GALLERY_HEIGHT = SIZE.SCREEN.HEIGHT / 3;

export const Wrapper = styled.View`
  flex: 1;
`;

export const GalleryWrapper = styled.View`
  height: ${GALLERY_HEIGHT}px;
`;

export const SectionsContentWrapper = styled.View`
  background-color: ${({ theme }) => theme.color.background.primary};
`;
