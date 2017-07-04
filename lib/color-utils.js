"use strict";

class ColorUtils {
  /**
   * Converts a hex color code string to a decimal representation
   * @param {string} hexCode - Hex color code such as "#ffff00"
   * @returns {Array<number, number, number>} RGB value represented as an array of numbers
   */
  static hexCodeToDecimal(hexCode) {
    const h = this.normalizeHexCode(hexCode);
    return [0, 2, 4].map(s => h.substr(s, 2))
      .map(primaryColor => Number.parseInt(primaryColor, 16));
  }

  /**
   * Converts a hex color code to a 6-digit hexadecimal string
   * @param {string} hexString - String that represent a hex code
   * @returns {string} 6-digit hexadecimal string without leading '#'
   */
  static normalizeHexCode(hexString) {
    const hl = hexString.toLowerCase();
    const h = hl.startsWith("#") ? hl.replace("#", "") : hl;
    if (h.length === 3) {
      return [0, 1, 2].map(s => h.substr(s, 1).repeat(2)).join("");
    } else {
      return h;
    }
  }

  /**
   * Converts a decimal representation of color to a hex code string
   * @param {Array<number, number, number>} rgb - RGB value represented as an array of numbers
   * @returns {string} RGB value in hex code
   */
  static decimalToHexCode(rgb) {
    return "#" + rgb.map(d => {
      const h = d.toString(16);
      return h.length === 1 ? "0" + h : h;
    }).join("");
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
   * @param {Array<number, number, number>} rgb - RGB value represented as an array of numbers
   * @returns {boolean} true if the argument is a valid RGB color
   */
  static isValidRgb(rgb) {
    return rgb.length === 3 &&
      rgb.every(c => c >= 0 && c <= 255 &&
                Number.isInteger(c));
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
   * @param {string} hexCode1 - Color given as a hex code, such as "#ffff00", "#FFFF00" or "#ff0"
   * @param {string} hexCode2 - Color given as a hex code, such as "#ffff00", "#FFFF00" or "#ff0"
   * @returns {boolean} True if given two colors are same
   */
  static isSameHexColor(hexCode1, hexCode2) {
    const h1 = this.normalizeHexCode(hexCode1);
    const h2 = this.normalizeHexCode(hexCode2);
    return h1 === h2;
  }

  /**
   * Checks if given two RGB values represent a same color.
   * @param {Array<number, number, number>} rgb1 - Color given as an array of numbers, such as [255, 255, 0]
   * @param {Array<number, number, number>} rgb2 - Color given as an array of numbers, such as [255, 255, 0]
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
   * @returns {boolean} returns true if letters in the argument string are all uppercase
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
}

ColorUtils.setup();

module.exports.ColorUtils = ColorUtils;
