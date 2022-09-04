import { DefaultTheme } from 'styled-components/native';

export enum ThemeName {
  DEFAULT = 'DEFAULT',
  OCEAN = 'OCEAN'
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
