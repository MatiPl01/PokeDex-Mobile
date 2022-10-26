import { DefaultTheme } from 'styled-components/native';
import { ThemeAction } from './theme.actions';
import { ThemeActionType, ThemeName, ThemeMode } from './theme.types';
import { cloneObj } from '@utils/data';
import { createTheme } from '@themes/utils';
import defaultTheme from '@themes/default';
import deepOceanTheme from '@themes/deep-ocean';
import grayscaleTheme from '@themes/grayscale';
import peacefulVioletTheme from '@themes/peaceful-violet';
import pinkyTwinkyTheme from '@themes/pinky-twinky';
import rainForestTheme from '@themes/rain-forest';
import shinyGoldTheme from '@themes/shiny-gold';
import tropicalIslandTheme from '@themes/tropical-island';

type ThemesConfig = Record<ThemeMode, Record<ThemeName, DefaultTheme>>;

const THEMES: ThemesConfig = {
  LIGHT: {
    DEEP_OCEAN: createTheme(deepOceanTheme, ThemeMode.LIGHT),
    DEFAULT: createTheme(defaultTheme, ThemeMode.LIGHT),
    GRAYSCALE: createTheme(grayscaleTheme, ThemeMode.LIGHT),
    PEACEFUL_VIOLET: createTheme(peacefulVioletTheme, ThemeMode.LIGHT),
    PINKY_TWINKY: createTheme(pinkyTwinkyTheme, ThemeMode.LIGHT),
    RAIN_FOREST: createTheme(rainForestTheme, ThemeMode.LIGHT),
    SHINY_GOLD: createTheme(shinyGoldTheme, ThemeMode.LIGHT),
    TROPICAL_ISLAND: createTheme(tropicalIslandTheme, ThemeMode.LIGHT)
  },
  DARK: {
    DEEP_OCEAN: createTheme(deepOceanTheme, ThemeMode.DARK),
    DEFAULT: createTheme(defaultTheme, ThemeMode.DARK),
    GRAYSCALE: createTheme(grayscaleTheme, ThemeMode.DARK),
    PEACEFUL_VIOLET: createTheme(peacefulVioletTheme, ThemeMode.DARK),
    PINKY_TWINKY: createTheme(pinkyTwinkyTheme, ThemeMode.DARK),
    RAIN_FOREST: createTheme(rainForestTheme, ThemeMode.DARK),
    SHINY_GOLD: createTheme(shinyGoldTheme, ThemeMode.DARK),
    TROPICAL_ISLAND: createTheme(tropicalIslandTheme, ThemeMode.DARK)
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

const handleThemeChange = (
  state: ThemeState,
  name: ThemeName,
  mode: ThemeMode
): ThemeState => {
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
