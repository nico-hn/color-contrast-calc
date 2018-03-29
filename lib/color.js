"use strict";

/** @private */
const Utils = require("./color-utils").ColorUtils;
/** @private */
const Checker = require("./contrast-checker").ContrastChecker;

/** @private */
class SearchCriteria {
  static shouldScanDarkerSide(fixedRgb, otherRgb) {
    const fixedLuminance = Checker.relativeLuminance(fixedRgb);
    const otherLuminance = Checker.relativeLuminance(otherRgb);
    return fixedLuminance > otherLuminance ||
      fixedLuminance === otherLuminance && Checker.isLightColor(fixedRgb);
  }

  static thresholdCriteria(fixedRgb, otherRgb, level) {
    const targetRatio = Checker.levelToRatio(level);

    if (this.shouldScanDarkerSide(fixedRgb, otherRgb)) {
      return new ToDarkerSide(targetRatio, fixedRgb);
    } else {
      return new ToBrighterSide(targetRatio, fixedRgb);
    }
  }

  constructor(targetRatio, fixedRgb) {
    this.targetRatio = targetRatio;
    this.fixedLuminance = Checker.relativeLuminance(fixedRgb);
  }

  hasSufficientContrast(rgb) {
    return this.contrastRatio(rgb) >= this.targetRatio;
  }

  contrastRatio(rgb) {
    const luminance = Checker.relativeLuminance(rgb);
    return Checker.luminanceToContrastRatio(this.fixedLuminance,
                                            luminance);
  }
}

/** @private */
class ToDarkerSide extends SearchCriteria {
  round(r) {
    return Math.floor(r * 10 ) / 10;
  }

  incrementCondition(contrastRatio) {
    return contrastRatio > this.targetRatio;
  }
}

/** @private */
class ToBrighterSide extends SearchCriteria {
  round(r) {
    return Math.ceil(r * 10) / 10;
  }

  incrementCondition(contrastRatio) {
    return this.targetRatio > contrastRatio;
  }
}

/** @private */
class ThresholdFinder {
  static * binarySearchWidth(initWidth, min) {
    let i = 1;
    let d = initWidth / Math.pow(2, i);

    while (d > min) {
      yield d;
      i++;
      d = initWidth / Math.pow(2, i);
    }
  }
}

/** @private */
class LightnessFinder extends ThresholdFinder {
  /**
   * Tries to find a color whose contrast against the base color is close to
   * a given level.
   *
   * The returned color is gained by modifying the lightness of otherColor.
   * Even when a color that satisfies the level is not found, it returns
   * a new color anyway.
   * @param {Color} otherColor - The color before the modification of lightness
   * @param {string} [level="AA"] - A, AA or AAA
   * @returns {Color} A color whose contrast against the base color is close to
   *     a specified level
   */
  static find(fixedRgb, otherRgb, level = "AA") {
    const criteria = SearchCriteria.thresholdCriteria(fixedRgb, otherRgb, level);
    const [h, s, initL] = Utils.rgbToHsl(otherRgb);
    const [max, min] = this.determineMinmax(fixedRgb, otherRgb, initL);
    const boundaryRgb = this.boundaryColor(fixedRgb, max, min, criteria);

    if (boundaryRgb) { return boundaryRgb; }

    let l = (max + min) / 2;
    let lastSufficientLightness = null;

    for (let d of this.binarySearchWidth(max - min, 0.01)) {
      const newRgb = Utils.hslToRgb([h, s, l]);
      const contrastRatio = criteria.contrastRatio(newRgb);

      if (criteria.hasSufficientContrast(newRgb)) {
        lastSufficientLightness = l;
      }
      if (contrastRatio === criteria.targetRatio) { break; }
      l += criteria.incrementCondition(contrastRatio) ? d : -d;
    }

    const nearestRgb = Utils.hslToRgb([h, s, l]);

    if (lastSufficientLightness && ! criteria.hasSufficientContrast(nearestRgb)) {
      return Utils.hslToRgb([h, s, lastSufficientLightness]);
    }

    return nearestRgb;
  }

