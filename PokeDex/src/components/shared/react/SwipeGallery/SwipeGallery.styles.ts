import styled, { css } from 'styled-components/native';
import { FlattenSimpleInterpolation } from 'styled-components';
import { TouchableOpacity } from 'react-native';
import { Corner } from '@types';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export const GalleryWrapper = styled.View`
  flex: 1;
`;

export const ImageWrapper = styled.View<{ height: number; width: number }>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
`;

export const ImageList = styled.FlatList``;

export const GalleryOverlayWrapper = styled.View.attrs({
  pointerEvents: 'box-none'
})`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const GalleryOverlay = styled.View.attrs({
  pointerEvents: 'box-none'
})`
  flex: 1;
`;

const getFullScreenPositionStyle = (
  corner: Corner
): FlattenSimpleInterpolation => {
  switch (corner) {
    case 'top-right':
      return css`
        top: 0;
        right: 0;
      `;
    case 'top-left':
      return css`
        top: 0;
        left: 0;
      `;
    case 'bottom-right':
      return css`
        right: 0;
        bottom: 0;
      `;
    case 'bottom-left':
      return css`
        left: 0;
        bottom: 0;
      `;
  }
};

export const FullsScreenButton = styled(TouchableOpacity)<{ corner: Corner }>`
  position: absolute;
  ${({ corner }) => getFullScreenPositionStyle(corner)}
  ${({ theme }) => css`
    padding-right: ${theme.space.md}px;
  `}
`;

export const FullScreenIcon = styled(MaterialIcon).attrs(({ theme }) => ({
  size: theme.size.sm,
  name: 'fullscreen'
}))`
  ${({ theme }) => css`
    color: ${theme.color.text.primary};
    ${theme.shadow.box.medium.md};
  `}
`;
