import { Platform, Dimensions, StatusBar } from 'react-native';

export const SCREEN = {
  HEIGHT:
    Platform.OS === 'android' && Platform.Version > 26
      ? Dimensions.get('screen').height - (StatusBar.currentHeight || 0)
      : Dimensions.get('window').height,
  WIDTH: Dimensions.get('window').width
};

export const LOGO_BAR = {
  HEIGHT: 64
}
