const colors = {
  soft: 'rgba(0, 0, 0, .15)',
  normal: 'rgba(0, 0, 0, .25)',
  strong: 'rgba(0, 0, 0, .5)',
};

const sizes = {
  xs: '1.5px',
  sm: '5px',
  md: '15px',
  lg: '30px',
};

export default {
  soft: {
    xs: `0 0 ${sizes.xs} ${colors.soft}`,
    sm: `0 0 ${sizes.sm} ${colors.soft}`,
    md: `0 0 ${sizes.md} ${colors.soft}`,
    lg: `0 0 ${sizes.lg} ${colors.soft}`,
  },

  medium: {
    xs: `0 0 ${sizes.xs} ${colors.normal}`,
    sm: `0 0 ${sizes.sm} ${colors.normal}`,
    md: `0 0 ${sizes.md} ${colors.normal}`,
    lg: `0 0 ${sizes.lg} ${colors.normal}`,
  },

  strong: {
    xs: `0 0 ${sizes.xs} ${colors.strong}`,
    sm: `0 0 ${sizes.sm} ${colors.strong}`,
    md: `0 0 ${sizes.md} ${colors.strong}`,
    lg: `0 0 ${sizes.lg} ${colors.strong}`,
  },
};
