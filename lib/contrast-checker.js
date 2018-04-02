"use strict";

/** @private */
const Utils = require("./color-utils").ColorUtils;

/**
 * Collection of functions that check properties of given colors
 */
class ContrastChecker {
  /**
   * Calculate the relative luminance of a RGB color given as a string or
   * an array of numbers
   * @param {string|Array<number, number, number>} rgb - RGB value represented
   *     as a string (hex code) or an array of numbers
   * @returns {number} Relative luminance
   */
  static relativeLuminance(rgb = [255, 255, 255]) {
    /*
      https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
    */
    if (Utils.isString(rgb)) { rgb = Utils.hexCodeToRgb(rgb); }

    const [r, g, b] = rgb.map(c => this.tristimulusValue(c));
    return r * 0.2126 + g * 0.7152 + b * 0.0722;
  }

  /**
   * Calculate the contrast ratio of given colors
   * @param {string|Array<number, number, number>} foreground - RGB value
   *     represented as a string (hex code) or an array of numbers
   * @param {string|Array<number, number, number>} background - RGB value
   *     represented as a string (hex code) or an array of numbers
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
   * Rate a given contrast ratio according to the WCAG 2.0 criteria
   * @param {number} ratio - Contrast ratio
   * @returns {string} A, AA or AAA if the contrast ratio meets the criteria of
   *     WCAG 2.0, otherwise "-"
   */
  static ratioToLevel(ratio) {
    if (ratio >= 7) {
      return "AAA";
    } else if (ratio >= 4.5) {
      return "AA";
    } else if (ratio >= 3) {
      return "A";
    }

    return "-";
  }

  /**
   * Check if the contrast ratio of a given color against black is higher
   * than against white.
   * @param {string|Array<number, number, number>} color - RGB value
   *     represented as a string (hex code) or an array of numbers
   * @returns {boolean} true if the contrast ratio against white is qual to or
   *     less than the ratio against black
   */
  static isLightColor(color) {
    const whiteLuminance = this.LUMINANCE.WHITE;
    const blackLuminance = this.LUMINANCE.BLACK;
    const l = this.relativeLuminance(color);
    const ratioWithWhite = this.luminanceToContrastRatio(whiteLuminance, l);
    const ratioWithBlack = this.luminanceToContrastRatio(blackLuminance, l);
    return ratioWithWhite <= ratioWithBlack;
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

  /**
   * @private
   */
  static levelToRatio(level) {
    if (typeof level === "number" && level >= 1.0 && level <= 21.0) {
      return level;
    }

    if (level === "A") {
      return 3.0;
    } else if (level === "AA") {
      return 4.5;
    } else if (level === "AAA") {
      return 7.0;
    }
  }
}

/**
 * The relative luminance of some colors.
 */
ContrastChecker.LUMINANCE = {
  BLACK: 0.0,
  WHITE: 1.0
};

Object.freeze(ContrastChecker.LUMINANCE);

module.exports.ContrastChecker = ContrastChecker;
