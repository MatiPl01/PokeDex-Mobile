import { DefaultTheme } from 'styled-components/native';
import {
  interpolate,
  Extrapolate,
  SharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  interpolateColor
} from 'react-native-reanimated';
import memoizeOne from 'memoize-one';

type InterpolationNumbers = readonly number[];
type InterpolationStrings = readonly string[];
type InterpolationRange = InterpolationNumbers | InterpolationStrings;
type InterpolationValuesList = Record<string, InterpolationRange | undefined>[];

type InterpolationRanges = {
  inputRange: InterpolationNumbers;
  outputRange: InterpolationRange | InterpolationValuesList;
};

type InterpolationPropertyValue =
  | InterpolationRanges
  | InterpolationRange // default inputRange will be used
  | InterpolationValuesList; // default inputRange will be used

export type AnimatedStyleConfig = Record<string, InterpolationPropertyValue>;

export type AnimatedStylesConfig = Record<string, AnimatedStyleConfig>;

type InterpolatedValue = string | number | Record<string, InterpolatedValue>[];

export type AnimatedPropsConfig = Record<string, InterpolationRange>;
export type AnimatedPropsGroupsConfig = Record<string, AnimatedPropsConfig>;

/**
 *
 * @param stops - number of animation stop values (the same as the
 *                number of outputRange values)
 * @returns     - uniformly distributed inputRange values
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
 * @return - value calculated based on the interpolation inputRange,
 *           outputRange and the progress value
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
 * @param value - array of values expected to be numbers
 * @returns     - boolean value indicating if the value provided is a range
 *                of numbers
 */
const isNumberRange = (
  value: readonly any[]
): value is InterpolationNumbers => {
  'worklet';
  return value.every(v => typeof v === 'number');
};

/**
 * Detect if the value assigned to the animated property is a range
 * containing color strings (e.g. colors)
 *
 * @param value - array of values expected to be strings
 * @returns     - boolean value indicating if the value provided is a range
 *                of strings
 */
const isStringRange = (
  value: readonly any[]
): value is InterpolationStrings => {
  'worklet';
  return value.every(v => typeof v === 'string');
};

/**
 * Detect if the value assigned to the animated property is a range
 * containing percentage values (strings ending with %)
 *
 * @param value - array of values expected to be percentage values
 * @returns     - boolean value indicating if the value provided is a range
 *                of percentage values
 *
 */
const isPercentRange = (
  value: readonly any[]
): value is InterpolationStrings => {
  'worklet';
  return value.every(v => typeof v === 'string' && v[v.length - 1] === '%');
};

/**
 * Detects if the value assigned to the animated property is a list
 * of objects containing properties and interpolation ranges
 *
 * @param value - array of values expected to be a list of objects
 *                containing animated values
 * @returns     - boolean value indicating if the value provided is an
 *                array of objects with properties and interpolation ranges
 */
const isInterpolatedValuesList = (
  value: readonly any[]
): value is InterpolationValuesList => {
  'worklet';
  return value.every(v => v instanceof Object);
};

/**
 * Interpolate values assigned to the specific property
 *
 * @param progress     - animation progress value
 * @param propertyName - name of a property which has interpolation
 *                       values assigned to it
 * @param value        - interpolated property value
 * @returns            - interpolated value
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
  if (isNumberRange(outputRange)) {
    const result = interpolateNumbers({ progress, inputRange, outputRange });
    if (propertyName === 'rotate') return `${result}deg`;
    return result;
  }
  // If outputRange is a range of percentage values
  else if (isPercentRange(outputRange)) {
    const result = interpolateNumbers({
      progress,
      inputRange,
      outputRange: outputRange.map(v => parseFloat(v))
    });
    return `${result}%`;
  }
  // If outputRange is an InterpolationStrings range
  else if (isStringRange(outputRange)) {
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
 * @returns      - a hook that creates animated style when called with the
 *                 progress variable
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
export const createAnimatedStyles = (config: AnimatedStylesConfig) => {
  'worklet';

  const animatedStyles = Object.fromEntries(
    Object.entries(config).map(([key, styleConfig]) => {
      return [key, createAnimatedStyle(styleConfig)];
    })
  );

  return (progress: Readonly<SharedValue<number>>) =>
    Object.fromEntries(
      Object.entries(animatedStyles).map(([styleName, animatedStyleFn]) => [
        styleName,
        animatedStyleFn(progress)
      ])
    );
};

/**
 * Create animated style hook based on the themed config object
 *
 * @params             - object containing parameters used to create an animated style
 * @returns            - a hook that creates animated style when called with the theme
 *                       object and the animation progress value
 */
export const createAnimatedParametrizedStyle = <T extends object>(
  themedConfig: (params: T) => AnimatedStyleConfig
) => memoizeOne((params: T) => createAnimatedStyle(themedConfig(params)));

/**
 * Create multiple animated styles for multiple properties in the themed config object
 *
 * @params             - object containing parameters used to create an animated style
 * @returns            - an object containing animated styles
 */
export const createAnimatedParametrizedStyles = <T extends object>(
  themedConfig: (params: T) => AnimatedStylesConfig
) => memoizeOne((params: T) => createAnimatedStyles(themedConfig(params)));

/**
 * Create an object with animated properties
 *
 * @param config - an object containing property names and their ranges
 * @returns      - an object containing animated values assigned to the
 *                 appropriate property names
 */
export const createAnimatedProps =
  (config: AnimatedPropsConfig) => (progress: Readonly<SharedValue<number>>) =>
    useAnimatedProps(() => {
      'worklet';
      return Object.fromEntries(
        Object.entries(config).map(([prop, value]) => [
          prop,
          interpolateValue(progress, prop, value)
        ])
      );
    });

/**
 * Create an object containing grouped animated properties
 *
 * @param config - an object containing group names and animated
 *                 properties configs
 * @returns      - an object containing group names and animated
 *                 values assigned to property names in groups
 */
export const createAnimatedPropsGroups = (
  config: AnimatedPropsGroupsConfig
) => {
  'worklet';

  const animatedPropsGroups = Object.fromEntries(
    Object.entries(config).map(([groupName, groupConfig]) => [
      groupName,
      createAnimatedProps(groupConfig)
    ])
  );

  return (progress: Readonly<SharedValue<number>>) =>
    Object.fromEntries(
      Object.entries(animatedPropsGroups).map(
        ([groupName, groupAnimatedPropsFn]) => [
          groupName,
          groupAnimatedPropsFn(progress)
        ]
      )
    );
};
