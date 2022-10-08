import styled, { css } from 'styled-components/native';

export const SectionWrapper = styled.View`
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

export const SectionContent = styled.View`
  padding-top: ${({ theme }) => `${theme.space.md}px`};
`;
