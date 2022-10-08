import styled, { css } from 'styled-components/native';
import { SIZE } from '@constants';
import { flexCenter } from '@styles/shared';

export const Wrapper = styled.View`
  flex: 1;
  ${flexCenter};
`;

const Text = styled.Text`
  max-width: ${0.9 * SIZE.SCREEN.WIDTH}px;
  text-align: center;
`;

export const TextPrimary = styled(Text)`
  ${({ theme }) => css`
    font-size: ${theme.fontSize.title}px;
    font-weight: ${theme.fontWeight.medium};
    color: ${theme.color.text.primary};
    line-height: ${theme.lineHeight.title}px;
  `}
`;

export const TextSecondary = styled(Text)`
  ${({ theme }) => css`
    font-size: ${theme.fontSize.body}px;
    font-weight: ${theme.fontWeight.medium};
    color: ${theme.color.text.tertiary};
    line-height: ${theme.lineHeight.body}px;
  `}
`;