  /**
   * @private
   */
  static determineMinmax(fixedRgb, otherRgb, initL) {
    if (SearchCriteria.shouldScanDarkerSide(fixedRgb, otherRgb)) {
      return [initL, 0];
    } else {
      return [100, initL];
    }
  }

  /**
   * @private
   */
  static boundaryColor(rgb, max, min, criteria) {
    const blackLuminance = 0.0;
    const whiteLuminance = 1.0;
    const blackRgb = [0, 0, 0];
    const whiteRgb = [255, 255, 255];
    if (min === 0 && ! this.hasSufficientContrast(blackLuminance, rgb, criteria)) {
      return blackRgb;
    }

    if (max === 100 && ! this.hasSufficientContrast(whiteLuminance, rgb, criteria)) {
      return whiteRgb;
    }

    return null;
  }

  /**
   * @private
   */
  static hasSufficientContrast(fixedLuminance, rgb, criteria) {
    const luminance = Checker.relativeLuminance(rgb);
    const ratio = Checker.luminanceToContrastRatio(fixedLuminance, luminance);
    return ratio >= criteria.targetRatio;
  }
}

/** @private */
class BrightnessFinder extends ThresholdFinder {
  /**
   * Tries to find a color whose contrast against the base color is close
   *  to a given level.
   *
   * The returned color is gained by modifying the brightness of otherColor.
   * Even when a color that satisfies the level is not found, it returns
   * a new color anyway.
   * @param {Color} otherColor - The color before the modification of brightness
   * @param {string} [level="AA"] - A, AA or AAA
   * @returns {Color} A color whose contrast against the base color is close to
   *     a specified level
   */
  static find(fixedColor, otherColor, level = "AA") {
    const criteria = SearchCriteria.thresholdCriteria(fixedColor.rgb, otherColor.rgb, level);
    const w = this.calcUpperRatioLimit(otherColor) / 2;
    const upperColor = otherColor.newBrightnessColor(w * 2);

    if (otherColor.isBrighterThan(fixedColor) && ! upperColor.hasSufficientContrast(fixedColor, level)) {
      return upperColor;
    }

    const [r, lastSufficentRatio] = this.calcBrightnessRatio(otherColor.rgb, criteria, w);

    const nearestColor = otherColor.newBrightnessColor(criteria.round(r));

    if (lastSufficentRatio && ! criteria.hasSufficientContrast(nearestColor.rgb)) {
      return otherColor.newBrightnessColor(criteria.round(lastSufficentRatio));
    }

    return nearestColor;
  }

  /**
   * @private
   */
  static calcUpperRatioLimit(color) {
    if (color.isSameColor(color.BLACK)) {
      return 100;
    }

    const darkest = color.rgb
            .filter(c => c !== 0)
            .reduce((a, b) => Math.min(a, b));
    return Math.ceil((255 / darkest) * 100);
  }

  /**
   * @private
   */
  static calcBrightnessRatio(otherRgb, criteria, w) {
    let r = w;
    let lastSufficentRatio = null;

    for (let d of this.binarySearchWidth(w, 0.01)) {
      const newRgb = Utils.BrightnessCalc.calcRgb(otherRgb, r);
      const contrastRatio = criteria.contrastRatio(newRgb);

      if (criteria.hasSufficientContrast(newRgb)) { lastSufficentRatio = r; }
      if (contrastRatio === criteria.targetRatio) { break; }
      r += criteria.incrementCondition(contrastRatio) ? d : -d;
    }

    return [r, lastSufficentRatio];
  }
}

/**
 * Class of which each instance represents a specific color.
 * The instances provide methods to generate a new color with modified
 * properties, such as lightness or saturation.
 */
class Color {
  /**
   * Returns an instance of Color for a predefined color name.
   * @param {string} name - names are defined at
   *     https://www.w3.org/TR/SVG/types.html#ColorKeywords
   * @returns {Color}
   */
  static getByName(name) {
    return this.List.NAME_TO_COLOR.get(name.toLowerCase());
  }

