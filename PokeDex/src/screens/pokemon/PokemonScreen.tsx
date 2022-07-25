import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FlatList, Text } from 'react-native';
import { selectSearchItemsList } from '@store/search/search.selector';
import { fetchSearchItemsAsync } from '@store/search/search.actions';
import { fetchNextPokemonListAsync } from '@store/pokemon/pokemon.actions';
import { selectPokemonList } from '@store/pokemon/pokemon.selector';
import { SearchItem } from '@utils/search';
import SearchBar from '@components/SearchBar/SearchBar';
import { PokemonListItem } from '@store/pokemon/pokemon.types';

// TODO - display loading indicator in search suggestions when fetching data from the API
const PokemonScreen: React.FC = () => {
  const dispatch = useDispatch();
  const searchItems = useSelector(selectSearchItemsList);
  const pokemonList = useSelector(selectPokemonList);

  useEffect(() => {
    fetchSearchItems();
    fetchNextPokemon();
    setTimeout(() => {
      fetchNextPokemon();
    }, 100);
  }, []);

  const fetchSearchItems = () => {
    dispatch(fetchSearchItemsAsync());
  };

  const fetchNextPokemon = () => {
    dispatch(fetchNextPokemonListAsync());
  };

  const handlePokemonSearch = (item: SearchItem) => {
    // TODO - display corresponding pokemon screen on search
    console.log(item);
  };

  const renderPokemonCard = ({
    item: { id, isLoading, pokemon }
  }: {
    item: PokemonListItem;
  }) => (
    <Text
      style={{
        fontSize: 16,
        padding: 10
      }}
    >
      {id} - {pokemon?.name} - {isLoading ? 'true' : 'false'}
    </Text>
  );

  return (
    <>
      <SearchBar
        data={searchItems}
        onSearchSubmit={handlePokemonSearch}
        onSearchFetchRequest={fetchSearchItems}
        showSuggestions
      />
      <FlatList
        data={pokemonList}
        keyExtractor={item => item.id}
        renderItem={renderPokemonCard}
        onEndReached={fetchNextPokemon}
        onEndReachedThreshold={0}
      />
    </>
  );
};

export default PokemonScreen;
