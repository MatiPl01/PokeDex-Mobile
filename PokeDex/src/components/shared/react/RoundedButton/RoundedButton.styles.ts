import styled, { css } from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

export const Button = styled(TouchableOpacity)`
  border-radius: 20px;

  ${({ theme }) => css`
    background-color: ${theme.color.accent.primary};
  `};
`;

export const ButtonText = styled.Text`
  ${({ theme }) => css`
    color: ${theme.color.white};
    font-size: ${theme.fontSize.button}px;
    font-weight: ${theme.fontWeight.bold};
    padding: ${theme.space.md}px ${theme.space.lg}px;
  `};
`;
