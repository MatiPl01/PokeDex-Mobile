import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNextPokemonAsync } from '@store/pokemon/pokemon.actions';
import {
  selectNextPokemonFetchUrl,
  selectPokemonList
} from '@store/pokemon/pokemon.selector';
import SearchBar from '@components/SearchBar/SearchBar';

// TODO - use data from the API
const mockedData = [
  'bulbasaur',
  'ivysaur',
  'venusaur',
  'charmander',
  'charmeleon',
  'charizard',
  'squirtle',
  'wartortle',
  'blastoise',
  'caterpie'
].map((value, idx) => ({
  id: String(idx),
  value
}));

const PokemonScreen: React.FC = () => {
  const dispatch = useDispatch();
  const nextUrl = useSelector(selectNextPokemonFetchUrl);
  const pokemonList = useSelector(selectPokemonList);

  useEffect(() => {
    // dispatch(fetchNextPokemonAsync(nextUrl));
  }, []);

  const handleSearch = (value: string) => {
    console.log(value);
  };

  return (
    <>
      <SearchBar
        onSearchChange={handleSearch}
        data={mockedData}
        showSuggestions
      />
      {pokemonList &&
        pokemonList.map(pokemon => (
          <Text key={pokemon.id}>{pokemon.name}</Text>
        ))}
    </>
  );
};

export default PokemonScreen;
