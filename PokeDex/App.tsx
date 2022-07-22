import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { selectTheme, selectThemeMode } from './src/store/theme/theme.selector';
import { ThemeMode, ThemeName } from './src/store/theme/theme.types';
import { setTheme, setThemeMode } from './src/store/theme/theme.actions';
import { NavigationContainer } from '@react-navigation/native';
import { catchAsync } from '@utils/errors';
import DrawerNavigation from '@core/navigation/DrawerNavigation'; // TODO - fix path aliases
import AsyncStorage from '@react-native-async-storage/async-storage';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const themeMode = useSelector(selectThemeMode);
  const sytemThemeMode = useColorScheme() as ThemeMode;

  useEffect(() => {
    loadThemeSettings();
  }, []);

  const loadThemeSettings = catchAsync(async () => {
    const themeName = await AsyncStorage.getItem('@theme-name');
    const themeMode = await AsyncStorage.getItem('@theme-mode');
    console.log({ themeName, themeMode });

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
      dispatch(setThemeMode(sytemThemeMode));
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
