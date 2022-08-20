import styled from 'styled-components/native';

export const Separator = styled.View<{ height?: number; width?: number }>`
  height: ${({ height }) => height || 0}px;
  width: ${({ width }) => width || 0}px;
`;
