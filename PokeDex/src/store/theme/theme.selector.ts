import { createSelector } from 'reselect';
import { ThemeState } from './theme.reducer';
import { ThemeWithName } from './theme.types';
import { RootState } from '..';

const selectCurrentThemeState = (state: RootState): ThemeState => state.theme;

export const selectThemesObject = createSelector(
  selectCurrentThemeState,
  ({ themes }) => themes
);

export const selectCurrentTheme = createSelector(
  selectCurrentThemeState,
  ({ currentTheme }) => currentTheme
);

export const selectCurrentThemeMode = createSelector(
  selectCurrentThemeState,
  ({ mode }) => mode
);

export const selectCurrentThemeName = createSelector(
  selectCurrentThemeState,
  ({ name }) => name
);

export const selectCurrentModeThemesObject = createSelector(
  [selectThemesObject, selectCurrentThemeMode],
  (themesObj, themeMode) => themesObj[themeMode]
);

export const selectCurrentModeThemesList = createSelector(
  selectCurrentModeThemesObject,
  themesObj =>
    Object.entries(themesObj)
      .sort((entry1, entry2) => +(entry1[0] > entry2[0]))
      .map(([themeName, themeObj]) => {
        return {
          name: themeName.toUpperCase(),
          theme: themeObj
        } as ThemeWithName;
      })
);

