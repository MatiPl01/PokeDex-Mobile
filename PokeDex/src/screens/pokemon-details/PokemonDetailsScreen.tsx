import React, { useEffect } from 'react';
import { ScrollView, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Route } from '@react-navigation/native';
import { API } from '@constants';
import { RootState } from '@store';
import { fetchSinglePokemonByIdAsync } from '@store/pokemon/pokemon.actions';
import { selectSinglePokemonStateById } from '@store/pokemon/pokemon.selector';
import PokemonStats from '@components/pokemon/PokemonStats/PokemonStats';
import PokemonItemsGrid from '@components/items/PokemonItemsGrid/PokemonItemsGrid';
import {
  Row,
  DetailsSection,
  SectionHeading,
  ProgressCircular,
  ItemsGridWrapper
} from './PokemonDetailsScreen.styles';

type PokemonDetailsScreenProps = {
  route: Route<'PokemonDetails', { pokemonId: string }>;
};

const PokemonDetailsScreen: React.FC<PokemonDetailsScreenProps> = ({
  route
}) => {
  const dispatch = useDispatch();
  // Data
  const pokemonId = route.params.pokemonId;
  const { pokemon, isLoading } = useSelector((rootState: RootState) =>
    selectSinglePokemonStateById(rootState, pokemonId)
  );

  useEffect(() => {
    dispatch(fetchSinglePokemonByIdAsync(pokemonId));
  }, [pokemonId]);

  // TODO - handle loading and errors
  if (isLoading) return <Text>Loading...</Text>;
  if (!pokemon) return <Text>No pokemon</Text>;

  return (
    <ScrollView>
      <DetailsSection>
        <SectionHeading>Basic information</SectionHeading>
        <Row>
          <ProgressCircular
            label="Base Experience"
            value={pokemon.baseExperience}
            maxValue={API.POKEMON.MAX_BASE_EXPERIENCE}
          />
          <ProgressCircular
            label="Height"
            value={pokemon.height}
            maxValue={API.POKEMON.MAX_HEIGHT}
            animationDelay={100}
          />
          <ProgressCircular
            label="Weight"
            value={pokemon.weight}
            maxValue={API.POKEMON.MAX_WEIGHT}
            animationDelay={200}
          />
        </Row>
      </DetailsSection>
      <DetailsSection>
        <SectionHeading>Statistics</SectionHeading>
        <PokemonStats stats={pokemon.stats} />
      </DetailsSection>
      <DetailsSection>
        <SectionHeading>Items</SectionHeading>
        <ItemsGridWrapper>
          <PokemonItemsGrid items={pokemon?.items || []} />
        </ItemsGridWrapper>
      </DetailsSection>
      <DetailsSection>
        <SectionHeading>Types</SectionHeading>
        {pokemon.types.map(type => (
          <Text key={type}>{type}</Text>
        ))}
      </DetailsSection>
      <DetailsSection>
        <SectionHeading>Abilities</SectionHeading>
        {pokemon.abilities.map(ability => (
          <Text key={ability}>{ability}</Text>
        ))}
      </DetailsSection>
      <DetailsSection>
        <SectionHeading>Moves</SectionHeading>
        {pokemon.moves.map(move => (
          <Text key={move}>{move}</Text>
        ))}
      </DetailsSection>
    </ScrollView>
  );
};

export default PokemonDetailsScreen;
