import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { selectTheme, selectThemeMode } from '@store/theme/theme.selector';
import { setTheme, setThemeMode } from '@store/theme/theme.actions';
import { ThemeMode, ThemeName } from '@store/theme/theme.types';
import DrawerNavigation from '@core/navigation/DrawerNavigation';
import { catchAsync } from '@utils/errors';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const themeMode = useSelector(selectThemeMode);
  const systemThemeMode = useColorScheme() as ThemeMode;

  useEffect(() => {
    loadThemeSettings();
  }, []);

  const loadThemeSettings = catchAsync(async () => {
    const themeName = await AsyncStorage.getItem('@theme-name');
    const themeMode = await AsyncStorage.getItem('@theme-mode');

    if (
      themeName &&
      (Object.values(ThemeName) as string[]).includes(themeName)
    ) {
      dispatch(setTheme(themeName as ThemeName));
    }
    if (
      themeMode &&
      (Object.values(ThemeMode) as string[]).includes(themeMode)
    ) {
      dispatch(setThemeMode(themeMode as ThemeMode));
    } else {
      dispatch(setThemeMode(systemThemeMode));
    }
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
          <DrawerNavigation />
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default App;
