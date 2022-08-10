import styled from 'styled-components/native';
import ReAnimated from 'react-native-reanimated';
import { FlatList, FlatListProps, Animated, View } from 'react-native';
import { SinglePokemonState } from '@store/pokemon/pokemon.reducer';

export const LIST_SEPARATOR_HEIGHT = 30;
export const POKEMON_LIST_PADDING_HORIZONTAL = 15;

export const CardListWrapper = styled.View`
  flex: 1;
  position: relative;
`;

export const CardList = styled(
  Animated.FlatList as new (
    props: FlatListProps<SinglePokemonState>
  ) => FlatList<SinglePokemonState>
)`
  padding: 45px ${POKEMON_LIST_PADDING_HORIZONTAL}px;
`;

export const ListSeparator = styled.View`
  height: ${LIST_SEPARATOR_HEIGHT}px;
`;

export const EmptyListFooter = styled.View`
  height: 100px;
`;

export const PokemonListHeader = ReAnimated.createAnimatedComponent(View);
