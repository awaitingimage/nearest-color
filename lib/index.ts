export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface ColorSpec {
  name?: string;
  source: string;
  rgb: RGB;
}

export interface AuthenticColor {
  hexCode: string;
  appletonColourCode: string;
}

export interface CustomColorObject {
  [key: string]: string;
}

export interface ColorMatch {
  name: string;
  value: string;
  rgb: RGB;
  distance: number;
}

export interface StandardColors { [s: string]: string; }

const VERSION = "0.5.0";

/**
 * A map from the names of standard CSS colors to their hex values.
 */
const STANDARD_COLORS: StandardColors = {
  aqua: "#0ff",
  black: "#000",
  blue: "#00f",
  fuchsia: "#f0f",
  gray: "#808080",
  green: "#008000",
  lime: "#0f0",
  maroon: "#800000",
  navy: "#000080",
  olive: "#808000",
  orange: "#ffa500",
  purple: "#800080",
  red: "#f00",
  silver: "#c0c0c0",
  teal: "#008080",
  white: "#fff",
  yellow: "#ff0",
};

const trim = (str: string): string => {
  return str.replace(/^\s+|\s+$/gm, "");
};

const rgbaToHex = (rgba: string): string => {
  const parts = rgba.substring(rgba.indexOf("(")).split(",");
  const r = parseInt(trim(parts[0].substring(1)), 10);
  const g = parseInt(trim(parts[1]), 10);
  const b = parseInt(trim(parts[2]), 10);
  const a = parseFloat(trim(parts[3].substring(0, parts[3].length - 1))).toFixed(2);

  return ("#" + r.toString(16) + g.toString(16) + b.toString(16));
};

/**
 * Parses a value between 0-255 from a string.
 *
 * @example
 * parseComponentValue('100');  // => 100
 * parseComponentValue('100%'); // => 255
 * parseComponentValue('50%');  // => 128
 */
function parseComponentValue(text: string): number {
  if (text.charAt(text.length - 1) === "%") {
    return Math.round(parseInt(text, 10) * 255 / 100);
  }

  return Number(text);
}

/**
 * Converts an {@link RGB} color to its hex representation.
 *
 * @example
 * rgbToHex({ r: 255, g: 128, b: 0 }); // => '#ff8000'
 */
function rgbToHex(rgb: RGB): string {
  return "#" + leadingZero(rgb.r.toString(16)) +
    leadingZero(rgb.g.toString(16)) + leadingZero(rgb.b.toString(16));
}

/**
 * Puts a 0 in front of a numeric string if it's only one digit. Otherwise
 * nothing (just returns the value passed in).
 *
 *
 * @example
 * leadingZero('1');  // => '01'
 * leadingZero('12'); // => '12'
 */
function leadingZero(value: string): string {
  if (value.length === 1) {
    value = "0" + value;
  }
  return value;
}

/**
 * Parses a color from a string.
 *
 * @example
 * parseColorToRGB({ r: 3, g: 22, b: 111 }); // => { r: 3, g: 22, b: 111 }
 * parseColorToRGB('#f00');                  // => { r: 255, g: 0, b: 0 }
 * parseColorToRGB('#04fbc8');               // => { r: 4, g: 251, b: 200 }
 * parseColorToRGB('#FF0');                  // => { r: 255, g: 255, b: 0 }
 * parseColorToRGB('rgb(3, 10, 100)');       // => { r: 3, g: 10, b: 100 }
 * parseColorToRGB('rgb(50%, 0%, 50%)');     // => { r: 128, g: 0, b: 128 }
 * parseColorToRGB('aqua');                  // => { r: 0, g: 255, b: 255 }
 */
