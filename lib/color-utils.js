"use strict";

class ColorUtils {
  /**
   * Converts a hex color code to a 6-digit hexadecimal string
   * @param {string} hexString - String that represent a hex code
   * @returns {string} 6-digit hexadecimal string without leading '#'
   */
  static normalizeHexCode(hexString) {
    const h = hexString.startsWith("#") ? hexString.replace("#", "") : hexString;
    if (h.length === 3) {
      return [0, 1, 2].map(s => h.substr(s, 1).repeat(2)).join("");
    } else {
      return h;
    }
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
   * Decimal rounding with a given precision
   * @param {number} number - Number to be rounded off
   * @param {number} precision - Number of digits after the decimal point
   * @returns {number} returns the rounded number
   */
  static decimalRound(number, precision) {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }
}

module.exports.ColorUtils = ColorUtils;
