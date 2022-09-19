import styled, { css } from 'styled-components/native';
import FontistoIcon from 'react-native-vector-icons/Fontisto';

export const PlaceholderImageIcon = styled(FontistoIcon).attrs<{
  size: number;
  name: string;
}>(({ name, size }) => ({
  name,
  size
}))<{ size: number }>`
  text-align: center;
  left: 50%;

  ${({ theme, size }) => css`
    height: ${size}px;
    width: ${size}px;
    transform: translateX(-${size / 2}px);
    color: ${theme.color.background.tertiary};
    ${theme.shadow.box.medium.sm};
  `}
`;
