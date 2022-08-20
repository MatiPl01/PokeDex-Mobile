import styled from 'styled-components/native';

export const GridItemsWrapper = styled.View<{ height: number }>`
  height: ${({ height }) => height}px;
`;
