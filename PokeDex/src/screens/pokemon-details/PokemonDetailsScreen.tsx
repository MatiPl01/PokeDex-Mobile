import React from 'react';
import styled from 'styled-components/native';
import { Route } from '@react-navigation/native';
import ProgressCircular from '@components/shared/react/ProgressCircular/ProgressCircular';
import ProgressBar from '@components/shared/react/ProgressBar/ProgressBar';
import { View } from 'react-native';

type PokemonDetailsScreenProps = {
  route: Route<'PokemonDetails', { pokemonId: string }>;
};

const StyledText = styled.Text`
  color: ${({ theme }) => theme.color.text.primary};
`;

const PokemonDetailsScreen: React.FC<PokemonDetailsScreenProps> = ({
  route
}) => {
  return (
    <>
      <StyledText>Pokemon ID: {route.params.pokemonId}</StyledText>
      <ProgressCircular value={75} />
      <ProgressBar value={75} />
    </>
  );
};

export default PokemonDetailsScreen;
