import React from 'react';
import { useDispatch } from 'react-redux';
import { useTheme } from 'styled-components';
import { displayAllPokemon } from '@store/pokemon/pokemon.actions';
import {
  closeSearchBar,
  setSearchPokemonValue
} from '@store/search/search.actions';
import { Separator } from '@components/shared/styled/layout';
import {
  Heading,
  SubHeading,
  Wrapper
} from './PokemonListEmptyComponent.styles';
import RoundedButton from '@components/shared/react/RoundedButton/RoundedButton';

const PokemonListEmptyComponent: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleClearSearchResults = () => {
    dispatch(displayAllPokemon());
    dispatch(setSearchPokemonValue(''));
    dispatch(closeSearchBar());
  };

  return (
    <Wrapper>
      <Heading>No search results</Heading>
      <Separator height={theme.space.md} />
      <SubHeading>Press the button below to clear search input</SubHeading>
      <Separator height={theme.space.lg} />
      <RoundedButton onPress={handleClearSearchResults}>
        Clear search input
      </RoundedButton>
    </Wrapper>
  );
};

export default PokemonListEmptyComponent;
