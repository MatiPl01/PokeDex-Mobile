import styled, { css } from 'styled-components/native';
import { FlatList } from 'react-native';

export const ThumbnailsList = styled(FlatList)<{ horizontal?: boolean }>`
  ${({ horizontal, theme }) =>
    horizontal
      ? css`
          flex: 1;
          padding: ${theme.space.md}px 0;
        `
      : css`
          flex: none;
          padding: 0 ${theme.space.md}px;
        `};
`;
