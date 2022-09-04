import { ThemeActionType, ThemeName, ThemeMode } from './theme.types';
import { ActionWithPayload, createAction } from '@store/utils';

type SetTheme = ActionWithPayload<ThemeActionType.SET_THEME, ThemeName>;

type SetThemeMode = ActionWithPayload<ThemeActionType.SET_MODE, ThemeMode>;

export type ThemeAction = SetTheme | SetThemeMode;

export const setThemeName = (theme: ThemeName): SetTheme =>
  createAction(ThemeActionType.SET_THEME, theme);

export const setThemeMode = (mode: ThemeMode): SetThemeMode =>
  createAction(ThemeActionType.SET_MODE, mode);
