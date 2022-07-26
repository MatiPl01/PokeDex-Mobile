import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSearchItemsList } from '@store/search/search.selector';
import { fetchSearchItemsAsync } from '@store/search/search.actions';
import { fetchNextPokemonListAsync } from '@store/pokemon/pokemon.actions';
import { selectPokemonList } from '@store/pokemon/pokemon.selector';
import { SearchItem } from '@utils/search';
import SearchBar from '@components/shared/SearchBar/SearchBar';
import PokemonList from '@components/pokemon/PokemonList/PokemonList';

// TODO - display loading indicator in search suggestions when fetching data from the API
const PokemonScreen: React.FC = () => {
  const dispatch = useDispatch();
  const searchItems = useSelector(selectSearchItemsList);
  const pokemonList = useSelector(selectPokemonList);

  useEffect(() => {
    fetchSearchItems();
    fetchNextPokemonList();
  }, []);

  const fetchSearchItems = () => {
    dispatch(fetchSearchItemsAsync());
  };

  const fetchNextPokemonList = () => {
    dispatch(fetchNextPokemonListAsync());
  };

  const handlePokemonSearch = (item: SearchItem) => {
    // TODO - display corresponding pokemon screen on search
    console.log(item);
  };

  console.log(pokemonList);

  return (
    <>
      <SearchBar
        data={searchItems}
        onSearchSubmit={handlePokemonSearch}
        onSearchFetchRequest={fetchSearchItems}
        showSuggestions
      />
      <PokemonList
        pokemonList={pokemonList}
        onFetchNextRequest={fetchNextPokemonList}
      />
    </>
  );
};

export default PokemonScreen;
