import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { PokemonType } from '@store/pokemon/pokemon.types';
import { absoluteFill, flexCenter } from '@styles/shared';

export const ImageWrapper = styled.View`
  flex: 1;
  ${flexCenter}
`;

export const ImageTextWrapper = styled.View<{ top: number }>`
  ${({ theme, top }) => css`
    height: ${theme.size.sm}px;
    top: ${top + theme.space.lg}px;
    margin-bottom: ${theme.space.xxl}px;
    ${flexCenter};
  `}
`;

export const ImageText = styled.Text<{
  size?: 'small' | 'large';
  light?: boolean;
}>`
  ${({ theme, size, light }) => css`
    color: ${light ? theme.color.white : theme.color.text.primary};
    font-weight: ${theme.fontWeight.bold};
    font-size: ${size === 'large'
      ? theme.fontSize.title
      : theme.fontSize.body}px;
    ${theme.shadow.text.soft.sm};
  `};
`;

export const AnimatedGradientWrapper = styled(Animated.View)`
  ${absoluteFill};
`;

export const BackgroundGradient = styled(LinearGradient).attrs<{
  pokemonType: PokemonType;
}>(({ theme, pokemonType }) => {
  const typeColors = theme.color.pokemon.type[pokemonType];
  return {
    colors: [typeColors.primary, typeColors.secondary],
    start: { x: 0, y: 1 },
    end: { x: 1, y: 0 }
  };
})<{ pokemonType: PokemonType }>`
  opacity: 0.25;
  transform: scale(1.1);
  ${absoluteFill};
`;
