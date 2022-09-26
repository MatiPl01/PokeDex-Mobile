import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'styled-components';
import { Route, useFocusEffect } from '@react-navigation/native';
import { API } from '@constants';
import { RootState } from '@store';
import { fetchSinglePokemonByIdAsync } from '@store/pokemon/pokemon.actions';
import { selectSinglePokemonStateById } from '@store/pokemon/pokemon.selector';
import { useFullScreenContext } from '@context/FullScreen.context';
import { Separator } from '@components/shared/styled/layout';
import PokemonTypeBadge from '@components/pokemon/PokemonTypeBadge/PokemonTypeBadge';
import PokemonStats from '@components/pokemon/PokemonStats/PokemonStats';
import PokemonItemsGrid from '@components/items/PokemonItemsGrid/PokemonItemsGrid';
import StickyHeaderScrollView from '@components/shared/react/StickyHeaderScrollView/StickyHeaderScrollView';
import ScrollViewSection from '@components/shared/react/StickyHeaderScrollView/ScrollViewSection/ScrollViewSection';
import PokemonImageGallery from '@components/pokemon/PokemonImageGallery/PokemonImageGallery';
import {
  ScreenWrapper,
  Row,
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
  const { enableFullScreen, disableFullScreen } = useFullScreenContext();
  // Data
  const pokemonId = route.params.pokemonId;
  const pokemonState = useSelector((rootState: RootState) =>
    selectSinglePokemonStateById(rootState, pokemonId)
  );

  useFocusEffect(() => {
    enableFullScreen();
    return disableFullScreen;
  });

  useEffect(() => {
    dispatch(fetchSinglePokemonByIdAsync(pokemonId));
  }, [pokemonId]);

  // TODO - handle loading and errors
  if (!pokemonState) return null;
  const { pokemon, isLoading } = pokemonState;

  if (isLoading) return <SectionText>Loading...</SectionText>;
  if (!pokemon) return <SectionText>No pokemon</SectionText>;

  return (
    <ScreenWrapper>
      <StickyHeaderScrollView
        id={pokemon.id}
        title={pokemon.name}
        ImageGalleryComponent={
          <PokemonImageGallery
            images={pokemon.images}
            pokemonType={pokemon.types[0]}
            paginationHideTimeout={1500}
            pagination={{
              type: 'thumbnail',
              position: 'bottom',
              size: 'small'
            }}
          />
        }
      >
        <ScrollViewSection heading="Basic information">
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
        </ScrollViewSection>
        <ScrollViewSection heading="Statistics">
          <PokemonStats stats={pokemon.stats} />
        </ScrollViewSection>
        <ScrollViewSection heading="Types">
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
        </ScrollViewSection>
        <ScrollViewSection heading="Items">
          {pokemon?.items.length ? (
            <ItemsGridWrapper>
              <PokemonItemsGrid items={pokemon.items} />
            </ItemsGridWrapper>
          ) : (
            <SectionText>Pokemon has no items</SectionText>
          )}
        </ScrollViewSection>
        <ScrollViewSection heading="Abilities">
          {pokemon.abilities.map(ability => (
            <SectionText key={ability}>{ability}</SectionText>
          ))}
        </ScrollViewSection>
        <ScrollViewSection heading="Moves">
          {pokemon.moves.map(move => (
            <SectionText key={move}>{move}</SectionText>
          ))}
        </ScrollViewSection>
      </StickyHeaderScrollView>
    </ScreenWrapper>
  );
};

export default PokemonDetailsScreen;
