import React from 'react';
// import { StatusBar } from 'react-native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import SplashScreen from './src/core/splash-screen/SplashScreen';
import ThemeTestScreen from './src/screens/theme-test/ThemeTestScreen';
import { ThemeProvider } from 'styled-components';
import { useSelector } from 'react-redux';
import { selectTheme } from './src/store/theme/theme.selector';

const App: React.FC = () => {
  const theme = useSelector(selectTheme);

  return (
    // <SafeAreaProvider>
    //   <StatusBar backgroundColor="transparent" translucent />
    //   <SplashScreen />
    // </SafeAreaProvider>

    <ThemeProvider theme={theme}>
      <ThemeTestScreen />
    </ThemeProvider>
  );
};

export default App;
