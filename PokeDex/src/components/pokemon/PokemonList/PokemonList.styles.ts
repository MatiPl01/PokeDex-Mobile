import styled from 'styled-components/native';
import { FlatList, FlatListProps, Animated } from 'react-native';
import { SinglePokemonState } from '@store/pokemon/pokemon.reducer';

export const LIST_SEPARATOR_HEIGHT = 30;

export const CardListWrapper = styled.View`
  flex: 1;
  position: relative;
`;

export const CardList = styled(
  Animated.FlatList as new (
    props: FlatListProps<SinglePokemonState>
  ) => FlatList<SinglePokemonState>
)`
  padding: 45px 15px;
`;

export const ListSeparator = styled.View`
  height: ${LIST_SEPARATOR_HEIGHT}px;
`;
