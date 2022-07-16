import colors from '../shared/colors';

export default {
  dark: {
    text: {
      primary: colors.white,
      secondary: colors.gray.light[0],
      tertiary: colors.gray.light[1],
    },
    background: {
      primary: colors.gray.dark[1],
      secondary: colors.gray.dark[2],
      tertiary: colors.gray.dark[3],
    },
  },

  light: {
    text: {
      primary: colors.black,
      secondary: colors.gray.dark[1],
      tertiary: colors.gray.dark[2],
    },
    background: {
      primary: colors.white,
      secondary: colors.gray.light[1],
      tertiary: colors.gray.light[2],
    },
  },
};
