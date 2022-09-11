import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'styled-components';
import { Route } from '@react-navigation/native';
import { API } from '@constants';
import { RootState } from '@store';
import { fetchSinglePokemonByIdAsync } from '@store/pokemon/pokemon.actions';
import { selectSinglePokemonStateById } from '@store/pokemon/pokemon.selector';
import { Separator } from '@components/shared/styled/layout';
import PokemonTypeBadge from '@components/pokemon/PokemonTypeBadge/PokemonTypeBadge';
import PokemonStats from '@components/pokemon/PokemonStats/PokemonStats';
import PokemonItemsGrid from '@components/items/PokemonItemsGrid/PokemonItemsGrid';
import {
  ScrollableWrapper,
  Row,
  DetailsSection,
  SectionHeading,
  SectionText,
  ProgressCircular,
  ItemsGridWrapper
} from './PokemonDetailsScreen.styles';

type PokemonDetailsScreenProps = {
  route: Route<'PokemonDetails', { pokemonId: string }>;
};

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

  useEffect(() => {
    dispatch(fetchSinglePokemonByIdAsync(pokemonId));
  }, [pokemonId]);

  // TODO - handle loading and errors
  if (isLoading) return <SectionText>Loading...</SectionText>;
  if (!pokemon) return <SectionText>No pokemon</SectionText>;

  return (
    <ScrollableWrapper>
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
        {pokemon?.items.length ? (
          <ItemsGridWrapper>
            <PokemonItemsGrid items={pokemon.items} />
          </ItemsGridWrapper>
        ) : (
          <SectionText>Pokemon has no items</SectionText>
        )}
      </DetailsSection>
      <DetailsSection>
        <SectionHeading>Types</SectionHeading>
        <Row>
          {pokemon.types.map((type, index) => (
            <Row key={type}>
              <PokemonTypeBadge key={type} type={type} size="big" />
              {index < pokemon.types.length - 1 ? (
                <Separator width={theme.space.md} />
              ) : null}
            </Row>
          ))}
        </Row>
      </DetailsSection>
      <DetailsSection>
        <SectionHeading>Abilities</SectionHeading>
        {pokemon.abilities.map(ability => (
          <SectionText key={ability}>{ability}</SectionText>
        ))}
      </DetailsSection>
      <DetailsSection>
        <SectionHeading>Moves</SectionHeading>
        {pokemon.moves.map(move => (
          <SectionText key={move}>{move}</SectionText>
        ))}
      </DetailsSection>
    </ScrollableWrapper>
  );
};

export default PokemonDetailsScreen;
