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
}

module.exports.ColorUtils = ColorUtils;
