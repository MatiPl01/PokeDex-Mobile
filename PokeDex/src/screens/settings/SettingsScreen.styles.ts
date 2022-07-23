import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.color.background.primary};
`;

export const TextContainer = styled.View`
  border: 1px solid #000;
  padding: 10px;
  border-radius: 5px;
`;

export const Text = styled.Text`
  color: ${({ theme }) => theme.color.text.primary};
  font-size: 24px;
  font-weight: 600;
`;

export const Button = styled.TouchableOpacity`
  margin: 32px 0;
  background-color: ${({ theme }) => theme.color.background.tertiary};
  padding: 10px 32px;
  border-radius: 5px;
`;

export const ButtonText = styled.Text`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.text.secondary};
`;
