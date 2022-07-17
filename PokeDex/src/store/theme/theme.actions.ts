import { ThemeActionType, ThemeName, ThemeMode } from './theme.types';
import { ActionWithPayload, createAction } from '../utils';

type SetTheme = ActionWithPayload<ThemeActionType.SET_THEME, ThemeName>;

type SetThemeMode = ActionWithPayload<ThemeActionType.SET_MODE, ThemeMode>;

export type ThemeAction = SetTheme | SetThemeMode;

export const setTheme = (theme: ThemeName) =>
  createAction(ThemeActionType.SET_THEME, theme);

export const setThemeMode = (mode: ThemeMode) =>
  createAction(ThemeActionType.SET_MODE, mode);
