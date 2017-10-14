"use strict";

const Utils = require("./color-utils").ColorUtils;

class ColorChecker {
  /**
   * Calculate the relative luminance of a RGB color given as a string or an array of numbers
   * @param {string|Array<number, number, number>} rgb - RGB value represented as a string (hex code) or an array of numbers
   * @returns {number} Relative luminance
   */
  static relativeLuminance(rgb = [255, 255, 255]) {
    /*
       https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
     */
    if (Utils.isString(rgb)) { rgb = Utils.hexCodeToDecimal(rgb); }

    const [r, g, b] = rgb.map(c => this.tristimulusValue(c));
    return r * 0.2126 + g * 0.7152 + b * 0.0722;
  }

  /**
   * Calculate the contrast ratio of given colors
   * @param {string|Array<number, number, number>} foreground - RGB value represented as a string (hex code) or an array of numbers
   * @param {string|Array<number, number, number>} background - RGB value represented as a string (hex code) or an array of numbers
   * @returns {number} Contrast ratio
   */
  static contrastRatio(foreground, background) {
    /*
       https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
     */
    const [l1, l2] = [foreground, background]
            .map(c => this.relativeLuminance(c));
    return this.luminanceToContrastRatio(l1, l2);
  }

  /**
   * @private
   */
  static tristimulusValue(primaryColor, base = 255) {
    const s = primaryColor / base;
    if (s <= 0.03928) {
      return s / 12.92;
    } else {
      return Math.pow((s + 0.055) / 1.055, 2.4);
    }
  }

  /**
   * @private
   */
  static luminanceToContrastRatio(luminance1, luminance2) {
    const [l1, l2] = [luminance1, luminance2]
            .sort((f, s) => s - f);
    return (l1 + 0.05) / (l2 + 0.05);
  }
}

module.exports.ColorChecker = ColorChecker;
