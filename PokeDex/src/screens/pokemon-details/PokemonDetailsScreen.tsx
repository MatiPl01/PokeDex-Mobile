import React from 'react';
import styled from 'styled-components/native';
import { Route } from '@react-navigation/native';
import CircularProgress from '@components/shared/react/CircularProgress/CircularProgress';

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
      <CircularProgress value={10000} maxValue={10000} />
    </>
  );
};

export default PokemonDetailsScreen;
