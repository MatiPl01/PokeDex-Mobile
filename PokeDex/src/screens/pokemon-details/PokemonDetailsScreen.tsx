import React, { useEffect } from 'react';
import { ScrollView, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled, { useTheme } from 'styled-components/native';
import { Route } from '@react-navigation/native';
import { API } from '@constants';
import { RootState } from '@store';
import { fetchSinglePokemonByIdAsync } from '@store/pokemon/pokemon.actions';
import { selectSinglePokemonStateById } from '@store/pokemon/pokemon.selector';
import { Separator } from '@components/shared/styled/layout';
import PokemonStats from '@components/pokemon/PokemonStats/PokemonStats';
import {
  Row,
  DetailsSection,
  SectionHeading,
  ProgressCircular
} from './PokemonDetailsScreen.styles';

type PokemonDetailsScreenProps = {
  route: Route<'PokemonDetails', { pokemonId: string }>;
};

const StyledText = styled.Text`
  color: ${({ theme }) => theme.color.text.primary};
`;

const PokemonDetailsScreen: React.FC<PokemonDetailsScreenProps> = ({
  route
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  // Data
  const pokemonId = route.params.pokemonId;
  const { pokemon, isLoading } = useSelector((rootState: RootState) =>
    selectSinglePokemonStateById(rootState, pokemonId)
  );

  // TODO - handle loading and errors
  if (isLoading) return <Text>Loading...</Text>;
  if (!pokemon) return <Text>No pokemon</Text>;

  useEffect(() => {
    dispatch(fetchSinglePokemonByIdAsync(pokemonId));
  }, [pokemonId]);

  return (
    <ScrollView>
      {/* TODO - remove  temporary StyledText after implementing Pokemon details screen */}
      <StyledText>Pokemon ID: {pokemonId}</StyledText>
      <DetailsSection>
        {/* TODO - think of the better section name */}
        <SectionHeading>Dimensions</SectionHeading>
        <Row>
          <ProgressCircular
            value={pokemon.height}
            maxValue={API.POKEMON.MAX_HEIGHT}
            label="Height"
          />
          <Separator width={theme.space.md} />
          <ProgressCircular
            value={pokemon.weight}
            maxValue={API.POKEMON.MAX_WEIGHT}
            label="Weight"
          />
        </Row>
      </DetailsSection>
      <DetailsSection>
        <SectionHeading>Statistics</SectionHeading>
        <PokemonStats stats={pokemon.stats} />
      </DetailsSection>
    </ScrollView>
  );
};

export default PokemonDetailsScreen;
