import React from 'react';
import { useTheme } from 'styled-components';
import { PokemonStatName } from '@store/pokemon/pokemon.types';
import { camelCaseToWordsString } from '@utils/text';
import {
  StatProgressBar,
  StatRow,
  StatLabel,
  StatProgressWrapper
} from './PokemonStats.styles';

type PokemonStatsProps = {
  stats: { name: PokemonStatName; value: number }[];
};

const PokemonStats: React.FC<PokemonStatsProps> = ({ stats }) => {
  const theme = useTheme();
  const labels = stats.map(({ name }) => camelCaseToWordsString(name));
  const labelWidth =
    0.6 *
    (Math.max(...labels.map(label => label.length)) * theme.fontSize.body);

  return (
    <>
      {stats.map(({ name, value }, index) => (
        <StatRow key={name}>
          <StatLabel width={labelWidth}>{labels[index]}</StatLabel>
          <StatProgressWrapper>
            <StatProgressBar
              value={value}
              statName={name}
              animationDelay={index * 50}
            />
          </StatProgressWrapper>
        </StatRow>
      ))}
    </>
  );
};

export default PokemonStats;