  /**
   * Returns an instance of Color for a hex code
   * @param {string} code - RGB value in hex code
   * @returns {Color}
   */
  static getByHexCode(code) {
    const hexCode = Utils.normalizeHexCode(code);
    return this.List.HEX_TO_COLOR.get(hexCode) || new Color(hexCode);
  }

  /**
   * Creates an instance of Color from an HSL value
   * @param {Array<number,number, number>} hsl - an array of numbers that
   *     represents an HSL value
   * @returns {Color} An instance of Color
   */
  static newHslColor(hsl) {
    return this.getByHexCode(Utils.hslToHexCode(hsl));
  }

  /**
   * @private
   */
  static assignColorConstants() {
    /** @property {Color} BLACK - an instance that represents #000000 */
    this.BLACK = this.List.HEX_TO_COLOR.get("#000000");
    /** @property {Color} WHITE - an instance that represents #ffffff */
    this.WHITE = this.List.HEX_TO_COLOR.get("#ffffff");
    /** @property {Color} GRAY - an instance that represents #808080 */
    this.GRAY = this.List.NAME_TO_COLOR.get("gray");
    this.prototype.BLACK = this.BLACK;
    this.prototype.WHITE = this.WHITE;
    this.prototype.GRAY = this.GRAY;
  }

  /**
   * @param {string|Array<number, number, number>} rgb - RGB value
   *     represented as a string (hex code) or an array of numbers
   * @param {string} [name=null] - the value of this.name: if null,
   *     the value of this.hexCode is set to this.name instead
   */
  constructor(rgb, name = null) {
    /**
     * @property {Array<number, number, number>} rgb - RGB value repsented as
     *     an array of decimal numbers
     */
    this.rgb = Utils.isString(rgb) ? Utils.hexCodeToRgb(rgb) : rgb;
    /**
     * @property {number} relativeLuminance - Relative luminance of  the color
     *     defined at
     *     https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
     */
    this.relativeLuminance = Checker.relativeLuminance(this.rgb);
    /**
     * @property {string} name - If no name is explicitely given, the property
     *     is set to the value of this.hexCode
     */
    this.name = name === null ? Utils.rgbToHexCode(this.rgb) : name;
    /** @property {string} hexCode - RGB value in hex code notation */
    this.hexCode = Utils.rgbToHexCode(this.rgb);
    this.freezeProperties();
    /** @private */
    this._hsl = null;
  }

  /**
   * @property {Array<number, number, number>} hsl - HSL value repsented as
   *     an array of decimal numbers
   */
  get hsl() {
    if (this._hsl) { return this._hsl; }
    this._hsl = Utils.rgbToHsl(this.rgb);
    return this._hsl;
  }

  /**
   * Calculate the contrast ratio against another color
   * @param {Color|string|Array<number, number, number>} color - another color
   *     as an instance of Color, a hex code or a RGB value
   * @returns {number}
   */
  contrastRatioAgainst(color) {
    if (!(color instanceof Color)) {
      return Checker.contrastRatio(this.rgb, color);
    }

    return Checker.luminanceToContrastRatio(this.relativeLuminance,
                                            color.relativeLuminance);
  }

  /**
   * @param {number} ratio - Value in percent
   * @param {string} [name=null] - Name of color
   * @returns {Color}
   */
  newContrastColor(ratio, name = null) {
    return this.generateNewColor(Utils.ContrastCalc, ratio, name);
  }

  /**
   * @param {number} ratio - Value in percent
   * @param {string} [name=null] - Name of color
   * @returns {Color}
   */
  newBrightnessColor(ratio, name = null) {
    return this.generateNewColor(Utils.BrightnessCalc, ratio, name);
  }

  /**
   * @param {number} [ratio=100] - Value in percent
   * @param {string} [name=null] - Name of color
   * @returns {Color}
   */
  newInvertColor(ratio = 100, name = null) {
    return this.generateNewColor(Utils.InvertCalc, ratio, name);
  }

