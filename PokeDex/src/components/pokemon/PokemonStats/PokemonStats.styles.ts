import styled, { css } from 'styled-components/native';
import { API } from '@constants';
import { PokemonStatName } from '@store/pokemon/pokemon.types';
import ProgressBar from '@components/shared/react/ProgressBar/ProgressBar';

const { POKEMON } = API;

export const MAX_STAT_VALUES: Record<PokemonStatName, number> = {
  hp: POKEMON.MAX_HP,
  attack: POKEMON.MAX_ATTACK,
  defense: POKEMON.MAX_DEFENSE,
  specialAttack: POKEMON.MAX_SPECIAL_ATTACK,
  specialDefense: POKEMON.MAX_SPECIAL_DEFENSE,
  speed: POKEMON.MAX_SPEED
};

const maxDigitsCount = String(
  Math.max(...Object.values(MAX_STAT_VALUES))
).length;

export const StatProgressBar = styled(ProgressBar).attrs<{
  statName: PokemonStatName;
}>(({ theme, statName }) => {
  const color = theme.color.pokemon.stat[statName];

  return {
    textColor: theme.color.text.tertiary,
    barColor: color,
    barBackgroundColor: color,
    maxValue: MAX_STAT_VALUES[statName],
    maxDigitsCount
  };
})<{
  statName: PokemonStatName;
}>``;

export const StatRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const StatLabel = styled.Text<{ width: number }>`
  text-transform: capitalize;
  flex-basis: ${({ width }) => width}px;

  ${({ theme }) => css`
    color: ${theme.color.text.primary};
    font-size: ${theme.fontSize.body}px;
  `};
`;

export const StatProgressWrapper = styled.View`
  flex: 1;
`;
