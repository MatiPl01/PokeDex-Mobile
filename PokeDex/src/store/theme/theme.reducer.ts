import { DefaultTheme } from 'styled-components/native';
import { createTheme } from '@themes/utils';
import defaultTheme from '@themes/default';
import oceanTheme from '@themes/ocean';
import { ThemeAction } from './theme.actions';
import { ThemeActionType, ThemeName, ThemeMode } from './theme.types';

export type ThemeState = {
  readonly theme: DefaultTheme;
  readonly name: ThemeName;
  readonly mode: ThemeMode;
};

const INITIAL_STATE: ThemeState = {
  theme: createTheme(defaultTheme, ThemeMode.LIGHT),
  name: ThemeName.DEFAULT,
  mode: ThemeMode.LIGHT
};

const chooseTheme = (name: ThemeName, mode: ThemeMode): ThemeState => {
  let themeMode = ThemeMode.LIGHT;
  if (Object.values(ThemeMode).includes(mode)) themeMode = mode;

  switch (name) {
    case ThemeName.OCEAN:
      return {
        mode: themeMode,
        name,
        theme: createTheme(oceanTheme, themeMode)
      };
    default:
      return {
        mode: themeMode,
        name,
        theme: createTheme(defaultTheme, themeMode)
      };
  }
};

const themeReducer = (
  state = INITIAL_STATE,
  action: ThemeAction
): ThemeState => {
  switch (action.type) {
    case ThemeActionType.SET_THEME:
      return chooseTheme(action.payload, state.mode);
    case ThemeActionType.SET_MODE:
      return chooseTheme(state.name, action.payload);
    default:
      return state;
  }
};

export default themeReducer;
