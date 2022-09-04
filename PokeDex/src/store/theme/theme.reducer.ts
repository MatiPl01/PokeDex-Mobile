import { DefaultTheme } from 'styled-components/native';
import { ThemeAction } from './theme.actions';
import { ThemeActionType, ThemeName, ThemeMode } from './theme.types';
import { cloneObj } from '@utils/data';
import { createTheme } from '@themes/utils';
import defaultTheme from '@themes/default';
import oceanTheme from '@themes/ocean';

type ThemesConfig = Record<ThemeMode, Record<ThemeName, DefaultTheme>>;

const THEMES: ThemesConfig = {
  LIGHT: {
    DEFAULT: createTheme(defaultTheme, ThemeMode.LIGHT),
    OCEAN: createTheme(oceanTheme, ThemeMode.LIGHT)
  },
  DARK: {
    DEFAULT: createTheme(defaultTheme, ThemeMode.DARK),
    OCEAN: createTheme(oceanTheme, ThemeMode.DARK)
  }
};

export type ThemeState = {
  readonly currentTheme: DefaultTheme;
  readonly themes: ThemesConfig;
  readonly name: ThemeName;
  readonly mode: ThemeMode;
};

const INITIAL_STATE: ThemeState = {
  currentTheme: cloneObj(THEMES.LIGHT.DEFAULT),
  themes: cloneObj(THEMES),
  name: ThemeName.DEFAULT,
  mode: ThemeMode.LIGHT
};

const handleThemeChange = (state: ThemeState, name: ThemeName, mode: ThemeMode): ThemeState => {
  let themeMode = ThemeMode.LIGHT;
  if (Object.values(ThemeMode).includes(mode)) themeMode = mode;
  return {
    ...state,
    currentTheme: cloneObj(THEMES[themeMode][name]),
    name,
    mode
  };
};

const themeReducer = (
  state = INITIAL_STATE,
  action: ThemeAction
): ThemeState => {
  switch (action.type) {
    case ThemeActionType.SET_THEME:
      return handleThemeChange(state, action.payload, state.mode);
    case ThemeActionType.SET_MODE:
      return handleThemeChange(state, state.name, action.payload);
    default:
      return state;
  }
};

export default themeReducer;
