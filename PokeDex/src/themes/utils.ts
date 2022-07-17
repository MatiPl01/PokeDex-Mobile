import { ThemeMode } from './../store/theme/theme.types';
import shared from './shared';
import defaultTheme from './default';
import _ from 'lodash';

export const createTheme = (theme: any, mode: ThemeMode): any => {
  // TODO - add theme types
  return _.merge(shared, defaultTheme[mode], theme[mode]);
};
