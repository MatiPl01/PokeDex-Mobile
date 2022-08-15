import styled from 'styled-components/native';

export const GridFlatList = styled.FlatList<{
  paddingX: number;
}>`
  position: relative;
  padding: ${({ paddingX }) => `0px ${paddingX}px`};
`;