  /**
   * @param {number} degree - Value in degree
   * @param {string} [name=null] - Name of color
   * @returns {Color}
   */
  newHueRotateColor(degree, name = null) {
    return this.generateNewColor(Utils.HueRotateCalc, degree, name);
  }

  /**
   * @param {number} ratio - Value in percent
   * @param {string} [name=null] - Name of color
   * @returns {Color}
   */
  newSaturateColor(ratio, name = null) {
    return this.generateNewColor(Utils.SaturateCalc, ratio, name);
  }

  /**
   * @param {number} [ratio=100] - Conversion ratio in percentage
   * @param {string} [name=null] - Name of color
   * @returns {Color}
   */
  newGrayscaleColor(ratio = 100, name = null) {
    return this.generateNewColor(Utils.GrayscaleCalc, ratio, name);
  }

  /**
   * Tries to find a color whose contrast against the base color is close
   *  to a given level.
   *
   * The returned color is gained by modifying the brightness of otherColor.
   * Even when a color that satisfies the level is not found, it returns
   * a new color anyway.
   * @param {Color} otherColor - The color before the modification of brightness
   * @param {string} [level="AA"] - A, AA or AAA
   * @returns {Color} A color whose contrast against the base color is close to
   *     a specified level
   */
  findBrightnessThreshold(otherColor, level = "AA") {
    return BrightnessFinder.find(this, otherColor, level);
  }

  /**
   * Tries to find a color whose contrast against the base color is close to
   * a given level.
   *
   * The returned color is gained by modifying the lightness of otherColor.
   * Even when a color that satisfies the level is not found, it returns
   * a new color anyway.
   * @param {Color} otherColor - The color before the modification of lightness
   * @param {string} [level="AA"] - A, AA or AAA
   * @returns {Color} A color whose contrast against the base color is close to
   *     a specified level
   */
  findLightnessThreshold(otherColor, level = "AA") {
    const newRgb = LightnessFinder.find(this.rgb, otherColor.rgb, level);
    return new Color(newRgb);
  }

  /**
   * @param {Color} otherColor
   * @returns {string} A, AA or AAA if the contrast ratio meets the criteria of
   *     WCAG 2.0, otherwise "-"
   */
  contrastLevel(otherColor) {
    const ratio = this.contrastRatioAgainst(otherColor);
    return Checker.ratioToLevel(ratio);
  }

  /**
   * Checks if the contrast ratio between the base color and otherColor meets
   * the requirement of WCAG 2.0
   * @param {Color} otherColor
   * @param {string} [level="AA"] - A, AA or AAA
   * @returns {boolean}
   */
  hasSufficientContrast(otherColor, level = "AA") {
    const ratio = Checker.levelToRatio(level);
    return this.contrastRatioAgainst(otherColor) >= ratio;
  }

  /**
   * Checks if the base color and otherColor have the same RGB value
   * @param {Color} otherColor
   * @returns {boolean}
   */
  isSameColor(otherColor) {
    return this.hexCode === otherColor.hexCode;
  }

  /**
   * @returns {boolean} true if each primary color of the base color is 0 or 255
   */
  isMaxContrast() {
    const limits = [0, 255];
    return this.rgb.every(primaryColor => limits.includes(primaryColor));
  }

  /**
   * @returns {boolean} true if the hex code of the color is #808080
   */
  isMinContrast() {
    return this.rgb.every((primaryColor, i) => {
      return this.GRAY.rgb[i] === primaryColor;
    });
  }

  /**
   * Returns a string representation of the color.
   * When 16 is passed, it return the hex code, and when 10 is passed,
   * it returns the value in RGB notation
   * Otherwise, it returns the color name or the hex code
   * @param {number|null} [base=16] - 16, 10 or null
   * @returns {string}
   */
  toString(base = 16) {
    switch (base) {
    case 16:
      return this.hexCode;
    case 10:
      return `rgb(${this.rgb.join(",")})`;
    default:
      return this.name || this.hexCode;
    }
  }

