import styled, { css } from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { PokemonType } from '@store/pokemon/pokemon.types';
import { flexCenter } from '@styles/shared';
import { calculateTextColor, mixColorsHex } from '@utils/colors';

export const BadgeText = styled.Text<{ pokemonType: PokemonType }>`
  ${({ theme, pokemonType }) => css`
    font-size: ${theme.fontSize.caption}px;
    font-weight: ${theme.fontWeight.bold};
    color: ${calculateTextColor(
      mixColorsHex(
        theme.color.pokemon.type[pokemonType].primary,
        theme.color.pokemon.type[pokemonType].secondary
      ),
      150
    )};
    ${theme.shadow.text.strong.sm};
  `};
`;

export const BadgeWrapper = styled(LinearGradient).attrs<{
  pokemonType: PokemonType;
}>(({ theme, pokemonType }) => {
  const pokemonTypeColors = theme.color.pokemon.type[pokemonType];
  return {
    colors: [pokemonTypeColors.primary, pokemonTypeColors.secondary],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 }
  };
})<{
  pokemonType: PokemonType;
}>`
  border-radius: 5px;
  ${flexCenter};

  ${({ theme }) => css`
    padding: ${theme.space.sm}px;
    width: ${theme.size.lg}px;
    ${theme.shadow.box.strong.lg};
  `};
`;
