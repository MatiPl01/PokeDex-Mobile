import React from 'react';
import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@core/navigation/Navigation';
import { Separator } from '@components/shared/styled/layout';
import RoundedButton from '@components/shared/react/RoundedButton/RoundedButton';
import {
  Wrapper,
  TextPrimary,
  TextSecondary
} from './NoFavoritePokemon.styles';

const NoFavoritePokemon: React.FC = () => {
  const theme = useTheme();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'Pokemon'>>();

  return (
    <Wrapper>
      <TextPrimary>You don&apos;t have any favorite Pokemon</TextPrimary>
      <Separator height={theme.space.md} />
      <TextSecondary>
        To search for Pokemon click the button below
      </TextSecondary>
      <Separator height={theme.space.xl} />
      <RoundedButton onPress={() => navigation.push('Pokemon')}>
        Find favorite Pokemon
      </RoundedButton>
    </Wrapper>
  );
};

export default NoFavoritePokemon;
