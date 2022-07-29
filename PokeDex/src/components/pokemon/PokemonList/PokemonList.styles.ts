import styled from 'styled-components/native';
import { FlatList, FlatListProps } from 'react-native';
import Animated from 'react-native-reanimated';
import { PokemonListItem } from '@store/pokemon/pokemon.types';
import { SCREEN_HEIGHT } from '@core/splash-screen/SplashScreen';

export const CardListWrapper = styled.View`
  flex: 1;
  position: relative;
`;

export const CardList = styled(
  Animated.createAnimatedComponent(
    FlatList as new (
      props: FlatListProps<PokemonListItem>
    ) => FlatList<PokemonListItem>
  )
)`
  padding: 45px 15px ${SCREEN_HEIGHT}px 15px;
`;

export const ListSeparator = styled.View`
  height: 30px;
`;