function parseColorToRGB(source: RGB | string): RGB | null {
  let red;
  let green;
  let blue;

  if (typeof source === "object") {
    return source;
  }

  if (source in STANDARD_COLORS) {
    return parseColorToRGB(STANDARD_COLORS[source]);
  }

  let hexMatch: RegExpMatchArray | null | string = source.match(/^#((?:[0-9a-f]{3}){1,2})$/i);
  if (hexMatch) {
    hexMatch = hexMatch[1];

    if (hexMatch.length === 3) {
      hexMatch = [
        hexMatch.charAt(0) + hexMatch.charAt(0),
        hexMatch.charAt(1) + hexMatch.charAt(1),
        hexMatch.charAt(2) + hexMatch.charAt(2),
      ];

    } else {
      hexMatch = [
        hexMatch.substring(0, 2),
        hexMatch.substring(2, 4),
        hexMatch.substring(4, 6),
      ];
    }

    red = parseInt(hexMatch[0], 16);
    green = parseInt(hexMatch[1], 16);
    blue = parseInt(hexMatch[2], 16);

    return { r: red, g: green, b: blue };
  }

  const rgbMatch = source.match(/^rgb\(\s*(\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d{1,3}%?)\s*\)$/i);
  if (rgbMatch) {
    red = parseComponentValue(rgbMatch[1]);
    green = parseComponentValue(rgbMatch[2]);
    blue = parseComponentValue(rgbMatch[3]);

    return { r: red, g: green, b: blue };
  }

  return null;
}

/**
 * Creates a {@link ColorSpec} from either a string or an {@link RGB}.
 *
 * @example
 * createColorSpec('#800'); // => {
 *   source: '#800',
 *   rgb: { r: 136, g: 0, b: 0 }
 * }
 *
 * createColorSpec('#800', 'maroon'); // => {
 *   name: 'maroon',
 *   source: '#800',
 *   rgb: { r: 136, g: 0, b: 0 }
 * }
 */
function createColorSpec(input: string | RGB, name?: string): ColorSpec | null {
  const color = {} as ColorSpec;

  if (name) {
    color.name = name;
  }

  if (typeof input === "string") {
    color.source = input;
    const rgb = parseColorToRGB(input);
    if (rgb == null) {
      return null;
    }
    color.rgb = rgb;
  } else if (typeof input === "object") {
    color.rgb = input;
    color.source = rgbToHex(input);
  }

  return color;
}

/**
 * Given either an array or object of colors, returns an array of
 * {@link ColorSpec} objects (with {@link RGB} values).
 *
 * @private
 * @param {Array.<string>|Object} colors An array of hex-based color strings, or
 *     an object mapping color *names* to hex values.
 * @return {Array.<ColorSpec>} An array of {@link ColorSpec} objects
 *     representing the same colors passed in.
 */
function mapColors(colors: CustomColorObject[] | StandardColors, name = "name", hexCode = "value"): ColorSpec[]  {
  if (colors instanceof Array) {
    return colors.reduce((result: ColorSpec[], color) => {
      const newColor = createColorSpec(color[name], color[hexCode]);
      if (newColor !== null) {
        result.push(newColor);
      }
      return result;
    }, []);
  }

  return Object.keys(colors).reduce((result: ColorSpec[], name: string) => {
    const newColor = createColorSpec(colors[name], name);
    if (newColor !== null) {
      result.push(newColor);
    }
    return result;
  }, []);
}

/**
 * Gets the nearest color, from the given list of {@link ColorSpec} objects
 * (which defaults to {@link nearestColor.DEFAULT_COLORS}).
 *
 * Probably you wouldn't call this method directly. Instead you'd get a custom
 * color matcher by calling {@link nearestColor.from}.
 *
 * @public
 * @param needle Either an {@link RGB} color or a hex-based
 *     string representing one, e.g., '#FF0'
 * @param colors An optional list of available colors
 *     (defaults to {@link DEFAULT_COLORS})
 * @return If the colors in the provided list had names,
 *     then a {@link ColorMatch} object with the name and (hex) value of the
 *     nearest color from the list. Otherwise, simply the hex value.
 *
 * @example
 * nearestColor({ r: 200, g: 50, b: 50 }); // => '#f00'
 * nearestColor('#f11');                   // => '#f00'
 * nearestColor('#f88');                   // => '#f80'
 * nearestColor('#ffe');                   // => '#ff0'
 * nearestColor('#efe');                   // => '#ff0'
 * nearestColor('#abc');                   // => '#808'
 * nearestColor('red');                    // => '#f00'
 * nearestColor('foo');                    // => null
 */
function nearestColor(needle: RGB | string, colors: ColorSpec[]): ColorMatch | string | null {
  const convertedNeedle = parseColorToRGB(needle);
  if (convertedNeedle == null) {
    throw new Error("Provided colour does not compute!");
  }

  let distance;
  let minDistance = Infinity;
  let rgb;
  let value;

  for (const color of colors) {
    rgb = color.rgb;

    distance = Math.sqrt(
      Math.pow(convertedNeedle.r - rgb.r, 2) +
      Math.pow(convertedNeedle.g - rgb.g, 2) +
      Math.pow(convertedNeedle.b - rgb.b, 2),
    );

    if (distance < minDistance) {
      minDistance = distance;
      value = color;
    }
  }

  if (value && value.name) {
    return {
      name: value.name,
      value: value.source,
      rgb: value.rgb,
      distance: minDistance,
    };
  }

  if (value && value.source) {
    return value.source;
  }

  return null;

}

/**
 * Provides a matcher to find the nearest color based on the provided list of
 * available colors.
 *
 * @public
 * @param {Array.<string>|Object} availableColors An array of hex-based color
 *     strings, or an object mapping color *names* to hex values.
 * @return {function(string):ColorMatch|string} A function with the same
 *     behavior as {@link nearestColor}, but with the list of colors
 *     predefined.
 *
 * @example
 * var colors = {
 *   'maroon': '#800',
 *   'light yellow': { r: 255, g: 255, b: 51 },
 *   'pale blue': '#def'
 * };
 *
 * var bgColors = [
 *   '#eee',
 *   '#444'
 * ];
 *
 * var getColor = nearestColor.from(colors);
 * var getBGColor = getColor.from(bgColors);
 * var getAnyColor = nearestColor.from(colors).or(bgColors);
 *
 * getColor('#f00');
 * // => { name: 'maroon', value: '#800', rgb: { r: 136, g: 0, b: 0 }, distance: 119}
 *
 * getColor('#ff0');
 * // => { name: 'light yellow', value: '#ffff33', rgb: { r: 255, g: 255, b: 51 }, distance: 51}
 *
 * getBGColor('#fff'); // => '#eee'
 * getBGColor('#000'); // => '#444'
 *
 * getAnyColor('#f00');
 * // => { name: 'maroon', value: '#800', rgb: { r: 136, g: 0, b: 0 }, distance: 119}
 *
 * getAnyColor('#888'); // => '#444'
 */
function nearestFrom(availableColors: StandardColors | CustomColorObject[], name = "name", hexCode = "value"): (hex: string) => string | ColorMatch | null {
  const colors = mapColors(availableColors, name, hexCode);
  const nearestColorBase = nearestColor;

  const matcher = function nearestColorFrom(hex: string) {
    return nearestColorBase(hex, colors);
  };

  // Keep the 'from' method, to support changing the list of available colors
  // multiple times without needing to keep a reference to the original
  // nearestColor function.
  // matcher.from = nearestFrom;

  // // Also provide a way to combine multiple color lists.
  // matcher.or = function or(alternateColors) {
  //   const extendedColors = colors.concat(mapColors(alternateColors));
  //   return nearestFrom(extendedColors);
  // };

  return matcher;
}

export { rgbaToHex, nearestFrom };
