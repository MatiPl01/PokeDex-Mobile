import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { selectTheme, selectThemeMode } from './src/store/theme/theme.selector';
import { ThemeMode } from './src/store/theme/theme.types';
import { setThemeMode } from './src/store/theme/theme.actions';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from './src/core/navigation/DrawerNavigation';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const systemThemeMode = useColorScheme() as ThemeMode;
  const theme = useSelector(selectTheme);
  const themeMode = useSelector(selectThemeMode);

  useEffect(() => {
    // TODO - preserve theme settings with async storage
    dispatch(setThemeMode(systemThemeMode));
  }, []);

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
