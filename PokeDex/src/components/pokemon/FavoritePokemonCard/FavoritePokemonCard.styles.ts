import styled, { css } from 'styled-components/native';
import { flexCenter } from '@styles/shared';
import {
  CardFooter as PokemonCardFooter,
  CardTitle as PokemonCardTitle
} from '../PokemonCard/PokemonCard.styles';

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
`;
