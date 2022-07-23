import _ from 'lodash';
import shared from './shared';
import defaultTheme from './default';
import { ThemeMode } from '@store/theme/theme.types';
import {
  DefaultTheme,
  ThemeColors,
  ThemeFontWeights,
  ThemeFontSizes,
  ThemeShadows,
  ThemeSizes,
  ThemeLineHeights,
  ThemeSpaces
} from 'styled-components/native';

interface PartialTheme {
  color?: Partial<ThemeColors>;
  fontWeight?: Partial<ThemeFontWeights>;
  fontSize?: Partial<ThemeFontSizes>;
  shadow?: Partial<ThemeShadows>;
  size?: Partial<ThemeSizes>;
  lineHeight?: Partial<ThemeLineHeights>;
  space?: Partial<ThemeSpaces>;
}

export const createTheme = (
  theme: { light: PartialTheme; dark: PartialTheme },
  mode: ThemeMode
): DefaultTheme => {
  return _.merge({}, shared, defaultTheme[mode], theme[mode]) as DefaultTheme;
};
