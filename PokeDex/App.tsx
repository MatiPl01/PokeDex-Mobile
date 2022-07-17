import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ThemeTestScreen from './src/screens/theme-test/ThemeTestScreen';
import { selectTheme, selectThemeMode } from './src/store/theme/theme.selector';
import { ThemeMode } from './src/store/theme/theme.types';
import SplashScreen from './src/core/splash-screen/SplashScreen';
import { setThemeMode } from './src/store/theme/theme.actions';

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
        <SplashScreen>
          <ThemeTestScreen />
        </SplashScreen>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default App;
