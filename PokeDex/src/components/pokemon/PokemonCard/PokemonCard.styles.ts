import styled, { css } from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { Animated } from 'react-native';
import { SCREEN } from '@constants';
import { flexCenter } from '@styles/shared';
import { PokemonType } from '@store/pokemon/pokemon.types';
import { CardFooter as DefaultCardFooter } from '@components/shared/styled/cards';
import { BackgroundGradientsWrapper as DefaultBackgroundGradientsWrapper } from '@components/shared/styled/backgrounds';

const BACKGROUND_HEIGH = 0.4 * SCREEN.WIDTH;
const FOOTER_HEIGHT = 85;
const BACKGROUND_TEXT_WRAPPER_WIDTH = 1000; // Some really big value
const CARD_WIDTH = 300;
const GRADIENTS_WRAPPER_WIDTH = 1.2 * CARD_WIDTH;
export const MAX_IMAGE_WIDTH = 0.4 * SCREEN.WIDTH;
export const MAX_IMAGE_HEIGHT = BACKGROUND_HEIGH;
export const CARD_HEIGHT = BACKGROUND_HEIGH + FOOTER_HEIGHT;
export const FAVORITES_BUTTON_SIZE = 20;

export const CardWrapper = styled(Animated.View)`
  border-radius: 5px;
  max-width: 100%;
  margin: 0 auto;
  width: ${CARD_WIDTH}px;
  ${({ theme }) => theme.shadow.medium.lg};
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
  font-size: ${SCREEN.WIDTH / 7}px;

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

export const BackgroundGradientsWrapper = styled(
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
  ${({ theme }) => theme.shadow.strong.lg};
`;

export const CardTitleSkeletonWrapper = styled.View`
  ${({ theme }) => css`
    height: ${theme.lineHeight.title - 4}px;
    margin: 2px;
    width: 100px;
  `};
`;

export const TypeBadgeSkeletonWrapper = styled(TypeBadgeWrapper)`
  ${({ theme }) => css`
    width: ${theme.size.lg}px;
    height: ${theme.fontSize.caption + 10}px;
  `};
`;

export const PokemonIdSkeletonWrapper = styled.View`
  height: ${FAVORITES_BUTTON_SIZE}px;
  width: ${({ theme }) => theme.size.sm}px;
`;

export const AddToFavoritesButtonWrapper = styled.View`
  position: absolute;
  width: ${FAVORITES_BUTTON_SIZE}px;
  height: ${FAVORITES_BUTTON_SIZE}px;

  ${({ theme }) => css`
    right: ${theme.space.lg}px;
    bottom: ${theme.space.lg}px;
    color: ${theme.color.text.primary}px;
  `};
`;
