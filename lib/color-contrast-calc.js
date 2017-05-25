"use strict";

/**
 * Provides methods to calculate RGB colors.
 * An instance represents a RGB color.
 */
class ColorContrastCalc {
  /**
   * @param {string|Array<number, number, number>} rgb - RGB value represented as a string (hex code) or an array of numbers
   * @param {string} name - Name of color
   */
  constructor(rgb, name = null) {
    const ownClass = this.constructor;
    this.rgb = ownClass.isString(rgb) ? ownClass.hexCodeToDecimal(rgb) : rgb;
    this.relativeLuminance = ownClass.relativeLuminance(this.rgb);
    this.name = name === null ? ownClass.decimalToHexCode(this.rgb) : name;
    this.hexCode = ownClass.decimalToHexCode(this.rgb);
    this.freezeProperties();
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
   * Calculate the relative luminance of a RGB color given as a string or an array of numbers
   * @param {string|Array<number, number, number>} rgb - RGB value represented as a string (hex code) or an array of numbers
   * @returns {number} Relative luminance
   */
  static relativeLuminance(rgb = [255, 255, 255]) {
    if (this.isString(rgb)) { rgb = this.hexCodeToDecimal(rgb); }

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
    const [l1, l2] = [foreground, background]
          .map(c => this.relativeLuminance(c))
          .sort((f, b) => b - f);
    return (l1 + 0.05) / (l2 + 0.05);
  }

  /**
   * @param {string} hexCode value in hex code
   * @returns {Array<number, number, number>} RGB value represented as an array of numbers
   */
  static hexCodeToDecimal(hexCode) {
    const h = this.normalizeHexCode(hexCode);
    return [0, 2, 4].map(s => h.substr(s, 2))
      .map(primaryColor => Number.parseInt(primaryColor, 16));
  }

  /**
   * @private
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
   * Check if a given array is a valid representation of RGB color.
   * @param {Array<number, number, number>} rgb - RGB value represented as an array of numbers
   * @returns {boolean} true if the argument is a valid RGB color
   */
  static isValidRgb(rgb) {
    return rgb.length === 3 &&
      rgb.every(c => c >= 0 && c <= 255 &&
                Number.isInteger(c));
  }

  /**
   * Check if a given string is a valid representation of RGB color.
   * @param {string} code - RGB value in hex code
   * @returns {boolean} returns true if then argument is a valid RGB color
   */
  static isValidHexCode(code) {
    return this.HEX_CODE_RE.test(code);
  }

  /**
   * @private
   */
  static isString(str) {
    return typeof str === "string" || str instanceof String;
  }

  /**
   * Returns an instance of ColorContrastCalc for a predefined color name.
   * @param {string} name - names are defined at https://www.w3.org/TR/SVG/types.html#ColorKeywords
   * @returns {ColorContrastCalc}
   */
  static getByName(name) {
    return this.NAME_TO_COLOR.get(name);
  }

  /**
   * Returns an instance of ColorContrastCalc for a hex code
   * @param {string} code - RGB value in hex code
   * @returns {ColorContrastCalc}
   */
  static getByHexCode(code) {
    const registeredCode = this.HEX_TO_COLOR.get(code);
    return registeredCode ? registeredCode : new ColorContrastCalc(code);
  }

  /**
   * @private
   */
  static setup(colorKeywordsJSON) {
    this.loadColorKeywords(colorKeywordsJSON);
    this.assignColorConstants();
    this.generateWebSafeColors();
    this.HEX_CODE_RE = /^#?[0-9a-f]{3}([0-9a-f]{3})?$/i;
  }

  /**
   * @private
   */
  static loadColorKeywords(colorKeywordsJSON) {
    /* https://www.w3.org/TR/SVG/types.html#ColorKeywords */
    this.NAMED_COLORS = [];
    this.NAME_TO_COLOR = new Map();
    this.HEX_TO_COLOR = new Map();
    colorKeywordsJSON.forEach(color => {
      const [name, hex] = color;
      const calc = new ColorContrastCalc(hex, name);
      this.NAMED_COLORS.push(calc);
      this.NAME_TO_COLOR.set(name, calc);
      this.HEX_TO_COLOR.set(hex, calc);
    });

    Object.freeze(this.NAMED_COLORS);
  }

  /**
   * @private
   */
  static assignColorConstants() {
    this.BLACK = this.HEX_TO_COLOR.get("#000000");
    this.WHITE = this.HEX_TO_COLOR.get("#ffffff");
    this.GRAY = this.NAME_TO_COLOR.get("gray");
    this.prototype.BLACK = this.BLACK;
    this.prototype.WHITE = this.WHITE;
    this.prototype.GRAY = this.GRAY;
    Object.freeze(this.BLACK);
    Object.freeze(this.WHITE);
    Object.freeze(this.GRAY);
    Object.freeze(this.prototype.BLACK);
    Object.freeze(this.prototype.WHITE);
    Object.freeze(this.prototype.GRAY);
  }

  /**
   * @private
   */
  static generateWebSafeColors() {
    this.WEB_SAFE_COLORS = [];

    for (let r = 0; r < 16; r += 3) {
      for (let g = 0; g < 16; g += 3) {
        for (let b = 0; b < 16; b += 3) {
          let hexCode = this.decimalToHexCode([r, g, b].map(c => c * 17));
          let predefined = this.HEX_TO_COLOR.get(hexCode);
          let color = predefined ? predefined : new ColorContrastCalc(hexCode);
          this.WEB_SAFE_COLORS.push(color);
        }
      }
    }
  }

  contrastRatioAgainst(color) {
    if (!(color instanceof ColorContrastCalc)) {
      return this.constructor.contrastRatio(this.rgb, color);
    }

    const [l1, l2] = [this.relativeLuminance, color.relativeLuminance]
          .sort((s, o) => o - s);
    return (l1 + 0.05) / (l2 + 0.05);
  }

  colorsWithSufficientContrast(level = "AA") {
    const ratio = this.levelToContrastRatio(level);

    return this.constructor.NAMED_COLORS.filter(combinedColor => {
      return this.contrastRatioAgainst(combinedColor) >= ratio;
    });
  }

  newContrastColor(ratio, name = null) {
    const newRgb = this.rgb.map(c => this.calcNewContrast(c, ratio));
    return new ColorContrastCalc(newRgb, name);
  }

  newBrightnessColor(ratio, name = null) {
    const newRgb = this.rgb.map(c => this.calcNewBrightness(c, ratio));
    return new ColorContrastCalc(newRgb, name);
  }

  newInvertColor(ratio, name = null) {
    /*
       https://www.w3.org/TR/filter-effects-1/#invertEquivalent
       https://www.w3.org/TR/SVG/filters.html#TransferFunctionElementAttributes
    */
    const newRgb = this.rgb.map(c => {
      return Math.round((100 * c - 2 * c * ratio + 255 * ratio) / 100);
    });

    return new ColorContrastCalc(newRgb, name);
  }

  newHueRotateColor(degree, name = null) {
    return this.generateNewColor(this.constructor.HueRotateCalc, degree, name);
  }

  newSaturateColor(ratio, name = null) {
    return this.generateNewColor(this.constructor.SaturateCalc, ratio, name);
  }

  newGrayscaleColor(ratio, name = null) {
    return this.generateNewColor(this.constructor.GrayscaleCalc, ratio, name);
  }

  findBrightnessThreshold(otherColor, level = "AA") {
    const targetRatio = this.levelToContrastRatio(level);
    const criteria = this.brightnessThresholdCriteria(targetRatio, otherColor);
    const w = otherColor.calcUpperRatioLimit() / 2;
    let r = w;
    let lastSufficentRatio = null;

    for (let d of ColorContrastCalc.binarySearchWidth(w, 0.01)) {
      let newColor = otherColor.newBrightnessColor(r);
      let contrastRatio = newColor.contrastRatioAgainst(this);

      if (contrastRatio >= targetRatio) { lastSufficentRatio = r; }
      if (contrastRatio === targetRatio) { break; }
      r += criteria.incrementCondition(contrastRatio) ? d : -d;
    }

    const nearestColor = otherColor.newBrightnessColor(criteria.round(r));

    if (lastSufficentRatio && nearestColor.contrastRatioAgainst(this) < targetRatio) {
      return otherColor.newBrightnessColor(criteria.round(lastSufficentRatio));
    }

    return nearestColor;
  }

  contrastLevel(otherColor) {
    const ratio = this.contrastRatioAgainst(otherColor);
    if (ratio >= 7) {
      return "AAA";
    } else if (ratio >= 4.5) {
      return "AA";
    } else if (ratio >= 3) {
      return "A";
    }

    return "-";
  }

  hasSufficientContrast(otherColor, level = "AA") {
    const ratio = this.levelToContrastRatio(level);
    return this.contrastRatioAgainst(otherColor) >= ratio;
  }

  isSameColor(otherColor) {
    return this.hexCode === otherColor.hexCode;
  }

  isMaxContrast() {
    const limits = [0, 255];
    return this.rgb.every(primaryColor => limits.includes(primaryColor));
  }

  isMinContrast() {
    return this.rgb.every((primaryColor, i) => {
      return this.GRAY.rgb[i] === primaryColor;
    });
  }

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

  levelToContrastRatio(level) {
    if (level === "A" || level === 1) {
      return 3.0;
    } else if (level === "AA" || level === 2) {
      return 4.5;
    } else if (level === "AAA" || level === 3) {
      return 7.0;
    }
  }

  calcNewContrast(origColor, ratio = 100) {
    /*
       https://www.w3.org/TR/filter-effects/#funcdef-contrast
       https://www.w3.org/TR/SVG/filters.html#TransferFunctionElementAttributes
    */
    const newColor = Math.round((origColor * ratio + 255 * (50 - ratio / 2)) / 100);
    return this.clampToRange(newColor, 0, 255);
  }

  calcNewBrightness(origColor, ratio = 100) {
    /*
       https://www.w3.org/TR/filter-effects/#funcdef-brightness
       https://www.w3.org/TR/SVG/filters.html#TransferFunctionElementAttributes
    */
    return this.clampToRange(Math.round(origColor * ratio / 100), 0, 255);
  }

  calcUpperRatioLimit() {
    if (this.isSameColor(this.BLACK)) {
      return 100;
    }

    const darkest = this.rgb
            .filter(c => c !== 0)
            .reduce((a, b) => Math.min(a, b));
    return Math.ceil((255 / darkest) * 100);
  }

  brightnessThresholdCriteria(targetRatio, otherColor) {
    const criteria = {};

    if (this.isBrighterThan(otherColor) ||
        this.hasSameLuminance(otherColor) && this.isLightColor()) {
      criteria.round = (r) => Math.floor(r * 10 ) / 10;
      criteria.incrementCondition = (contrastRatio) => contrastRatio > targetRatio;
    } else {
      criteria.round = (r) => Math.ceil(r * 10) / 10;
      criteria.incrementCondition = (contrastRatio) => targetRatio > contrastRatio;
    }

    return criteria;
  }

  isBrighterThan(otherColor) {
    return this.relativeLuminance > otherColor.relativeLuminance;
  }

  hasSameLuminance(otherColor) {
    return this.relativeLuminance === otherColor.relativeLuminance;
  }

  isLightColor() {
    return this.WHITE.contrastRatioAgainst(this) <= this.BLACK.contrastRatioAgainst(this);
  }

  freezeProperties() {
    Object.freeze(this.rgb);
    Object.freeze(this.relativeLuminance);
    Object.freeze(this.name);
    Object.freeze(this.hexCode);
  }

  clampToRange(value, lowerBound, upperBound) {
    if (value <= lowerBound) {
      return lowerBound;
    } else if (value > upperBound) {
      return upperBound;
    }
    return value;
  }

  generateNewColor(calc, ratio, name = null) {
    const newRgb = calc.calcRgb(ratio, this.rgb);
    return new ColorContrastCalc(newRgb.map(c => {
      return this.clampToRange(Math.round(c), 0, 255);
    }), name);
  }
}

ColorContrastCalc.binarySearchWidth = function*(initWidth, min) {
  let i = 0;
  let d = initWidth / Math.pow(2, i);

  while (d > min) {
    yield d;
    i++;
    d = initWidth / Math.pow(2, i);
  }
};

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
        let s = 0;
        row.forEach((c, i) => s += c * vector[i]);
        return s;
      });
    }
  }

  ColorContrastCalc.Matrix = Matrix;

  class HueRotateCalc {
    /*
       https://www.w3.org/TR/filter-effects/#funcdef-hue-rotate
       https://www.w3.org/TR/SVG/filters.html#TransferFunctionElementAttributes
    */
    static calcRgb(deg, rgb) {
      return this.calcRotation(deg).multiply(rgb);
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
                                      [-0.213,0.285, -0.072],
                                      [-0.213, -0.715, 0.928]]);

  HueRotateCalc.sinPart = new Matrix([[-0.213, -0.715, 0.928],
                                      [0.143, 0.140, -0.283],
                                      [-0.787, 0.715, 0.072]]);

  ColorContrastCalc.HueRotateCalc = HueRotateCalc;

  class SaturateCalc {
    /*
       https://www.w3.org/TR/filter-effects/#funcdef-saturate
       https://www.w3.org/TR/SVG/filters.html#feColorMatrixElement
     */
    static calcRgb(s, rgb) {
      return this.calcSaturation(s).multiply(rgb);
    }

    static calcSaturation(s) {
      return this.constPart.add(this.saturatePart.multiply(s / 100));
    }
  }

  SaturateCalc.constPart = HueRotateCalc.constPart;
  SaturateCalc.saturatePart = HueRotateCalc.cosPart;

  ColorContrastCalc.SaturateCalc = SaturateCalc;

  class GrayscaleCalc {
    /*
       https://www.w3.org/TR/filter-effects/#funcdef-grayscale
       https://www.w3.org/TR/filter-effects/#grayscaleEquivalent
       https://www.w3.org/TR/SVG/filters.html#feColorMatrixElement
    */
    static calcRgb(s, rgb) {
      return this.calcGrayscale(s).multiply(rgb);
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

  ColorContrastCalc.GrayscaleCalc = GrayscaleCalc;
})();

ColorContrastCalc.setup(require("./color-keywords.json"));

module.exports.ColorContrastCalc = ColorContrastCalc;
