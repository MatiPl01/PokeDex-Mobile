import { DefaultTheme } from 'styled-components/native';
import {
  interpolate,
  Extrapolate,
  SharedValue,
  useAnimatedStyle,
  interpolateColor
} from 'react-native-reanimated';
import memoizeOne from 'memoize-one';

// TODO - maybe improve types, maybe improve isInterpolatedValuesList function
type InterpolationNumbers = readonly number[];
type InterpolationStrings = readonly string[];
type InterpolationRange = InterpolationNumbers | InterpolationStrings;
type InterpolationValuesList = { [key: string]: InterpolationRange }[];

type InterpolationRanges = {
  inputRange: InterpolationNumbers;
  outputRange: InterpolationRange | InterpolationValuesList;
};

type InterpolationPropertyValue =
  | InterpolationRanges
  | InterpolationRange // default inputRange will be used
  | InterpolationValuesList; // default inputRange will be used

export type AnimatedStyleConfig = { [key: string]: InterpolationPropertyValue };

export type AnimatedStylesConfig = { [key: string]: AnimatedStyleConfig };

type InterpolatedValue =
  | string
  | number
  | { [key: string]: InterpolatedValue }[];

/**
 *
 * @param stops - number of animation stop values (the same as the number of outputRange values)
 * @returns - uniformly distributed inputRange values
 */
const createUniformInputRange = (stops: number): number[] => {
  'worklet';
  const inputRange: number[] = [];
  const step = 1 / (stops - 1);
  for (let i = 0; i < stops - 1; i++) inputRange.push(step * i);
  inputRange.push(1);
  return inputRange;
};

/**
 * Interpolate the progress value to the specific range
 *
 * @param {
 *  inputRange - array of interpolation input values
 *  outputRange - array of interpolation output values
 *  progress - animation progress value
 * }
 *
 * @return - value calculated based on the interpolation inputRange, outputRange and the progress value
 */
const interpolateNumbers = ({
  inputRange,
  outputRange,
  progress
}: {
  inputRange?: InterpolationNumbers;
  outputRange: InterpolationNumbers;
  progress: Readonly<SharedValue<number>>;
}): number => {
  'worklet';
  return interpolate(
    progress.value,
    inputRange || createUniformInputRange(outputRange.length),
    outputRange,
    Extrapolate.CLAMP
  );
};

/**
 * Interpolate the progress value to to the color range
 *
 * @param {
 *  inputRange - array of interpolation input values
 *  outputRange - array of interpolation output colors
 *  progress - animation progress value
 * }
 *
 * @return - color calculated based on the interpolation inputRange, outputRange and the progress value
 */
const interpolateColors = ({
  inputRange,
  outputRange,
  progress
}: {
  inputRange?: InterpolationNumbers;
  outputRange: InterpolationStrings;
  progress: Readonly<SharedValue<number>>;
}): string => {
  'worklet';
  return interpolateColor(
    progress.value,
    inputRange || createUniformInputRange(outputRange.length),
    outputRange,
    'RGB'
  );
};

/**
 * Detect if the value assigned to the animated property is a range
 * containing 2 numbers
 *
 * @param value - array of values expected to be 2 numbers
 * @returns - boolean value indicating if the value provided is a range
 *            of numbers
 */
const isNumberRange = (value: readonly any[]): boolean => {
  'worklet';
  return value.every(v => typeof v === 'number');
};

/**
 * Detect if the value assigned to the animated property is a range
 * containing color strings (e.g. colors)
 *
 * @param value - array of values expected to be strings
 * @returns - boolean value indicating if the value provided is a range
 *            of strings
 */
const isStringRange = (value: readonly any[]): boolean => {
  'worklet';
  return value.every(v => typeof v === 'string');
};

/**
 * Detects if the value assigned to the animated property is a list of objects containing properties and interpolation ranges
 *
 * @param value - array of values expected to be a list of objects containing animated values
 * @returns - boolean value indicating if the value provided is an array of objects with properties and interpolation ranges
 */
const isInterpolatedValuesList = (value: readonly any[]): boolean => {
  'worklet';
  return value.every(v => v instanceof Object);
};

/**
 * Interpolate values assigned to the specific property
 *
 * @param progress - animation progress value
 * @param propertyName - name of a property which has interpolation values assigned to it
 * @param value - interpolated property value]
 * @returns
 */
