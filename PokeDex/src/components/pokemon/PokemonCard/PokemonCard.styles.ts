import styled, { css } from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { Animated } from 'react-native';
import { SIZE } from '@constants';
import { flexCenter } from '@styles/shared';
import { PokemonType } from '@store/pokemon/pokemon.types';
import { CardFooter as DefaultCardFooter } from '@components/shared/styled/cards';
import { BarBackgroundWrapper as DefaultBackgroundGradientsWrapper } from '@components/shared/styled/backgrounds';

const BACKGROUND_HEIGH = 0.4 * SIZE.SCREEN.WIDTH;
const FOOTER_HEIGHT = 85;
const BACKGROUND_TEXT_WRAPPER_WIDTH = 1000; // Some really big value
const CARD_WIDTH = 0.8 * SIZE.SCREEN.WIDTH;
const GRADIENTS_WRAPPER_WIDTH = 1.2 * CARD_WIDTH;
export const MAX_IMAGE_WIDTH = 0.4 * SIZE.SCREEN.WIDTH;
export const MAX_IMAGE_HEIGHT = BACKGROUND_HEIGH;
export const CARD_HEIGHT = BACKGROUND_HEIGH + FOOTER_HEIGHT;

export const CardWrapper = styled(Animated.View)`
  border-radius: 5px;
  max-width: 100%;
  margin: 0 auto;
  width: ${CARD_WIDTH}px;
  ${({ theme }) => theme.shadow.box.medium.lg};
`;

export const BackgroundWrapper = styled.View`
  height: ${BACKGROUND_HEIGH}px;
  position: relative;
`;

export const CardFooter = styled(DefaultCardFooter)`
  height: ${FOOTER_HEIGHT}px;
`;

export const BackgroundTextWrapper = styled.View`
  position: absolute;
  left: 50%;
  width: ${BACKGROUND_TEXT_WRAPPER_WIDTH}px;
  height: ${BACKGROUND_HEIGH}px;
  transform: translateX(-${BACKGROUND_TEXT_WRAPPER_WIDTH / 2}px);
  ${flexCenter};
`;

export const BackgroundText = styled.Text`
  opacity: 0.3;
  text-transform: uppercase;
  transform: skew(-10deg, -5deg);
  font-size: ${SIZE.SCREEN.WIDTH / 7}px;

  ${({ theme }) => css`
    color: ${theme.color.background.primary};
    font-weight: ${theme.fontWeight.bold};
  `};
`;

export const PokemonId = styled.Text`
  position: absolute;

  ${({ theme }) => css`
    left: ${theme.space.lg}px;
    bottom: ${theme.space.lg}px;
    color: ${theme.color.text.primary};
    font-size: ${theme.fontSize.caption}px;
    font-weight: ${theme.fontWeight.bold};
  `};
`;

export const TypeBadgesWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

export const TypeBadgeWrapper = styled.View`
  margin: ${({ theme }) => theme.space.sm}px;
`;

export const BarBackgroundWrapper = styled(
  DefaultBackgroundGradientsWrapper
).attrs({ width: GRADIENTS_WRAPPER_WIDTH })``;

export const BackgroundGradient = styled(LinearGradient).attrs<{
  pokemonType: PokemonType;
}>(({ theme, pokemonType }) => {
  const pokemonTypeColors = theme.color.pokemonType[pokemonType];
  return {
    colors: [pokemonTypeColors.primary, pokemonTypeColors.secondary],
    start: { x: 0, y: 1 },
    end: { x: 1, y: 0 }
  };
})<{ pokemonType: PokemonType }>`
  flex-grow: 1;
  transform: skewX(-10deg);
  height: 100%;
  ${({ theme }) => theme.shadow.box.strong.lg};
`;

export const CardTitleSkeletonWrapper = styled.View`
  ${({ theme }) => css`
    height: ${theme.lineHeight.title - 4}px;
    margin: ${theme.space.xs}px;
    width: ${theme.size.xl}px;
  `};
`;

export const TypeBadgeSkeletonWrapper = styled(TypeBadgeWrapper)`
  ${({ theme }) => css`
    width: ${theme.size.lg}px;
    height: ${theme.fontSize.caption + 10}px;
  `};
`;

export const PokemonIdSkeletonWrapper = styled.View`
  ${({ theme }) => css`
    width: ${theme.size.sm}px;
    height: ${theme.fontSize.caption + 6}px;
  `};
`;

export const AddToFavoritesButtonWrapper = styled.View`
  position: absolute;

  ${({ theme }) => css`
    width: ${theme.size.xs}px;
    height: ${theme.size.xs}px;
    right: ${theme.space.lg}px;
    bottom: ${theme.space.lg}px;
  `};
`;
