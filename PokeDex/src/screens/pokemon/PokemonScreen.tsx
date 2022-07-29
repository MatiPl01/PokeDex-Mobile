import React, { useEffect } from 'react';
import { SearchItem } from '@utils/search';
import SearchBar from '@components/shared/SearchBar/SearchBar';
import PokemonList from '@components/pokemon/PokemonList/PokemonList';
import { useDispatch, useSelector } from 'react-redux';
import { selectSearchItemsList } from '@store/search/search.selector';
import { fetchSearchItemsAsync } from '@store/search/search.actions';

// TODO - display loading indicator in search suggestions when fetching data from the API
const PokemonScreen: React.FC = () => {
  const dispatch = useDispatch();
  const searchItems = useSelector(selectSearchItemsList);

  useEffect(() => {
    fetchSearchItems();
  }, []);

  const fetchSearchItems = () => {
    dispatch(fetchSearchItemsAsync());
  };

  const handlePokemonSearch = (item: SearchItem) => {
    // TODO - display corresponding pokemon screen on search
    console.log(item);
  };

  return (
    <>
      <SearchBar
        data={searchItems}
        onSearchSubmit={handlePokemonSearch}
        onSearchFetchRequest={fetchSearchItems}
        showSuggestions
      />
      <PokemonList />
    </>
  );
};

export default PokemonScreen;
