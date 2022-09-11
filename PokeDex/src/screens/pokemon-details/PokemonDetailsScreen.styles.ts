import styled, { css } from 'styled-components/native';
import DefaultProgressCircular from '@components/shared/react/ProgressCircular/ProgressCircular';

export const Row = styled.View`
  flex-direction: row;
  justify-content: center;
`;

export const DetailsSection = styled.View`
  ${({ theme }) => css`
    padding: ${theme.space.md}px ${theme.space.lg}px;
  `};
`;

export const SectionHeading = styled.Text`
  ${({ theme }) => css`
    color: ${theme.color.text.primary};
    font-size: ${theme.fontSize.title}px;
    font-weight: ${theme.fontWeight.bold};
    margin-bottom: ${theme.space.md}px;
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
