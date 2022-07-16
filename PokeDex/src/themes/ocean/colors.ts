import colors from '../shared/colors';

export default {
  dark: {
    text: {
      primary: colors.white,
      secondary: colors.gray.light[0],
      tertiary: colors.gray.light[1],
    },
    background: {
      primary: '#04192A',
      secondary: '#021E33',
      tertiary: '#032742',
    },
  },

  light: {
    text: {
      primary: colors.black,
      secondary: colors.gray.dark[1],
      tertiary: colors.gray.dark[2],
    },
    background: {
      primary: '#9BCEF5',
      secondary: '#5EB2F2',
      tertiary: '#2699F2',
    },
  },
};
