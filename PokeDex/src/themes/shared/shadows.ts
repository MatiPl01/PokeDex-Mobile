const color = {
  soft: 'rgba(0, 0, 0, .15)',
  normal: 'rgba(0, 0, 0, .25)',
  strong: 'rgba(0, 0, 0, .5)'
};

const size = {
  xs: '1.5px',
  sm: '5px',
  md: '15px',
  lg: '30px'
};

export default {
  soft: {
    xs: `0 0 ${size.xs} ${color.soft}`,
    sm: `0 0 ${size.sm} ${color.soft}`,
    md: `0 0 ${size.md} ${color.soft}`,
    lg: `0 0 ${size.lg} ${color.soft}`
  },

  medium: {
    xs: `0 0 ${size.xs} ${color.normal}`,
    sm: `0 0 ${size.sm} ${color.normal}`,
    md: `0 0 ${size.md} ${color.normal}`,
    lg: `0 0 ${size.lg} ${color.normal}`
  },

  strong: {
    xs: `0 0 ${size.xs} ${color.strong}`,
    sm: `0 0 ${size.sm} ${color.strong}`,
    md: `0 0 ${size.md} ${color.strong}`,
    lg: `0 0 ${size.lg} ${color.strong}`
  }
};
