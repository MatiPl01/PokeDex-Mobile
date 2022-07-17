import { createSelector } from 'reselect';
import { ThemeState } from './theme.reducer';
import { RootState } from './../store';

const selectThemeState = (state: RootState): ThemeState => state.theme;

export const selectTheme = createSelector(
  [selectThemeState],
  ({ theme }) => theme
);

export const selectThemeMode = createSelector(
  [selectThemeState],
  ({ mode }) => mode
);

export const selectThemeName = createSelector(
  [selectThemeState],
  ({ name }) => name
);
