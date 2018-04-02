"use strict";

/**
 * Collection of functions that provide basic operations on colors
 * represented as RGB/HSL value (given in the form of array of numbers)
 * or hex code (given in the form of string)
 */
class ColorUtils {
  /**
   * Converts a hex color code string to a decimal representation
   * @param {string} hexCode - Hex color code such as "#ffff00"
   * @returns {Array<number, number, number>} RGB value represented as
   *     an array of numbers
   */
  static hexCodeToRgb(hexCode) {
    const h = this.normalizeHexCode(hexCode, false);
    return [0, 2, 4].map(s => h.substr(s, 2))
      .map(primaryColor => Number.parseInt(primaryColor, 16));
  }

  /**
   * Converts a hex color code to a 6-digit hexadecimal string
   * @param {string} hexString - String that represent a hex code
   * @param {boolean} [prefix=true] - Append '#' to the head of return value
   *     if a truthy value is given
   * @returns {string} 6-digit hexadecimal string with/without leading '#'
   */
  static normalizeHexCode(hexString, prefix = true) {
    const hl = hexString.toLowerCase();
    const h = hl.startsWith("#") ? hl.replace("#", "") : hl;
    let hexPart = h;
    if (h.length === 3) {
      hexPart = [0, 1, 2].map(s => h.substr(s, 1).repeat(2)).join("");
    }

    return prefix ? `#${hexPart}` : hexPart;
  }

  /**
   * Converts a decimal representation of color to a hex code string
   * @param {Array<number, number, number>} rgb - RGB value represented as
   *     an array of numbers
   * @returns {string} RGB value in hex code
   */
  static rgbToHexCode(rgb) {
    return "#" + rgb.map(d => {
      const h = d.toString(16);
      return h.length === 1 ? "0" + h : h;
    }).join("");
  }

  /**
   * Converts HSL value to RGB value
   * @param {Array<number, number, number>} hsl - An array of numbers that
   *     represents HSL value
   * @returns {Array<number, number, number>} An array of numbers that
   *     represents RGB value
   */
  static hslToRgb(hsl) {
    /*
       https://www.w3.org/TR/css3-color/#hsl-color
     */
    const h = hsl[0] / 360;
    const s = hsl[1] / 100;
    const l = hsl[2] / 100;
    const m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
    const m1 = l * 2 - m2;
    const r = this.hueToRgb(m1, m2, h + 1 / 3) * 255;
    const g = this.hueToRgb(m1, m2, h) * 255;
    const b = this.hueToRgb(m1, m2, h - 1 / 3) * 255;
    return [r, g, b].map(c => Math.round(c));
  }

  /**
   * @private
   */
  static hueToRgb(m1, m2, hInit) {
    let h = hInit;
    if (h < 0) { h = h + 1; }
    if (h > 1) { h = h - 1; }
    if (h * 6 < 1) { return m1 + (m2 - m1) * h * 6; }
    if (h * 2 < 1) { return m2; }
    if (h * 3 < 2) { return m1 + (m2 - m1) * (2 / 3 - h) * 6; }
    return m1;
  }

  /**
   * Converts HSL value to hex code
   * @param {Array<number, number, number>} hsl - An array of numbers that
   *     represents HSL value
   * @returns {string} Hex code
   */
  static hslToHexCode(hsl) {
    return this.rgbToHexCode(this.hslToRgb(hsl));
  }

  /**
   * Converts RGB value to HSL value
   * @param {Array<number, number, number>} rgb - An array of numbers that
   *     represents RGB value
   * @returns {Array<number, number, number>} An array of numbers that
   *     represents HSL value
   */
  static rgbToHsl(rgb) {
    const l = this.rgbToLightness(rgb) * 100;
    const s = this.rgbToSaturation(rgb) * 100;
    const h = this.rgbToHue(rgb);

    return [h, s, l];
  }

  /**
   * @private
   */
  static rgbToLightness(rgb) {
    return (Math.max(...rgb) + Math.min(...rgb)) / 510;
  }

  /**
   * @private
   */
  static rgbToHue(rgb) {
    /**
     References:
     Agoston, Max K. (2005).
     "Computer Graphics and Geometric Modeling: Implementation and Algorithms".
     London: Springer

     https://accessibility.kde.org/hsl-adjusted.php#hue
     */
    const max = Math.max(...rgb);
    const min = Math.min(...rgb);

    if (max === min) { return 0; } /* you can return whatever you like */

    const d = max - min;
    const mi = rgb.reduce((m, v, i) => rgb[m] > v ? m : i, 0); /* maxIndex */
    const h = mi * 120 + (rgb[(mi + 1) % 3] - rgb[(mi + 2) % 3]) * 60 / d;

    return h < 0 ? h + 360 : h;
  }

  /**
   * @private
   */
  static rgbToSaturation(rgb) {
    const l = this.rgbToLightness(rgb);
    const max = Math.max(...rgb);
    const min = Math.min(...rgb);
    const d = max - min;

    if (max === min) { return 0; }

    if (l <= 0.5) {
      return d / (max + min);
    } else {
      return d / (510 - max - min);
    }
  }

