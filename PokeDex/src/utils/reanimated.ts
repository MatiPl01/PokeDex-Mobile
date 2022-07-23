import {
  interpolate,
  Extrapolate,
  SharedValue,
  useAnimatedStyle
} from 'react-native-reanimated';

type AnimatedValueRange = [number, number];
type AnimatedValueList = { [key: string]: AnimatedValueRange }[];
type AnimatedValue = AnimatedValueRange | AnimatedValueList;

export type AnimatedStyleConfig = { [key: string]: AnimatedValue };

export type AnimatedStylesConfig = { [key: string]: AnimatedStyleConfig };

/**
 * Interpolate the progress value to the specific range
 *
 * @param range - 2-number array specifying the initial and the final value
 *                of the animated property
 * @param progress - float value between 0 and 1 indicating animation progress
 * @returns - interpolated value calculated based on the animation progress
 */
const interpolateValue = (
  range: AnimatedValueRange,
  progress: Readonly<SharedValue<number>>
) => {
  'worklet';
  return interpolate(progress.value, [0, 1], range, Extrapolate.CLAMP);
};

/**
 * Detect if the value assigned to the animated property is a range
 * containing 2 numbers or 2 strings
 *
 * @param value - array of values expected to be an array of 2 numbers
 * @returns - boolean value indicating if the value provided is a range
 */
const isRange = (value: any): boolean => {
  'worklet';
  return (
    value instanceof Array &&
    value.length === 2 &&
    (value.every(v => typeof v === 'string') ||
      value.every(v => typeof v === 'number'))
  );
};

/**
 * Create animated style hook based on the config object
 *
 * @param config - config specifying animated properties and their value ranges
 * @returns - a hook that creates animated style when called with the progress variable
 */
export const createAnimatedStyle =
  (config: AnimatedStyleConfig) =>
  (progress: Readonly<SharedValue<number>>) =>
  () => {
    'worklet';
    return Object.fromEntries(
      Object.entries(config).map(([property, values]) => {
        let interpolatedValues;

        if (isRange(values)) {
          // Single value is animated for the current property (e.g. opacity)
          interpolatedValues = interpolateValue(
            values as AnimatedValueRange,
            progress
          );
        } else {
          // Multiple values are animated for the current property (e.g. transform)
          interpolatedValues = values.map(value => {
            return Object.fromEntries(
              Object.entries(value).map(([name, range]) => {
                let value: number | string = interpolateValue(range, progress);
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
  };

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
        return [
          key,
          useAnimatedStyle(createAnimatedStyle(styleConfig)(progress))
        ];
      })
    );
  };
