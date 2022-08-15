import styled, { css } from 'styled-components/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { flexCenter, absoluteFill } from '@styles/shared';
import {
  CardFooter as PokemonCardFooter,
  CardTitle as PokemonCardTitle
} from '@components/pokemon/PokemonCard/PokemonCard.styles';
import { SearchButtonWrapper } from '@components/shared/SearchBar/SearchBar.styles';

const DELETE_BUTTON_SIZE = 40;
const DELETE_ICON_SIZE = 25;

export const CardWrapper = styled.View`
  height: 100%;
  border-radius: 5px;

  ${({ theme }) => css`
    background-color: ${theme.color.background.primary};
    ${theme.shadow.medium.md}
  `};
`;

export const BackgroundWrapper = styled.View`
  height: 75%;
  position: relative;
`;

export const CardFooter = styled(PokemonCardFooter)`
  height: 25%;
  ${flexCenter};
`;

export const CardTitle = styled(PokemonCardTitle)`
  ${({ theme }) => css`
    font-size: ${theme.fontSize.body};
    line-height: ${theme.lineHeight.body};
    margin-bottom: 0;
  `}
`;

export const PokemonImageWrapper = styled.View`
  ${({ theme }) => theme.shadow.medium.md};
  ${absoluteFill};
`;

export const CardTitleSkeletonWrapper = styled.View<{ width: number }>`
  ${({ theme, width }) => css`
    height: ${`${parseInt(theme.lineHeight.body)}px`};
    width: ${width}px;
    margin: 2px;
  `};
`;

export const DeleteButtonWrapper = styled(SearchButtonWrapper).attrs({
  displayShadow: true
})`
  top: ${-DELETE_BUTTON_SIZE / 4}px;
  right: ${-DELETE_BUTTON_SIZE / 4}px;
  width: ${DELETE_BUTTON_SIZE}px;
  height: ${DELETE_BUTTON_SIZE}px;
  ${flexCenter};
`;

export const DeleteButtonIcon = styled(MaterialIcon).attrs({
  size: DELETE_ICON_SIZE,
  name: 'delete'
})`
  ${({ theme }) => css`
    color: ${theme.color.white};
    ${theme.shadow.strong.sm};
  `};
`;
