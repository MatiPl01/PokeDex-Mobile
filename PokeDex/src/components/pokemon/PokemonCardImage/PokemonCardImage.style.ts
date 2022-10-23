import styled, { css } from 'styled-components/native';
import { SvgUri } from 'react-native-svg';
import Animated from 'react-native-reanimated';
import { absoluteFill } from '@styles/shared';

const pokemonImageStyles = css`
  position: absolute;
  left: 50%;

  ${({ theme }) => css`
    bottom: ${theme.space.lg}px;
    ${theme.shadow.box.medium.md};
  `};
`;

export const Wrapper = styled(Animated.View)`
  z-index: 1;
  ${absoluteFill};
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
