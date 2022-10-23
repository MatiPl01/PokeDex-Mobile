import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SearchItem } from '@utils/search';
import { RootStackParamList } from '@core/Navigation/Navigation';
import SearchBar from '@components/shared/react/SearchBar/SearchBar';
import PokemonList from '@components/pokemon/PokemonList/PokemonList';
import {
  selectIsSearchBarOpen,
  selectSearchItemsList,
  selectSearchValue
} from '@store/search/search.selector';
import {
  closeSearchBar,
  fetchSearchItemsAsync,
  openSearchBar,
  setSearchPokemonValue
} from '@store/search/search.actions';
import {
  displayAllPokemon,
  displayPokemonWithIds
} from '@store/pokemon/pokemon.actions';

const PokemonScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'FullScreenStack'>>();
  // Data
  const searchItems = useSelector(selectSearchItemsList);
  const selectedSearchValue = useSelector(selectSearchValue);
  const isSearchBarOpen = useSelector(selectIsSearchBarOpen);
  // Component state
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    fetchSearchItems();
  }, []);

  useEffect(() => {
    setSearchValue(selectedSearchValue);
  }, [selectedSearchValue]);

  const fetchSearchItems = () => {
    dispatch(fetchSearchItemsAsync());
  };

  const handlePokemonSearch = (searchValue: string, items: SearchItem[]) => {
    dispatch(setSearchPokemonValue(searchValue));
    // Display all search results
    if (searchValue)
      dispatch(
        displayPokemonWithIds(
          items.map(({ id }) => id),
          false
        )
      );
    else dispatch(displayAllPokemon());
    // If there is only one result, navigate to the screen with this result
    if (items.length === 1) {
      dispatch(displayPokemonWithIds([items[0].id]));
      navigation.navigate('FullScreenStack', {
        screen: 'PokemonDetails',
        params: { pokemonId: items[0].id }
      });
    }
  };

  const handleSearchBarClose = () => {
    dispatch(setSearchPokemonValue(''));
    dispatch(displayAllPokemon());
    dispatch(closeSearchBar());
  };

  return (
    <>
      <SearchBar
        value={searchValue}
        data={searchItems}
        onSearchChange={setSearchValue}
        onSearchSubmit={handlePokemonSearch}
        onSearchFetchRequest={fetchSearchItems}
        onSearchBarClose={handleSearchBarClose}
        onSearchBarOpen={() => dispatch(openSearchBar())}
        open={isSearchBarOpen}
        showSuggestions
      />
      <PokemonList isSearchBarOpen={isSearchBarOpen} />
    </>
  );
};

export default PokemonScreen;
