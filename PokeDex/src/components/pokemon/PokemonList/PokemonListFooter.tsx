import React from 'react';
import LoadingSpinner from '@components/shared/react/LoadingSpinner/LoadingSpinner';
import {
  FooterWrapper,
  FooterLoaderWrapper,
  FooterText
} from './PokemonListFooter.styles';

type PokemonListFooter = {
  reachedEnd?: boolean;
};

const PokemonListFooter: React.FC<PokemonListFooter> = ({ reachedEnd }) => {
  return (
    <FooterWrapper>
      {!reachedEnd ? (
        <FooterLoaderWrapper>
          <FooterText>Fetching next Pokemon...</FooterText>
          <LoadingSpinner />
        </FooterLoaderWrapper>
      ) : (
        <FooterLoaderWrapper>
          <FooterText>There are no more Pokemon&nbsp;to&nbsp;load</FooterText>
        </FooterLoaderWrapper>
      )}
    </FooterWrapper>
  );
};

export default PokemonListFooter;
