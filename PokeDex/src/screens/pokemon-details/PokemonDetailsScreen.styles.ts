import styled, { css } from 'styled-components/native';
import { absoluteFill, flexCenter } from '@styles/shared';
import DefaultProgressCircular from '@components/shared/react/ProgressCircular/ProgressCircular';

export const ScreenWrapper = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.primary};
`;

export const Row = styled.View`
  flex-direction: row;
  justify-content: center;
`;

export const SectionText = styled.Text`
  ${({ theme }) => css`
    color: ${theme.color.text.secondary};
    font-size: ${theme.fontSize.body}px;
  `};
`;

export const ProgressCircular = styled(DefaultProgressCircular).attrs(
  ({ theme }) => ({
    textColor: theme.color.text.tertiary,
    strokeColor: theme.color.accent.primary,
    strokeBackgroundColor: theme.color.accent.primary
  })
)``;

export const ItemsGridWrapper = styled.View`
  margin: ${({ theme }) => `0 -${theme.space.lg}px`};
`;

export const FullScreenCenterWrapper = styled.View`
  ${absoluteFill};
  ${flexCenter};
`;

export const InfoText = styled.Text`
  ${({ theme }) => css`
    color: ${theme.color.text.primary};
    font-size: ${theme.fontSize.title}px;
    font-weight: ${theme.fontWeight.bold};
    margin-bottom: ${theme.space.xl}px;
  `}
`;
