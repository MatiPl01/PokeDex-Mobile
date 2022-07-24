import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import {
//   selectNextPokemonFetchUrl,
//   selectPokemonList
// } from '@store/pokemon/pokemon.selector';
import SearchBar from '@components/SearchBar/SearchBar';
import { selectSearchItemsList } from '@store/search/search.selector';
import { fetchSearchItemsAsync } from '@store/search/search.actions';

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
  const searchItems = useSelector(selectSearchItemsList);
  // const nextUrl = useSelector(selectNextPokemonFetchUrl);
  // const pokemonList = useSelector(selectPokemonList);

  useEffect(() => {
    fetchSearchItems();
  }, []);

  useEffect(() => {
    console.log('change');
  }, [searchItems]);

  const fetchSearchItems = () => {
    console.log('fetch');
    dispatch(fetchSearchItemsAsync());
  };

  const handleSearch = (value: string) => {
    console.log(value);
  };

  return (
    <>
      <SearchBar
        data={searchItems}
        onSearchChange={handleSearch}
        onSearchFetchRequest={fetchSearchItems}
        showSuggestions
      />
      {/* {pokemonList &&
        pokemonList.map(pokemon => (
          <Text key={pokemon.id}>{pokemon.name}</Text>
        ))} */}
    </>
  );
};

export default PokemonScreen;
