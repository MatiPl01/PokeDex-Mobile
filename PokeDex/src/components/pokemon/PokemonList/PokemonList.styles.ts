import styled from 'styled-components/native';
import { Animated, FlatList, FlatListProps } from 'react-native';
import { SinglePokemonState } from '@store/pokemon/pokemon.reducer';

export const CardListWrapper = styled.View`
  flex: 1;
  position: relative;
`;

export const CardList = styled(
  Animated.FlatList as new (
    props: FlatListProps<SinglePokemonState>
  ) => FlatList<SinglePokemonState>
)`
  padding: 45px ${({ theme }) => theme.space.lg}px;
`;

export const EmptyListFooter = styled.View`
  height: ${({ theme }) => theme.size.xl};
`;
