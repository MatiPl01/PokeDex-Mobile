import styled, { css } from 'styled-components/native';
import { SvgUri } from 'react-native-svg';
import FontistoIcon from 'react-native-vector-icons/Fontisto';

const pokemonImageStyles = css`
  position: absolute;
  z-index: 1;
  left: 50%;

  ${({ theme }) => css`
    bottom: ${theme.space.lg}px;
    ${theme.shadow.box.medium.md};
  `};
`;

export const PokemonSvg = styled(SvgUri)<{ width: number; height: number }>`
  ${({ width }) => css`
    transform: translateX(-${width / 2}px);
  `};
  ${pokemonImageStyles};
`;

export const PokemonImage = styled.Image<{
  width: number;
  height: number;
  loading?: boolean;
}>`
  ${({ width, height, loading }) => css`
    transform: translateX(-${width / 2}px);
    height: ${width}px;
    width: ${height}px;
    opacity: ${loading ? 0 : 1};
  `};
  ${pokemonImageStyles};
`;

export const PlaceholderImageIcon = styled(FontistoIcon).attrs<{
  size: number;
  name: string;
}>(({ name, size }) => ({
  name,
  size
}))<{ size: number }>`
  text-align: center;
  ${pokemonImageStyles};

  ${({ theme, size }) => css`
    height: ${size}px;
    width: ${size}px;
    transform: translateX(-${size / 2}px);
    color: ${theme.color.background.tertiary};
    ${theme.shadow.box.medium.sm};
  `}
`;
