import React from 'react';
import LoadingSpinner from '@components/shared/react/LoadingSpinner/LoadingSpinner';
import {
  FooterWrapper,
  FooterLoaderWrapper,
  FooterText
} from './FavoritesGridFooter.styles';

const FavoritesGridFooter: React.FC = () => (
  <FooterWrapper>
    <FooterText>Fetching favorite Pokemon...</FooterText>
    <FooterLoaderWrapper>
      <LoadingSpinner />
    </FooterLoaderWrapper>
  </FooterWrapper>
);

export default FavoritesGridFooter;
