// TODO - this is a temporary settings screen
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { selectThemeMode, selectThemeName } from '@store/theme/theme.selector';
import { ThemeName, ThemeMode } from '@store/theme/theme.types';
import { setTheme, setThemeMode } from '@store/theme/theme.actions';
import { catchAsync } from '@utils/errors';
import {
  Container,
  TextContainer,
  Text,
  Button,
  ButtonText
} from './SettingsScreen.styles';

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
    saveThemeMode(newThemeMode);
  };

  const switchTheme = () => {
    const newThemeName =
      themeName === ThemeName.DEFAULT ? ThemeName.OCEAN : ThemeName.DEFAULT;
    dispatch(setTheme(newThemeName));
    saveThemeName(newThemeName);
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

export default ThemeTestScreen;