  /**
   * @private
   */
  calcUpperRatioLimit() {
    return BrightnessFinder.calcUpperRatioLimit(this);
  }

  /**
   * @param {Color} otherColor
   * @returns {boolean} true if the relative luminance of the base color is
   *     greater than that of otherColor
   */
  isBrighterThan(otherColor) {
    return this.relativeLuminance > otherColor.relativeLuminance;
  }

  /**
   * @param {Color} otherColor
   * @returns {boolean} true if the relative luminance of the base color is
   *     equal to that of otherColor
   */
  hasSameLuminance(otherColor) {
    return this.relativeLuminance === otherColor.relativeLuminance;
  }

  /**
   * @returns {boolean} true if the contrast ratio against white is qual to or
   *     less than the ratio against black
   */
  isLightColor() {
    return Checker.isLightColor(this.rgb);
  }

  /**
   * @private
   */
  freezeProperties() {
    Object.freeze(this.rgb);
    Object.freeze(this.relativeLuminance);
    Object.freeze(this.name);
    Object.freeze(this.hexCode);
  }

  /**
   * @private
   */
  generateNewColor(calc, ratio, name = null) {
    const newRgb = calc.calcRgb(this.rgb, ratio);
    return new Color(newRgb, name);
  }
}

class List {
  /**
   * @private
   */
  static setup(colorKeywordsJSON) {
    this.loadColorKeywords(colorKeywordsJSON);
    this.generateWebSafeColors();
    Object.freeze(this);
  }

  /**
   * @private
   */
  static loadColorKeywords(colorKeywordsJSON) {
    /**
     * Array of named colors defined at
     * https://www.w3.org/TR/SVG/types.html#ColorKeywords
     * @property {Color[]} NAMED_COLORS
     */
    this.NAMED_COLORS = [];
    /** @private */
    this.NAME_TO_COLOR = new Map();
    /** @private */
    this.HEX_TO_COLOR = new Map();
    colorKeywordsJSON.forEach(keyword => {
      const [name, hex] = keyword;
      const color = new Color(hex, name);
      this.NAMED_COLORS.push(color);
      this.NAME_TO_COLOR.set(name, color);
      this.HEX_TO_COLOR.set(hex, color);
    });

    Object.freeze(this.NAMED_COLORS);
  }

  /**
   * Returns an array of colors which share the same saturation and lightness.
   * By default, so-called pure colors are returned.
   * @param {number} [s=100] - Ratio of saturation in percentage.
   * @param {number} [l=50] - Ratio of lightness in percentage.
   * @param {number} [h_interval=1] - Interval of hues given in degrees.
   *     By default, it returns 360 hues beginning from red.
   *     (Red is included twice, because it corresponds to 0 and 360 degrees.)
   * @returns {Color[]}
   */
  static hslColors(s = 100, l = 50, h_interval = 1) {
    const colors = [];
    for (let h = 0; h < 361; h += h_interval) {
      colors.push(Color.newHslColor([h, s, l]));
    }
    return colors;
  }

  /**
   * @private
   */
  static generateWebSafeColors() {
    /**
     * Array of web safe colors
     * @property {Color[]} WEB_SAFE_COLORS
     */
    this.WEB_SAFE_COLORS = [];

    for (let r = 0; r < 16; r += 3) {
      for (let g = 0; g < 16; g += 3) {
        for (let b = 0; b < 16; b += 3) {
          const hexCode = Utils.rgbToHexCode([r, g, b].map(c => c * 17));
          const predefined = this.HEX_TO_COLOR.get(hexCode);
          const color = predefined || new Color(hexCode);
          this.WEB_SAFE_COLORS.push(color);
        }
      }
    }
  }
}

List.setup(require("./color-keywords.json"));
Color.List = List;
Color.assignColorConstants();

module.exports.Color = Color;
