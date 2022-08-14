import styled, { css } from 'styled-components/native';

export const GridFlatList = styled.FlatList<{
  paddingX: number;
  paddingY: number;
}>`
  position: relative;

  ${({ paddingX, paddingY }) =>
    paddingX &&
    paddingY &&
    css`
      padding: ${paddingX}px ${paddingY}px;
    `};
`;
