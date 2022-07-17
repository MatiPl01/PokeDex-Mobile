import React from 'react';
import styled from 'styled-components/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectThemeMode,
  selectThemeName
} from '../../store/theme/theme.selector';
import { ThemeMode, ThemeName } from '../../store/theme/theme.types';
import { setTheme, setThemeMode } from '../../store/theme/theme.actions';

const ThemeTestScreen: React.FC = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const themeName = useSelector(selectThemeName);

  const toggleThemeMode = () => {
    dispatch(
      setThemeMode(
        themeMode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK
      )
    );
  };

  const switchTheme = () => {
    dispatch(
      setTheme(
        themeName === ThemeName.DEFAULT ? ThemeName.OCEAN : ThemeName.DEFAULT
      )
    );
  };

  return (
    <Container>
      <TextContainer>
        <Text>Switching theme with Redux</Text>
      </TextContainer>

      <Button onPress={toggleThemeMode}>
        <ButtonText>
          Change to {themeMode === ThemeMode.DARK ? 'light' : 'dark'} mode
        </ButtonText>
      </Button>

      <Button onPress={switchTheme}>
        <ButtonText>
          Change to {themeName === ThemeName.DEFAULT ? 'ocean' : 'default'} theme
        </ButtonText>
      </Button>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const TextContainer = styled.View`
  border: 1px solid #000;
  padding: 10px;
  border-radius: 5px;
`;

const Text = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 24px;
  font-weight: 600;
`;

const Button = styled.TouchableOpacity`
  margin: 32px 0;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  padding: 10px 32px;
  border-radius: 5px;
`;

const ButtonText = styled.Text`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export default ThemeTestScreen;
