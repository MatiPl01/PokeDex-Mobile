import {
  interpolate,
  Extrapolate,
  SharedValue,
  useAnimatedStyle,
  interpolateColor
} from 'react-native-reanimated';

// TODO - maybe improve types
type AnimatedNumberRange = [number, number];
type AnimatedStringRange = string[];
type AnimatedValueRange = AnimatedNumberRange | AnimatedStringRange;
type AnimatedValueList = { [key: string]: AnimatedValueRange }[];
type AnimatedValue = AnimatedValueRange | AnimatedValueList;

export type AnimatedStyleConfig = { [key: string]: AnimatedValue };

export type AnimatedStylesConfig = { [key: string]: AnimatedStyleConfig };

/**
 * Interpolate the progress value to the specific range
 *
 * @param range - 2-number array specifying the initial and the final value
 *                of the animated property
 * @param progress - animated value between 0 and 1 indicating animation progress
 * @returns - interpolated value calculated based on the animation progress
 */
const interpolateNumberValue = (
  range: AnimatedNumberRange,
  progress: Readonly<SharedValue<number>>
) => {
  'worklet';
  return interpolate(progress.value, [0, 1], range, Extrapolate.CLAMP);
};

/**
 * Interpolate the progress value to to the color range
 *
 * @param range - array of colors
 * @param progress - animated value between 0 and 1 indicating animation progress
 * @returns - interpolated color value calculated based on the animation progress
 */
const interpolateColorValue = (
  range: AnimatedStringRange,
  progress: Readonly<SharedValue<number>>
) => {
  'worklet';
  return interpolateColor(progress.value, [0, 1], range, 'RGB');
};

/**
 * Detect if the value assigned to the animated property is a range
 * containing 2 numbers
 *
 * @param value - array of values expected to be 2 numbers
 * @returns - boolean value indicating if the value provided is a range
 *            of numbers
 */
const isNumberRange = (value: any[]): boolean => {
  'worklet';
  return (
    value instanceof Array &&
    value.length === 2 &&
    value.every(v => typeof v === 'number')
  );
};

/**
 * Detect if the value assigned to the animated property is a range
 * containing color strings (e.g. colors)
 *
 * @param value - array of values expected to be strings
 * @returns - boolean value indicating if the value provided is a range
 *            of strings
 */
const isStringRange = (value: any[]): boolean => {
  'worklet';
  return (
    value instanceof Array &&
    value.length >= 2 &&
    value.every(v => typeof v === 'string')
  );
};

/**
 * Create animated style hook based on the config object
 *
 * @param config - config specifying animated properties and their value ranges
 * @returns - a hook that creates animated style when called with the progress variable
 */
export const createAnimatedStyle =
  (config: AnimatedStyleConfig) => (progress: Readonly<SharedValue<number>>) =>
    useAnimatedStyle(() => {
      'worklet';
      return Object.fromEntries(
        Object.entries(config).map(([property, values]) => {
          let interpolatedValues;

          if (isNumberRange(values)) {
            // Single value is animated for the current property (e.g. opacity)
            interpolatedValues = interpolateNumberValue(
              values as AnimatedNumberRange,
              progress
            );
          } else if (isStringRange(values)) {
            // Wrong property name
            if (!['color', 'backgroundColor'].includes(property)) {
              throw new Error(
                'Unexpected property name for a string range value'
              );
            }
            // Color values are animated
            interpolatedValues = interpolateColorValue(
              values as AnimatedStringRange,
              progress
            );
          } else {
            // Multiple values are animated for the current property (e.g. transform)
            interpolatedValues = values.map(value => {
              return Object.fromEntries(
                Object.entries(value).map(([name, range]) => {
                  let value: number | string = interpolateNumberValue(
                    range,
                    progress
                  );
                  // Add the deg unit if the animated property name is rotate
                  if (name === 'rotate') value = `${value}deg`;
                  return [name, value];
                })
              );
            });
          }

          return [property, interpolatedValues];
        })
      );
    });

/**
 * Create multiple animated styles for multiple properties in the config object
 *
 * @param config - an object containing style names and AnimatedStyleConfig objects
 * @returns - an object containing animated styles
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
