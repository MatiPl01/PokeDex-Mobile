import styled, { css } from 'styled-components/native';
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
