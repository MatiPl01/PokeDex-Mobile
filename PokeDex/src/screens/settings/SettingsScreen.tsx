// TODO - this is a temporary settings screen
import React from 'react';
import styled from 'styled-components/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectThemeMode,
  selectThemeName
} from '../../store/theme/theme.selector';
import { ThemeName, ThemeMode } from '../../store/theme/theme.types';
import { setTheme, setThemeMode } from '../../store/theme/theme.actions';
import { catchAsync } from '@utils/errors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeTestScreen: React.FC = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const themeName = useSelector(selectThemeName);

  const saveThemeMode = catchAsync(async (themeMode: ThemeMode) => {
    await AsyncStorage.setItem('@theme-mode', themeMode);
  });

  const saveThemeName = catchAsync(async (themeName: ThemeName) => {
    await AsyncStorage.setItem('@theme-name', themeName);
  });

  const toggleThemeMode = () => {
    const newThemeMode =
      themeMode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK;
    dispatch(setThemeMode(newThemeMode));
    saveThemeMode(newThemeMode as string);
  };

  const switchTheme = () => {
    const newThemeName =
      themeName === ThemeName.DEFAULT ? ThemeName.OCEAN : ThemeName.DEFAULT;
    dispatch(setTheme(newThemeName));
    saveThemeName(newThemeName as string);
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
          Change to {themeName === ThemeName.DEFAULT ? 'ocean' : 'default'}{' '}
          theme
        </ButtonText>
      </Button>
    </Container>
  );
};

// TODO - fix theme types not being recognized by TypeScript
const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.color.background.primary};
`;

const TextContainer = styled.View`
  border: 1px solid #000;
  padding: 10px;
  border-radius: 5px;
`;

const Text = styled.Text`
  color: ${({ theme }) => theme.color.text.primary};
  font-size: 24px;
  font-weight: 600;
`;

const Button = styled.TouchableOpacity`
  margin: 32px 0;
  background-color: ${({ theme }) => theme.color.background.tertiary};
  padding: 10px 32px;
  border-radius: 5px;
`;

const ButtonText = styled.Text`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.text.secondary};
`;

export default ThemeTestScreen;
