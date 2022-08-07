import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchItem } from '@utils/search';
import SearchBar from '@components/shared/SearchBar/SearchBar';
import PokemonList from '@components/pokemon/PokemonList/PokemonList';
import { selectSearchItemsList } from '@store/search/search.selector';
import { fetchSearchItemsAsync } from '@store/search/search.actions';
import {
  displayAllPokemon,
  displayPokemonWithIds
} from '@store/pokemon/pokemon.actions';

const PokemonScreen: React.FC = () => {
  const dispatch = useDispatch();
  // Data
  const searchItems = useSelector(selectSearchItemsList);
  // Component state
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);

  useEffect(() => {
    fetchSearchItems();
  }, []);

  const fetchSearchItems = () => {
    dispatch(fetchSearchItemsAsync());
  };

  const handlePokemonSearch = (items: SearchItem[]) => {
    if (items.length === 0) {
      dispatch(displayAllPokemon());
    } else if (items.length === 1) {
      // TODO - display single Pokemon details screen when there is only one search result
    } else {
      // Display all suggested Pokemon cards
      dispatch(displayPokemonWithIds(items.map(({ id }) => id)));
    }
  };

  const handleSearchBarClose = () => {
    handlePokemonSearch([]);
    setIsSearchBarOpen(false);
  };

  return (
    <>
      <SearchBar
        data={searchItems}
        onSearchSubmit={handlePokemonSearch}
        onSearchFetchRequest={fetchSearchItems}
        onSearchBarClose={handleSearchBarClose}
        onSearchBarOpen={() => setIsSearchBarOpen(true)}
        showSuggestions
      />
      <PokemonList isSearchBarOpen={isSearchBarOpen} />
    </>
  );
};

export default PokemonScreen;
