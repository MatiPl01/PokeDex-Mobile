import styled, { css } from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgUri } from 'react-native-svg';
import { flexCenter } from '@styles/shared';
import { PokemonType } from '@store/pokemon/pokemon.types';
import { SCREEN_WIDTH } from '@core/splash-screen/SplashScreen';
import { TYPE_BADGE_WIDTH } from '../PokemonTypeBadge/PokemonTypeBadge.styles';

const BACKGROUND_HEIGH = 0.4 * SCREEN_WIDTH;
const BACKGROUND_TEXT_WRAPPER_WIDTH = 1000; // Some really big value
const MAX_IMAGE_WIDTH = 0.4 * SCREEN_WIDTH;
const MAX_IMAGE_HEIGHT = BACKGROUND_HEIGH;
const CARD_WIDTH = 300;
const GRADIENTS_WRAPPER_WIDTH = 1.2 * CARD_WIDTH;

export const CardWrapper = styled.View`
  border-radius: 5px;
  max-width: 100%;
  width: ${CARD_WIDTH}px;
  margin: 0 auto;
  ${({ theme }) => theme.shadow.medium.lg};
`;

export const BackgroundWrapper = styled.View`
  height: ${BACKGROUND_HEIGH}px;
  position: relative;
`;

export const CardFooter = styled.View`
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  align-items: center;
  ${({ theme }) => css`
    padding: ${theme.space.md};
    background-color: ${theme.color.background.primary};
  `};
`;

export const PokemonSvg = styled(SvgUri).attrs({
  height: MAX_IMAGE_HEIGHT,
  width: MAX_IMAGE_WIDTH
})`
  position: absolute;
  z-index: 1;
  left: 50%;
  transform: translateX(-${MAX_IMAGE_WIDTH / 2}px);
  ${({ theme }) => css`
    bottom: ${theme.space.lg};
    ${theme.shadow.medium.md};
  `};
`;

export const BackgroundClip = styled.View`
  width: 100%;
  height: 100%;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  overflow: hidden;
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
  font-size: ${SCREEN_WIDTH / 7}px;
  ${({ theme }) => css`
    color: ${theme.color.background.primary};
    font-weight: ${theme.fontWeight.bold};
  `};
`;

export const CardTitle = styled.Text`
  text-transform: capitalize;

  ${({ theme }) => css`
    line-height: ${theme.lineHeight.title};
    font-size: ${theme.fontSize.title};
    font-weight: ${theme.fontWeight.bold};
    color: ${theme.color.text.primary};
    margin-bottom: ${theme.space.md};
    ${theme.shadow.medium
      .md}; // TODO - create text shadows separate from the background shadows
  `};
`;

export const TypeBadgesWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

export const TypeBadgeWrapper = styled.View`
  margin: ${({ theme }) => theme.space.sm};
`;

export const BackgroundGradientsWrapper = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  flex-direction: row;
  transform: translateX(-${GRADIENTS_WRAPPER_WIDTH / 2}px);
  width: ${GRADIENTS_WRAPPER_WIDTH}px;
`;

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
    height: ${`${parseInt(theme.lineHeight.title) - 4}px`};
    margin: 2px;
    width: 100px;
  `};
`;

export const TypeBadgeSkeletonWrapper = styled(TypeBadgeWrapper)`
  width: ${TYPE_BADGE_WIDTH}px;
  height: ${({ theme }) => `${parseInt(theme.fontSize.caption) + 10}px`};
`;
