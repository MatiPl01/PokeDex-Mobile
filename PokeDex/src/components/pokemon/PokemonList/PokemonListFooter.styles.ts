import styled, { css } from 'styled-components/native';
import { flexCenter } from '@styles/shared';
import { SCREEN_HEIGHT } from '@core/splash-screen/SplashScreen';

export const FooterWrapper = styled.View`
  height: ${SCREEN_HEIGHT / 2}px;
  ${flexCenter};
`;

export const FooterLoaderWrapper = styled.View`
  position: relative;
  height: 175px;
  max-width: 320px;
  width: 100%;
  padding: 0 10px;
`;

export const FooterText = styled.Text`
  text-align: center;

  ${({ theme }) => css`
    font-size: ${theme.fontSize.title};
    font-weight: ${theme.fontWeight.medium};
    color: ${theme.color.text.primary};
  `};
`;
