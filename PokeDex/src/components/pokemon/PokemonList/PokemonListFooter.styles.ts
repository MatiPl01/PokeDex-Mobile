import styled, { css } from 'styled-components/native';
import { flexCenter } from '@styles/shared';
import { SIZE } from '@constants';

export const FooterWrapper = styled.View`
  height: ${SIZE.SCREEN.HEIGHT / 2}px;
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
    font-size: ${theme.fontSize.title}px;
    font-weight: ${theme.fontWeight.medium};
    color: ${theme.color.text.primary};
    line-height: ${theme.lineHeight.title}px;
  `};
`;
