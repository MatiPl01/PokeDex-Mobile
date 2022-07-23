import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNextPokemonAsync } from '@store/pokemon/pokemon.actions';
import {
  selectNextPokemonFetchUrl,
  selectPokemonList
} from '@store/pokemon/pokemon.selector';
import SearchBar from '@components/SearchBar/SearchBar';

const PokemonScreen: React.FC = () => {
  const dispatch = useDispatch();
  const nextUrl = useSelector(selectNextPokemonFetchUrl);
  const pokemonList = useSelector(selectPokemonList);

  useEffect(() => {
    dispatch(fetchNextPokemonAsync(nextUrl));
  }, []);

  return (
    <>
      <SearchBar />
      {pokemonList &&
        pokemonList.map(pokemon => (
          <Text key={pokemon.id}>{pokemon.name}</Text>
        ))}
    </>
  );
};

export default PokemonScreen;
