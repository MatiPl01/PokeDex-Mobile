import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navigation from '@core/navigation/Navigation';
import { StatusBar, useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import {
  selectCurrentTheme,
  selectCurrentThemeMode
} from '@store/theme/theme.selector';
import { setThemeName, setThemeMode } from '@store/theme/theme.actions';
import { ThemeMode, ThemeName } from '@store/theme/theme.types';
import { setFavoritePokemonIds } from '@store/favorites/favorites.actions';
import { selectFavoritePokemonIdsList } from '@store/favorites/favorites.selector';
import { catchAsync } from '@utils/errors';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectCurrentTheme);
  const themeMode = useSelector(selectCurrentThemeMode);
  const favoritesIdsList = useSelector(selectFavoritePokemonIdsList);
  const systemThemeMode = useColorScheme();

  useEffect(() => {
    loadThemeSettings();
    loadFavouritePokemonIds();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@favorites', JSON.stringify(favoritesIdsList));
  }, [favoritesIdsList]);

  const loadThemeSettings = catchAsync(async () => {
    const themeName = await AsyncStorage.getItem('@theme-name');
    const themeMode = await AsyncStorage.getItem('@theme-mode');

    if (
      themeName &&
      (Object.values(ThemeName) as string[]).includes(themeName)
    ) {
      dispatch(setThemeName(themeName as ThemeName));
    }
    if (
      themeMode &&
      (Object.values(ThemeMode) as string[]).includes(themeMode)
    ) {
      dispatch(setThemeMode(themeMode as ThemeMode));
    } else if (systemThemeMode) {
      dispatch(setThemeMode(systemThemeMode.toUpperCase() as ThemeMode));
    }
  });

  const loadFavouritePokemonIds = catchAsync(async () => {
    const favouritePokemonIds = await AsyncStorage.getItem('@favorites');
    if (favouritePokemonIds)
      dispatch(setFavoritePokemonIds(JSON.parse(favouritePokemonIds)));
  });

  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle={`${themeMode === ThemeMode.LIGHT ? 'dark' : 'light'}-content`}
      />
      <SafeAreaProvider>
        <StatusBar backgroundColor="transparent" translucent />
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default App;
