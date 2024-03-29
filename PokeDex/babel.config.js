module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    '@babel/plugin-proposal-export-namespace-from',
    [
      'module-resolver',
      {
        root: ["./"],
        extensions: [
          ".ts",
          ".tsx",
          ".svg",
          ".json"
        ],
        alias: {
          // This needs to be mirrored in tsconfig.json
          '@assets': './assets',
          '@components': './src/components',
          "@constants": './src/constants/index.ts',
          '@core': './src/core',
          '@screens': './src/screens',
          '@services': './src/services',
          '@store': './src/store',
          '@styles': './src/styles',
          '@themes': './src/themes',
          '@utils': './src/utils',
          '@types': './src/types/index.ts'
        }
      }
    ]
  ]
};
