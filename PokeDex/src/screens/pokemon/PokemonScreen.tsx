import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNextPokemonAsync } from '@store/pokemon/pokemon.actions';
import {
  selectNextPokemonFetchUrl,
  selectPokemonList
} from '@store/pokemon/pokemon.selector';

const PokemonScreen: React.FC = () => {
  const dispatch = useDispatch();
  const nextUrl = useSelector(selectNextPokemonFetchUrl);
  const pokemonList = useSelector(selectPokemonList);

  console.log({ nextUrl });
  

  useEffect(() => {
    dispatch(fetchNextPokemonAsync(nextUrl));
  }, []);

  console.log('====================================');
  console.log(pokemonList);
  console.log('====================================');

  return (
    <>
      {pokemonList &&
        pokemonList.map(pokemon => (
          <Text key={pokemon.id}>{pokemon.name}</Text>
        ))}
    </>
  );
};

export default PokemonScreen;
