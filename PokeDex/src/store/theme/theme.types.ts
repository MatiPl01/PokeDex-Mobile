import { DefaultTheme } from 'styled-components/native';

export enum ThemeName {
  DEFAULT = 'DEFAULT',
  GRAYSCALE = 'GRAYSCALE',
  DEEP_OCEAN = 'DEEP_OCEAN',
  PEACEFUL_VIOLET = 'PEACEFUL_VIOLET',
  PINKY_TWINKY = 'PINKY_TWINKY',
  RAIN_FOREST = 'RAIN_FOREST',
  SHINY_GOLD = 'SHINY_GOLD',
  TROPICAL_ISLAND = 'TROPICAL_ISLAND'
}

export enum ThemeMode {
  DARK = 'DARK',
  LIGHT = 'LIGHT'
}

export enum ThemeActionType {
  SET_THEME = 'theme/SET_THEME',
  SET_MODE = 'theme/SET_MODE'
}

export type ThemeWithName = {
  name: ThemeName;
  theme: DefaultTheme;
};
