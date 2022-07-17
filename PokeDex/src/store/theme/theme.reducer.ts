import { createTheme } from './../../themes/utils';
import { ThemeAction } from './theme.actions';
import { ThemeActionType, ThemeName, ThemeMode } from './theme.types';
import defaultTheme from '../../themes/default';
import oceanTheme from '../../themes/ocean';

export type ThemeState = {
  readonly theme: any; // TODO - create theme object type
  readonly name: ThemeName;
  readonly mode: ThemeMode;
};

const INITIAL_STATE: ThemeState = {
  theme: defaultTheme[ThemeMode.LIGHT], // TODO - set based on the system preference
  name: ThemeName.DEFAULT,
  mode: ThemeMode.LIGHT // TODO - set based on the system preference
};

// TODO - add return type (add theme type declarations)
const chooseTheme = (name: ThemeName, mode: ThemeMode): ThemeState => {
  let themeMode = ThemeMode.LIGHT;
  if (Object.values(ThemeMode).includes(mode)) themeMode = mode;

  switch (name) {
    case ThemeName.OCEAN:
      return { mode: themeMode, name, theme: createTheme(oceanTheme, themeMode) };
    default:
      return { mode: themeMode, name, theme: createTheme(defaultTheme, themeMode) };
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
