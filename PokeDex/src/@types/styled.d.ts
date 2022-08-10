import '@types/styled-components';
import '@types/styled-components-react-native';

type PokemonTypeColor = {
  primary: string;
  secondary: string;
};

type ShadowSizes = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
};

declare module 'styled-components/native' {
  export type ThemeColors = {
    accent: {
      primary: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    black: string;
    white: string;
    gray: {
      light: string[];
      dark: string[];
    };
    pokemonType: {
      normal: PokemonTypeColor;
      fighting: PokemonTypeColor;
      flying: PokemonTypeColor;
      poison: PokemonTypeColor;
      ground: PokemonTypeColor;
      rock: PokemonTypeColor;
      bug: PokemonTypeColor;
      ghost: PokemonTypeColor;
      steel: PokemonTypeColor;
      fire: PokemonTypeColor;
      water: PokemonTypeColor;
      grass: PokemonTypeColor;
      electric: PokemonTypeColor;
      psychic: PokemonTypeColor;
      ice: PokemonTypeColor;
      dragon: PokemonTypeColor;
      dark: PokemonTypeColor;
      fairy: PokemonTypeColor;
    };
  };

  export type ThemeFontWeights = {
    regular: number;
    medium: number;
    bold: number;
  };

  export type ThemeFontSizes = {
    caption: string;
    button: string;
    body: string;
    title: string;
    h5: string;
    h4: string;
    h3: string;
    h2: string;
    h1: string;
  };

  export type ThemeShadows = {
    soft: ShadowSizes;
    medium: ShadowSizes;
    strong: ShadowSizes;
  };

  export type ThemeSizes = {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  export type ThemeLineHeights = {
    title: string;
    body: string;
  };

  export type ThemeSpaces = {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  
  export interface DefaultTheme {
    color: ThemeColors;
    fontWeight: ThemeFontWeights;
    fontSize: ThemeFontSizes;
    shadow: ThemeShadows;
    size: ThemeSizes;
    lineHeight: ThemeLineHeights;
    space: ThemeSpaces;
  }
}
