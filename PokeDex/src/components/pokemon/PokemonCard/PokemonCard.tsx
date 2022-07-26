import React from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from 'styled-components/native';
import { RootState } from '@store';
import { PokemonType } from '@store/pokemon/pokemon.types';
import { selectSinglePokemonState } from '@store/pokemon/pokemon.selector';
import {
  CardWrapper,
  BackgroundWrapper,
  BackgroundGradient,
  BackgroundGradientsWrapper,
  CardFooter,
  PokemonSvg,
  BackgroundClip,
  BackgroundTextWrapper,
  BackgroundText,
  CardTitle,
  TypeBadgesWrapper,
  TypeBadgeWrapper
} from './PokemonCard.styles';
import PokemonTypeBadge from '../PokemonTypeBadge/PokemonTypeBadge';

type PokemonCardProps = {
  pokemonId: string;
};

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemonId }) => {
  // TODO = implement skeleton animation on loading

  const theme = useTheme();
  const { pokemon, isLoading } = useSelector((state: RootState) =>
    selectSinglePokemonState(state, pokemonId)
  );

  if (!pokemon) return <Text>loading...</Text>;
  const { id, name, types, imageUrl } = pokemon;

  return (
    <CardWrapper>
      <BackgroundWrapper>
        <BackgroundClip>
          <BackgroundTextWrapper>
            <BackgroundText numberOfLines={1} ellipsizeMode="clip">
              {name}
            </BackgroundText>
          </BackgroundTextWrapper>
          <BackgroundGradientsWrapper>
            {types.map((type: PokemonType) => (
                <BackgroundGradient
                  pokemonType={type}
                  key={`${id}-${type}-gradient`}
                  colors={[]}
                />
              ))}
          </BackgroundGradientsWrapper>
        </BackgroundClip>
        <PokemonSvg uri={imageUrl} />
      </BackgroundWrapper>
      <CardFooter>
        <CardTitle>{name}</CardTitle>
        <TypeBadgesWrapper>
          {types.map((type: PokemonType) => (
            <TypeBadgeWrapper key={`${id}-${type}-badge`}>
              <PokemonTypeBadge type={type} />
            </TypeBadgeWrapper>
          ))}
        </TypeBadgesWrapper>
      </CardFooter>
    </CardWrapper>
  );
};

export default PokemonCard;