  /**
   * Converts a hex color code string to an HSL representation
   * @param {string} hexCode - Hex color code such as "#ffff00"
   * @returns {Array<number, number, number>} HSL value represented as
   *     an array of numbers
   */
  static hexCodeToHsl(hexCode) {
    return this.rgbToHsl(this.hexCodeToRgb(hexCode));
  }

  /**
   * Decimal rounding with a given precision
   * @param {number} number - Number to be rounded off
   * @param {number} precision - Number of digits after the decimal point
   * @returns {number} returns the rounded number
   */
  static decimalRound(number, precision) {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  /**
   * Checks if a given array is a valid representation of RGB color.
   * @param {Array<number, number, number>} rgb - RGB value represented as
   *     an array of numbers
   * @returns {boolean} true if the argument is a valid RGB color
   */
  static isValidRgb(rgb) {
    return rgb.length === 3 &&
      rgb.every(c => c >= 0 && c <= 255 &&
                Number.isInteger(c));
  }

  /**
   * Checks if a given array is a valid representation of HSL color.
   * @param {Array<number, number, number>} hsl - HSL value represented as
   *     an array of numbers
   * @returns {boolean} true if the argument is a valid HSL color
   */
  static isValidHsl(hsl) {
    const upperLimits = [360, 100, 100];
    return hsl.length === 3 &&
      hsl.every((c, i) => typeof c === "number" &&
                c >= 0 && c <= upperLimits[i]);
  }

  /**
   * Checks if a given string is a valid representation of RGB color.
   * @param {string} code - RGB value in hex code
   * @returns {boolean} returns true if then argument is a valid RGB color
   */
  static isValidHexCode(code) {
    return this.HEX_CODE_RE.test(code);
  }

  /**
   * Checks if given two hex color codes represent a same color.
   * @param {string} hexCode1 - Color given as a hex code,
   *     such as "#ffff00", "#FFFF00" or "#ff0"
   * @param {string} hexCode2 - Color given as a hex code,
   *     such as "#ffff00", "#FFFF00" or "#ff0"
   * @returns {boolean} True if given two colors are same
   */
  static isSameHexColor(hexCode1, hexCode2) {
    const h1 = this.normalizeHexCode(hexCode1);
    const h2 = this.normalizeHexCode(hexCode2);
    return h1 === h2;
  }

  /**
   * Checks if given two RGB values represent a same color.
   * @param {Array<number, number, number>} rgb1 - Color given as an array
   *     of numbers, such as [255, 255, 0]
   * @param {Array<number, number, number>} rgb2 - Color given as an array
   *     of numbers, such as [255, 255, 0]
   * @returns {boolean} True if given two colors are same
   */
  static isSameRgbColor(rgb1, rgb2) {
    if (rgb1.length !== rgb2.length) { return false; }
    return rgb1.every((primaryColor, i) => primaryColor === rgb2[i]);
  }

  /**
   * Checks if a given object is a string
   * @param {object} str - Object to be checked
   * @returns {boolean} returns true if the argument is a string
   */
  static isString(str) {
    return typeof str === "string" || str instanceof String;
  }

  /**
   * Checks if a given string is consists of uppercase letters
   * @param {string} str - string to be checked
   * @returns {boolean} returns true if letters in the argument string are
   *     all uppercase
   */
  static isUpperCase(str) {
    return this.isString(str) && str.toUpperCase() === str;
  }

  /**
   * @private
   */
  static setup() {
    /** @private */
    this.HEX_CODE_RE = /^#?[0-9a-f]{3}([0-9a-f]{3})?$/i;
  }


  /**
   * @private
   */
  static clampToRange(value, lowerBound, upperBound) {
    if (value <= lowerBound) {
      return lowerBound;
    } else if (value > upperBound) {
      return upperBound;
    }
    return value;
  }

  /**
   * @private
   */
  static rgbMap(values, func = null) {
    if (func) {
      return values.map(val => {
        return ColorUtils.clampToRange(Math.round(func(val)), 0, 255);
      });
    } else {
      return values.map(val => {
        return ColorUtils.clampToRange(Math.round(val), 0, 255);
      });
    }
  }
}

/**
 * @deprecated Use .rgbToHexCode instead.
 */
ColorUtils.decimalToHexCode = ColorUtils.rgbToHexCode;

/**
 * @deprecated use .hexCodeToRgb instead.
 */
ColorUtils.hexCodeToDecimal = ColorUtils.hexCodeToRgb;

(function() {
  class Matrix {
    constructor(matrix) {
      this.matrix = matrix;
    }

    add(otherMatrix) {
      const newMatrix = this.matrix.map((row, i) => {
        const otherRow = otherMatrix.matrix[i];
        return row.map((s, j) => s + otherRow[j]);
      });

      return new Matrix(newMatrix);
    }

    multiply(n) {
      if (typeof n === "number") {
        return this.multiplyByScalar(n);
      } else {
        return this.productByVector(n);
      }
    }

    multiplyByScalar(n) {
      const newMatrix = this.matrix.map(row => row.map(c => c * n));
      return new Matrix(newMatrix);
    }

    productByVector(vector) {
      return this.matrix.map(row => {
        return row.reduce((s, c, i) => s += c * vector[i], 0);
      });
    }
  }

  ColorUtils.Matrix = Matrix;

  const rgbMap = ColorUtils.rgbMap;

  class ContrastCalc {
    /*
      https://www.w3.org/TR/filter-effects/#funcdef-contrast
      https://www.w3.org/TR/SVG/filters.html#TransferFunctionElementAttributes
    */
    static calcRgb(rgb, ratio = 100) {
      return rgbMap(rgb, c => (c * ratio + 255 * (50 - ratio / 2)) / 100);
    }
  }

  ColorUtils.ContrastCalc = ContrastCalc;

  class BrightnessCalc {
    /*
      https://www.w3.org/TR/filter-effects/#funcdef-brightness
      https://www.w3.org/TR/SVG/filters.html#TransferFunctionElementAttributes
    */
    static calcRgb(rgb, ratio = 100) {
      return rgbMap(rgb, c => c * ratio / 100);
    }
  }

  ColorUtils.BrightnessCalc = BrightnessCalc;

  class InvertCalc {
    /*
      https://www.w3.org/TR/filter-effects/#funcdef-invert
      https://www.w3.org/TR/filter-effects-1/#invertEquivalent
      https://www.w3.org/TR/SVG/filters.html#TransferFunctionElementAttributes
    */
    static calcRgb(rgb, ratio) {
      return rgb.map(c => {
        return Math.round((100 * c - 2 * c * ratio + 255 * ratio) / 100);
      });
    }
  }

  ColorUtils.InvertCalc = InvertCalc;

  class HueRotateCalc {
    /*
      https://www.w3.org/TR/filter-effects/#funcdef-hue-rotate
      https://www.w3.org/TR/SVG/filters.html#TransferFunctionElementAttributes
    */
    static calcRgb(rgb, deg) {
      return rgbMap(this.calcRotation(deg).multiply(rgb));
    }

    static degToRad(deg) {
      return Math.PI * deg / 180;
    }

    static calcRotation(deg) {
      const rad = this.degToRad(deg);
      const cosPartResult = this.cosPart.multiply(Math.cos(rad));
      const sinPartResult = this.sinPart.multiply(Math.sin(rad));
      return this.constPart.add(cosPartResult).add(sinPartResult);
    }
  }

  HueRotateCalc.constPart = new Matrix([[0.213, 0.715, 0.072],
                                        [0.213, 0.715, 0.072],
                                        [0.213, 0.715, 0.072]]);

  HueRotateCalc.cosPart = new Matrix([[0.787, -0.715, -0.072],
                                      [-0.213, 0.285, -0.072],
                                      [-0.213, -0.715, 0.928]]);

  HueRotateCalc.sinPart = new Matrix([[-0.213, -0.715, 0.928],
                                      [0.143, 0.140, -0.283],
                                      [-0.787, 0.715, 0.072]]);

  ColorUtils.HueRotateCalc = HueRotateCalc;

  class SaturateCalc {
    /*
      https://www.w3.org/TR/filter-effects/#funcdef-saturate
      https://www.w3.org/TR/SVG/filters.html#feColorMatrixElement
    */
    static calcRgb(rgb, s) {
      return rgbMap(this.calcSaturation(s).multiply(rgb));
    }

    static calcSaturation(s) {
      return this.constPart.add(this.saturatePart.multiply(s / 100));
    }
  }

  SaturateCalc.constPart = HueRotateCalc.constPart;
  SaturateCalc.saturatePart = HueRotateCalc.cosPart;

  ColorUtils.SaturateCalc = SaturateCalc;

  class GrayscaleCalc {
    /*
      https://www.w3.org/TR/filter-effects/#funcdef-grayscale
      https://www.w3.org/TR/filter-effects/#grayscaleEquivalent
      https://www.w3.org/TR/SVG/filters.html#feColorMatrixElement
    */
    static calcRgb(rgb, s) {
      return rgbMap(this.calcGrayscale(s).multiply(rgb));
    }

    static calcGrayscale(s) {
      const r = 1 - Math.min(100, s) / 100;
      return this.constPart.add(this.ratioPart.multiply(r));
    }
  }

  GrayscaleCalc.constPart = new Matrix([[0.2126, 0.7152, 0.0722],
                                        [0.2126, 0.7152, 0.0722],
                                        [0.2126, 0.7152, 0.0722]]);

  GrayscaleCalc.ratioPart = new Matrix([[0.7874, -0.7152, -0.0722],
                                        [-0.2126, 0.2848, -0.0722],
                                        [-0.2126, -0.7152, 0.9278]]);

  ColorUtils.GrayscaleCalc = GrayscaleCalc;

  /**
   * The RGB value of some colors.
   */
  ColorUtils.RGB = {
    BLACK: [0, 0, 0],
    WHITE: [255, 255, 255]
  };

  Object.freeze(ColorUtils.RGB);
})();

ColorUtils.setup();

module.exports.ColorUtils = ColorUtils;