function interpolateValue(
  progress: Readonly<SharedValue<number>>,
  propertyName: string,
  value: InterpolationPropertyValue
): InterpolatedValue {
  'worklet';
  let inputRange: InterpolationNumbers | undefined;
  let outputRange: InterpolationRange | InterpolationValuesList | undefined;

  // If value is an { inputRange, outputRange } object
  if (
    value instanceof Object &&
    ['inputRange', 'outputRange'].every(prop =>
      Object.keys(value).includes(prop)
    )
  ) {
    const ranges = value as InterpolationRanges;
    inputRange = ranges.inputRange;
    outputRange = ranges.outputRange;
  }

  if (value instanceof Array) {
    // If value is an InterpolatedValuesList
    if (isInterpolatedValuesList(value)) {
      return (value as InterpolationValuesList).map(listValue =>
        Object.fromEntries(
          Object.entries(listValue).map(([propName, propValue]) => [
            propName,
            interpolateValue(
              progress,
              propName,
              propValue as InterpolationPropertyValue
            )
          ])
        )
      );
    }
    // If value is an interpolation outputRange
    else outputRange = value;
  }

  if (!outputRange) {
    throw new Error(
      `Interpolation outputRange was not specified ${propertyName} ${JSON.stringify(
        value
      )}`
    );
  }
  // If outputRange is an InterpolationNumbers range
  if (isNumberRange(outputRange as InterpolationRange)) {
    outputRange = outputRange as InterpolationNumbers;
    const result = interpolateNumbers({ progress, inputRange, outputRange });
    if (propertyName === 'rotate') return `${result}deg`;
    return result;
  }
  // If outputRange is an InterpolationStrings range
  else if (isStringRange(outputRange as InterpolationRange)) {
    outputRange = outputRange as InterpolationStrings;
    if (!['color', 'backgroundColor'].includes(propertyName)) {
      throw new Error('Unexpected property name for a string range value');
    }
    // Color values are animated
    return interpolateColors({ progress, inputRange, outputRange });
  }

  throw new Error(`outputRange ${outputRange} is not a valid range`);
}

/**
 * Create animated style hook based on the config object
 *
 * @param config - config specifying animated properties and their value ranges
 * @returns      - a hook that creates animated style when called with the progress
 *                 variable
 */
export const createAnimatedStyle =
  (config: AnimatedStyleConfig) => (progress: Readonly<SharedValue<number>>) =>
    useAnimatedStyle(() => {
      'worklet';
      return Object.fromEntries(
        Object.entries(config).map(([property, value]) => [
          property,
          interpolateValue(progress, property, value)
        ])
      );
    });

/**
 * Create multiple animated styles for multiple properties in the config object
 *
 * @param config - an object containing style names and AnimatedStyleConfig objects
 * @returns      - an object containing animated styles
 */
export const createAnimatedStyles =
  (config: AnimatedStylesConfig) =>
  (progress: Readonly<SharedValue<number>>) => {
    'worklet';
    return Object.fromEntries(
      Object.entries(config).map(([key, styleConfig]) => {
        return [key, createAnimatedStyle(styleConfig)(progress)];
      })
    );
  };

/**
 * Create animated style hook based on the themed config object
 *
 * @param themedConfig - config specifying animated properties and their value ranges
 *                       calculated based on the current config values
 * @returns            - a hook that creates animated style when called with the theme
 *                       object and the animation progress value
 */
export const createAnimatedThemedStyle = <T = void>(
  themedConfig: (theme: DefaultTheme, customProp: T) => AnimatedStyleConfig
) =>
  memoizeOne((theme: DefaultTheme, customProps: T) =>
    createAnimatedStyle(themedConfig(theme, customProps))
  );

/**
 * Create multiple animated styles for multiple properties in the themed config object
 *
 * @param themedConfig - an object containing style names and themed config objects
 * @returns            - an object containing animated styles
 */
export const createAnimatedThemedStyles = <T = void>(
  themedConfig: (theme: DefaultTheme, customProps: T) => AnimatedStylesConfig
) =>
  memoizeOne((theme: DefaultTheme, customProps: T) =>
    createAnimatedStyles(themedConfig(theme, customProps))
  );
