import styled, { css } from 'styled-components/native';
import { flexCenter } from '@styles/shared';
import { SIZE } from '@constants';

export const Wrapper = styled.View`
  height: ${({ theme }) =>
    SIZE.SCREEN.HEIGHT - SIZE.LOGO_BAR.HEIGHT - 2 * theme.size.xxl}px;
  ${flexCenter};
`;

export const Heading = styled.Text`
  ${({ theme }) => css`
    color: ${theme.color.text.primary};
    font-size: ${theme.fontSize.title}px;
    font-weight: ${theme.fontWeight.bold};
  `};
`;

export const SubHeading = styled.Text`
  ${({ theme }) => css`
    color: ${theme.color.text.secondary};
    font-size: ${theme.fontSize.body}px;
    font-weight: ${theme.fontWeight.medium};
    width: ${0.6 * SIZE.SCREEN.WIDTH}px;
    text-align: center;
  `};
`;
