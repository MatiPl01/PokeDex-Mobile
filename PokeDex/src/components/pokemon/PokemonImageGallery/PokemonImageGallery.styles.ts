import styled, { css } from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { PokemonType } from '@store/pokemon/pokemon.types';
import { absoluteFill } from '@styles/shared';

export const ImageText = styled.Text`
  ${({ theme }) => css`
    color: ${theme.color.text.primary};
    font-weight: ${theme.fontWeight.bold};
    font-size: ${theme.fontSize.body}px;
    margin: ${theme.space.lg}px;
    ${theme.shadow.text.soft.sm};
  `};
`;

export const BackgroundGradient = styled(LinearGradient).attrs<{
  pokemonType: PokemonType;
}>(({ theme, pokemonType }) => {
  const typeColors = theme.color.pokemon.type[pokemonType];
  return {
    colors: [typeColors.primary, typeColors.secondary],
    start: { x: 0, y: 1 },
    end: { x: 1, y: 0 }
  };
})<{ pokemonType: PokemonType }>`
  opacity: 0.25;
  ${absoluteFill};
`;
