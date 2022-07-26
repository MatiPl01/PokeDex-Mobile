import styled, { css } from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { PokemonType } from '@store/pokemon/pokemon.types';
import { flexCenter } from '@styles/shared';
import { calculateTextColor, mixColorsHex } from '@utils/colors';

export const TYPE_BADGE_WIDTH = 60;

export const BadgeText = styled.Text<{ pokemonType: PokemonType }>`
  ${({ theme, pokemonType }) => css`
    font-size: ${theme.fontSize.caption};
    font-weight: ${theme.fontWeight.bold};
    color: ${calculateTextColor(
      mixColorsHex(
        theme.color.pokemonType[pokemonType].primary,
        theme.color.pokemonType[pokemonType].secondary
      ),
      150
    )};
    ${theme.shadow.strong.sm};
  `};
`;

export const BadgeWrapper = styled(LinearGradient).attrs<{
  pokemonType: PokemonType;
}>(({ theme, pokemonType }) => {
  const pokemonTypeColors = theme.color.pokemonType[pokemonType];
  return {
    colors: [pokemonTypeColors.primary, pokemonTypeColors.secondary],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 }
  };
})<{
  pokemonType: PokemonType;
}>`
  width: ${TYPE_BADGE_WIDTH}px;
  padding: 5px;
  border-radius: 5px;
  ${({ theme }) => theme.shadow.strong.lg};
  ${flexCenter};
`;
