import styled from 'styled-components/native';
import { FlatList, FlatListProps } from 'react-native';
import { PokemonListItem } from '@store/pokemon/pokemon.types';

export const PokemonCardList = styled(
  FlatList as new (
    props: FlatListProps<PokemonListItem>
  ) => FlatList<PokemonListItem>
)`
  padding: 45px 15px;
`;

export const ListSeparator = styled.View`
  height: 30px;
`;
