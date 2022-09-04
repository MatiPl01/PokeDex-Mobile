import { Separator } from '@components/shared/styled/layout';
import styled, { css } from 'styled-components/native';

export const SettingsWrapper = styled.ScrollView`
  padding: ${({ theme }) => `${theme.space.xl}px ${theme.space.lg}px`};
`;

export const SettingsSection = styled.View``;

export const SectionSeparator = styled.View`
  ${({ theme }) => css`
    border-radius: 3px;
    margin: ${theme.space.lg}px 0;
    height: ${theme.space.sm}px;
    background-color: ${theme.color.background.tertiary};
  `};
`;

export const SectionHeading = styled.Text`
  ${({ theme }) => css`
    color: ${theme.color.text.secondary};
    font-size: ${theme.fontSize.title}px
    font-weight: ${theme.fontWeight.bold};
    line-height: ${theme.lineHeight.title}px;
    padding-bottom: ${theme.space.xs}px;
  `};
`;

export const SectionSubheading = styled.Text`
  ${({ theme }) => css`
    font-size: ${theme.fontSize.caption}px
    font-weight: ${theme.fontWeight.medium};
    line-height: ${theme.lineHeight.body}px;
    color: ${theme.color.text.tertiary};
  `};
`;

export const SettingsRow = styled.View`
  ${({ theme }) => css`
    border-top: 5px solid ${theme.color.text.primary};
    padding: ${theme.space.lg}px 0;
    flex-direction: row;
    align-items: center;
  `};
`;

export const ColumnSeparator = styled(Separator).attrs(({ theme }) => ({
  width: theme.space.lg
}))``;

export const SettingsText = styled.Text`
  ${({ theme }) => css`
    font-size: ${theme.fontSize.body}px;
    color: ${theme.color.text.primary};
  `};
`;
