import { FlattenSimpleInterpolation } from 'styled-components';
import '@types/styled-components';
import '@types/styled-components-react-native';

type PokemonTypeColor = {
  primary: string;
  secondary: string;
};

type ShadowGroup = {
  xs: FlattenSimpleInterpolation;
  sm: FlattenSimpleInterpolation;
  md: FlattenSimpleInterpolation;
  lg: FlattenSimpleInterpolation;
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
    red: {
      light: string;
      dark: string;
    };
    green: {
      primary: string;
      secondary: string;
    };
    pokemon: {
      type: {
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
      stat: {
        hp: string;
        attack: string;
        defense: string;
        specialAttack: string;
        specialDefense: string;
        speed: string;
      };
    };
    dayNightSwitch: {
      day: {
        primary: string;
        secondary: string;
      };
      night: {
        primary: string;
        secondary: string;
      };
    };
  };

  export type ThemeFontWeights = {
    regular: number;
    medium: number;
    bold: number;
    extraBold: number;
  };

  export type ThemeFontSizes = {
    caption: number;
    button: number;
    body: number;
    title: number;
    h5: number;
    h4: number;
    h3: number;
    h2: number;
    h1: number;
  };

  export type ThemeShadows = {
    soft: ShadowGroup;
    medium: ShadowGroup;
    strong: ShadowGroup;
  };

  export type ThemeSizes = {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };

  export type ThemeLineHeights = {
    title: number;
    body: number;
  };

  export type ThemeSpaces = {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };

  export interface DefaultTheme {
    color: ThemeColors;
    fontWeight: ThemeFontWeights;
    fontSize: ThemeFontSizes;
    shadow: {
      box: ThemeShadows;
      text: ThemeShadows;
    };
    size: ThemeSizes;
    lineHeight: ThemeLineHeights;
    space: ThemeSpaces;
  }
}
