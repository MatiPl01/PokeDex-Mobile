import React from 'react';
import styled from 'styled-components/native';
import { Route } from '@react-navigation/native';

type PokemonDetailsScreenProps = {
  route: Route<'PokemonDetails', { pokemonId: string }>;
};

const StyledText = styled.Text`
  color: ${({ theme }) => theme.color.text.primary};
`;

const PokemonDetailsScreen: React.FC<PokemonDetailsScreenProps> = ({
  route
}) => {
  return <StyledText>Pokemon ID: {route.params.pokemonId}</StyledText>;
};

export default PokemonDetailsScreen;
