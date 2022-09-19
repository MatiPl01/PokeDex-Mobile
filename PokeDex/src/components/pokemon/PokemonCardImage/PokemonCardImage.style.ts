import styled, { css } from 'styled-components/native';
import { SvgUri } from 'react-native-svg';

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

export const PokemonImage = styled.Image<{ width: number; height: number }>`
  ${({ width, height }) => css`
    transform: translateX(-${width / 2}px);
    height: ${width}px;
    width: ${height}px;
  `};
  ${pokemonImageStyles};
`;

