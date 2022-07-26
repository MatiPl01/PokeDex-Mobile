export type HexColor = string;
export type RGBColor = [number, number, number];

export const calculateTextColor = (hexBgColor: HexColor, threshold = 128) => {
  const [r, g, b] = hexToRgb(hexBgColor);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq <= threshold ? '#fff' : '#000';
};

export const hexToRgb = (hexColor: HexColor): RGBColor => {
  let rgb: string[] = [];
  if (hexColor.startsWith('#')) hexColor = hexColor.slice(1);
  if (![3, 6].includes(hexColor.length)) {
    throw new Error(`Wrong hex color value: ${hexColor}`);
  }
  if (hexColor.length === 3) rgb = hexColor.split('').map(hex => hex + hex);
  else {
    for (let i = 0; i < 3; i++) rgb.push(hexColor.slice(2 * i, 2 * i + 2));
  }
  return rgb.map(hex => parseInt(hex, 16)) as RGBColor;
};

export const rgbToHex = (rgbColor: RGBColor): HexColor => {
  return `#${rgbColor.map(color => Math.floor(color).toString(16)).join('')}`;
};

export const mixColorsRgb = (...rgbColors: RGBColor[]): RGBColor => {
  return rgbColors
    .reduce(
      (colorSum, color) => color.map((c, i) => colorSum[i] + c) as RGBColor
    )
    .map(c => c / rgbColors.length) as RGBColor;
};

export const mixColorsHex = (...hexColors: HexColor[]): HexColor => {
  return rgbToHex(mixColorsRgb(...hexColors.map(hexToRgb)));
};
