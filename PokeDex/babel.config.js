module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    '@babel/plugin-proposal-export-namespace-from',
    [
      "module-resolver",
      {
        alias: {
          // This needs to be mirrored in tsconfig.json
          "@assets": "./assets"
        },
      },
    ],
  ],
};
