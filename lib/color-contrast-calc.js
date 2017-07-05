"use strict";

const ColorUtils = require("./color-utils").ColorUtils;
const Utils = ColorUtils;

/**
 * Provides methods to calculate RGB colors.
 * An instance represents a RGB color.
 */
class ColorContrastCalc {
  /**
   * @param {string|Array<number, number, number>} rgb - RGB value represented as a string (hex code) or an array of numbers
   * @param {string} [name=null] - the value of this.name: if null, the value of this.hexCode is set to this.name instead
   */
  constructor(rgb, name = null) {
    const ownClass = this.constructor;
    /** @property {Array<number, number, number>} rgb - RGB value repsented as an array of decimal numbers */
    this.rgb = Utils.isString(rgb) ? Utils.hexCodeToDecimal(rgb) : rgb;
    /** @property {number} relativeLuminance - The relative luminance of the color */
    this.relativeLuminance = ownClass.relativeLuminance(this.rgb);
    /** @property {string} name - If no name is explicitely given, the property is set to the value of this.hexCode */
    this.name = name === null ? Utils.decimalToHexCode(this.rgb) : name;
    /** @property {string} hexCode - The RGB value in hex code notation */
    this.hexCode = Utils.decimalToHexCode(this.rgb);
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
    const [l1, l2] = [foreground, background]
          .map(c => this.relativeLuminance(c))
          .sort((f, b) => b - f);
    return (l1 + 0.05) / (l2 + 0.05);
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
   * Returns a function to be used as a parameter of Array.prototype.sort()
   * @param {string} [colorOrder="rgb"] - A left side primary color has a higher sorting precedence
   * @param {string} [keyType="color"] - Type of keys used for sorting: "color", "hex" or "rgb"
   * @param {function} [keyMapper=null] - A function used to retrive key values from elements to be sorted
   * @returns {function} Function that compares given two colors
   */
  static compareFunction(colorOrder = "rgb", keyType = "color", keyMapper = null) {
    return this.Sorter.compareFunction(colorOrder, keyType, keyMapper);
  }

  /**
   * Sorts colors in an array and returns the result as a new array
   * @param {ColorContrastCalc[]|String[]} colors - List of colors
   * @param {string} [colorOrder="rgb"] - A left side primary color has a higher sorting precedence
   * @param {function} [keyMapper=null] - A function used to retrive key values from elements to be sorted
   * @param {string} [mode="auto"] - If set to "hex", key values are handled as hex code strings
   * @returns {ColorContrastCalc[]} An array of sorted colors
   */
  static sort(colors, colorOrder = "rgb", keyMapper = null, mode = "auto") {
    return this.Sorter.sort(colors, colorOrder, keyMapper, mode);
  }

  /**
   * @private
   */
  static setup(colorKeywordsJSON) {
    this.loadColorKeywords(colorKeywordsJSON);
    this.assignColorConstants();
    this.generateWebSafeColors();
  }

  /**
   * @private
   */
  static loadColorKeywords(colorKeywordsJSON) {
    /**
     * Array of named colors defined at https://www.w3.org/TR/SVG/types.html#ColorKeywords
     * @property {ColorContrastCalc[]} NAMED_COLORS
     */
    this.NAMED_COLORS = [];
    /** @private */
    this.NAME_TO_COLOR = new Map();
    /** @private */
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
    /** @property {ColorContrastCalc} BLACK - an instance that represents #000000 */
    this.BLACK = this.HEX_TO_COLOR.get("#000000");
    /** @property {ColorContrastCalc} WHITE - an instance that represents #ffffff */
    this.WHITE = this.HEX_TO_COLOR.get("#ffffff");
    /** @property {ColorContrastCalc} GRAY - an instance that represents #808080 */
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
    /**
     * Array of web safe colors
     * @property {ColorContrastCalc[]} WEB_SAFE_COLORS
     */
    this.WEB_SAFE_COLORS = [];

    for (let r = 0; r < 16; r += 3) {
      for (let g = 0; g < 16; g += 3) {
        for (let b = 0; b < 16; b += 3) {
          let hexCode = Utils.decimalToHexCode([r, g, b].map(c => c * 17));
          let predefined = this.HEX_TO_COLOR.get(hexCode);
          let color = predefined ? predefined : new ColorContrastCalc(hexCode);
          this.WEB_SAFE_COLORS.push(color);
        }
      }
    }
  }

  /**
   * Calculate the contrast ratio against another color
   * @param {ColorContrastCalc|string|Array<number, number, number>} color - another instance of ColorContrastCalc or a RGB value
   * @returns {number}
   */
  contrastRatioAgainst(color) {
    if (!(color instanceof ColorContrastCalc)) {
      return this.constructor.contrastRatio(this.rgb, color);
    }

    const [l1, l2] = [this.relativeLuminance, color.relativeLuminance]
          .sort((s, o) => o - s);
    return (l1 + 0.05) / (l2 + 0.05);
  }

  /**
   * Returns an array of named colors that satisfy a given level of contrast ratio
   * @param {string} [level="AA"] - A, AA or AAA
   * @returns {ColorContrastCalc[]}
   */
  colorsWithSufficientContrast(level = "AA") {
    const ratio = this.levelToContrastRatio(level);

    return this.constructor.NAMED_COLORS.filter(combinedColor => {
      return this.contrastRatioAgainst(combinedColor) >= ratio;
    });
  }

  /**
   * @param {number} ratio - Value in percent
   * @param {string} [name=null] - Name of color
   * @returns {ColorContrastCalc}
   */
  newContrastColor(ratio, name = null) {
    const newRgb = this.rgb.map(c => this.calcNewContrast(c, ratio));
    return new ColorContrastCalc(newRgb, name);
  }

  /**
   * @param {number} ratio - Value in percent
   * @param {string} [name=null] - Name of color
   * @returns {ColorContrastCalc}
   */
  newBrightnessColor(ratio, name = null) {
    const newRgb = this.rgb.map(c => this.calcNewBrightness(c, ratio));
    return new ColorContrastCalc(newRgb, name);
  }

  /**
   * @param {number} ratio - Value in percent
   * @param {string} [name=null] - Name of color
   * @returns {ColorContrastCalc}
   */
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

  /**
   * @param {number} degree - Value in degree
   * @param {string} [name=null] - Name of color
   * @returns {ColorContrastCalc}
   */
  newHueRotateColor(degree, name = null) {
    return this.generateNewColor(this.constructor.HueRotateCalc, degree, name);
  }

  /**
   * @param {number} ratio - Value in percent
   * @param {string} [name=null] - Name of color
   * @returns {ColorContrastCalc}
   */
  newSaturateColor(ratio, name = null) {
    return this.generateNewColor(this.constructor.SaturateCalc, ratio, name);
  }

  /**
   * @param {number} ratio - Value in percent
   * @param {string} [name=null] - Name of color
   * @returns {ColorContrastCalc}
   */
  newGrayscaleColor(ratio, name = null) {
    return this.generateNewColor(this.constructor.GrayscaleCalc, ratio, name);
  }

  /**
   * Tries to find a color whose contrast against the base color is close to a given level.
   *
   * The returned color is gained by modifying the brightness of otherColor.
   * Even when a color that satisfies the level is not found, it returns a new color anyway.
   * @param {ColorContrastCalc} otherColor - The color before the modification of brightness
   * @param {string} [level="AA"] - A, AA or AAA
   * @returns {ColorContrastCalc} A color whose contrast against the base color is close to a specified level
   */
  findBrightnessThreshold(otherColor, level = "AA") {
    const targetRatio = this.levelToContrastRatio(level);
    const criteria = this.brightnessThresholdCriteria(targetRatio, otherColor);
    const w = otherColor.calcUpperRatioLimit() / 2;
    const upperColor = otherColor.newBrightnessColor(w * 2);

    if (otherColor.isBrighterThan(this) && ! upperColor.hasSufficientContrast(this, level)) {
      return upperColor;
    }

    const [r, lastSufficentRatio] = this.calcBrightnessRatio(otherColor, targetRatio, criteria, w);

    const nearestColor = otherColor.newBrightnessColor(criteria.round(r));

    if (lastSufficentRatio && nearestColor.contrastRatioAgainst(this) < targetRatio) {
      return otherColor.newBrightnessColor(criteria.round(lastSufficentRatio));
    }

    return nearestColor;
  }

  /**
   * @param {ColorContrastCalc} otherColor
   * @returns {string} A, AA or AAA if the contrast ratio meets the criteria of WCAG 2.0, otherwise "-"
   */
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

  /**
   * Checks if the contrast ratio between the base color and otherColor meets the requirement of WCAG 2.0
   * @param {ColorContrastCalc} otherColor
   * @param {string} [level="AA"] - A, AA or AAA
   * @returns {boolean}
   */
  hasSufficientContrast(otherColor, level = "AA") {
    const ratio = this.levelToContrastRatio(level);
    return this.contrastRatioAgainst(otherColor) >= ratio;
  }

  /**
   * Checks if the base color and otherColor have the same RGB value
   * @param {ColorContrastCalc} otherColor
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
   * When 16 is passed, it return the hex code, and when 10 is passed, it returns the value in RGB notation
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
  levelToContrastRatio(level) {
    if (level === "A" || level === 1) {
      return 3.0;
    } else if (level === "AA" || level === 2) {
      return 4.5;
    } else if (level === "AAA" || level === 3) {
      return 7.0;
    }
  }

  /**
   * @private
   */
  calcNewContrast(origColor, ratio = 100) {
    /*
       https://www.w3.org/TR/filter-effects/#funcdef-contrast
       https://www.w3.org/TR/SVG/filters.html#TransferFunctionElementAttributes
    */
    const newColor = Math.round((origColor * ratio + 255 * (50 - ratio / 2)) / 100);
    return this.clampToRange(newColor, 0, 255);
  }

  /**
   * @private
   */
  calcNewBrightness(origColor, ratio = 100) {
    /*
       https://www.w3.org/TR/filter-effects/#funcdef-brightness
       https://www.w3.org/TR/SVG/filters.html#TransferFunctionElementAttributes
    */
    return this.clampToRange(Math.round(origColor * ratio / 100), 0, 255);
  }

  /**
   * @private
   */
  calcBrightnessRatio(otherColor, targetRatio, criteria, w) {
    let r = w;
    let lastSufficentRatio = null;

    for (let d of ColorContrastCalc.binarySearchWidth(w, 0.01)) {
      let newColor = otherColor.newBrightnessColor(r);
      let contrastRatio = newColor.contrastRatioAgainst(this);

      if (contrastRatio >= targetRatio) { lastSufficentRatio = r; }
      if (contrastRatio === targetRatio) { break; }
      r += criteria.incrementCondition(contrastRatio) ? d : -d;
    }

    return [r, lastSufficentRatio];
  }

  /**
   * @private
   */
  calcUpperRatioLimit() {
    if (this.isSameColor(this.BLACK)) {
      return 100;
    }

    const darkest = this.rgb
            .filter(c => c !== 0)
            .reduce((a, b) => Math.min(a, b));
    return Math.ceil((255 / darkest) * 100);
  }

  /**
   * @private
   */
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

  /**
   * @param {ColorContrastCalc} otherColor
   * @returns {boolean} true if the relative luminance of the base color is greater than that of otherColor
   */
  isBrighterThan(otherColor) {
    return this.relativeLuminance > otherColor.relativeLuminance;
  }

  /**
   * @param {ColorContrastCalc} otherColor
   * @returns {boolean} true if the relative luminance of the base color is equal to that of otherColor
   */
  hasSameLuminance(otherColor) {
    return this.relativeLuminance === otherColor.relativeLuminance;
  }

  /**
   * @returns {boolean} true if the contrast ratio against white is qual to/ less than the ratio against black
   */
  isLightColor() {
    return this.WHITE.contrastRatioAgainst(this) <= this.BLACK.contrastRatioAgainst(this);
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
  clampToRange(value, lowerBound, upperBound) {
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
  generateNewColor(calc, ratio, name = null) {
    const newRgb = calc.calcRgb(ratio, this.rgb);
    return new ColorContrastCalc(newRgb.map(c => {
      return this.clampToRange(Math.round(c), 0, 255);
    }), name);
  }
}

ColorContrastCalc.binarySearchWidth = function*(initWidth, min) {
  let i = 1;
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
        return row.reduce((s, c, i) => s += c * vector[i], 0);
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

  class Sorter {
    static sort(colors, colorOrder = "rgb", keyMapper = null, mode = "auto") {
      const keyType = this.guessKeyType(mode, colors[0], keyMapper);
      const compare = this.compareFunction(colorOrder, keyType, keyMapper);

      return colors.slice().sort(compare);
    }

    static compareFunction(colorOrder = "rgb",
                           keyType = this.KEY_TYPE.COLOR,
                           keyMapper = null) {
      let compare = null;

      if (keyType === this.KEY_TYPE.HEX) {
        compare = this.compareHexFunction(colorOrder);
      } else if (keyType === this.KEY_TYPE.RGB) {
        compare = this.compareRgbFunction(colorOrder);
      } else {
        compare = this.compareColorFunction(colorOrder);
      }

      return this.composeFunction(compare, keyMapper);
    }

    static composeFunction(compareFunc, keyMapper = null) {
      if (! keyMapper) {
        return compareFunc;
      }

      return function(color1, color2) {
        return compareFunc(keyMapper(color1), keyMapper(color2));
      };
    }

    static guessKeyType(mode, color, keyMapper) {
      if (mode === this.KEY_TYPE.HEX ||
          mode === "auto" && this.isStringKey(color, keyMapper)) {
        return this.KEY_TYPE.HEX;
      } else if (mode === this.KEY_TYPE.RGB) {
        return this.KEY_TYPE.RGB;
      } else {
        return this.KEY_TYPE.COLOR;
      }
    }

    static isStringKey(color, keyMapper) {
      const keyType = keyMapper ? keyMapper(color) : color;
      return Utils.isString(keyType);
    }

    static compareColorFunction(colorOrder = "rgb") {
      const rgbPos = Sorter.primaryColorPos(colorOrder);
      const compFuncs = Sorter.chooseCompFunc(colorOrder);

      return function(color1, color2) {
        return Sorter.compareRgbVal(color1.rgb, color2.rgb, rgbPos, compFuncs);
      };
    }

    static compareRgbFunction(colorOrder = "rgb") {
      const rgbPos = Sorter.primaryColorPos(colorOrder);
      const compFuncs = Sorter.chooseCompFunc(colorOrder);

      return function(rgb1, rgb2) {
        return Sorter.compareRgbVal(rgb1, rgb2, rgbPos, compFuncs);
      };
    }

    static compareHexFunction(colorOrder = "rgb") {
      const rgbPos = Sorter.primaryColorPos(colorOrder);
      const compFuncs = Sorter.chooseCompFunc(colorOrder);
      const rgbCache = new Map();

      return function(hex1, hex2) {
        return Sorter.compareHexVal(hex1, hex2, rgbPos, compFuncs, rgbCache);
      };
    }

    static compareRgbVal(rgb1, rgb2, rgbPos = [0, 1, 2],
                      compFuncs = this.defaultCompFuncs) {
      for (let i of rgbPos) {
        const result = compFuncs[i](rgb1[i], rgb2[i]);
        if (result !== 0) { return result; }
      }

      return 0;
    }

    static compareHexVal(hex1, hex2, rgbPos, compFuncs, rgbCache) {
      const rgb1 = rgbCache.get(hex1) || Utils.hexCodeToDecimal(hex1);
      const rgb2 = rgbCache.get(hex2) || Utils.hexCodeToDecimal(hex2);

      return this.compareRgbVal(rgb1, rgb2, rgbPos, compFuncs);
    }

    static primaryColorPos(colorOrder) {
      return colorOrder.toLowerCase().split("").map((primary) => {
        return this.RGB_IDENTIFIERS.indexOf(primary);
      });
    }

    static ascendComp(primaryColor1, primaryColor2) {
      return primaryColor1 - primaryColor2;
    }

    static descendComp(primaryColor1, primaryColor2) {
      return primaryColor2 - primaryColor1;
    }

    static chooseCompFunc(colorOrder) {
      const primaryColors = colorOrder.split("")
              .sort(this.caseInsensitiveComp).reverse();

      return primaryColors.map(primary => {
        if (Utils.isUpperCase(primary)) {
          return this.descendComp;
        }

        return this.ascendComp;
      });
    }

    static caseInsensitiveComp(str1, str2) {
      const lStr1 = str1.toLowerCase();
      const lStr2 = str2.toLowerCase();

      if (lStr1 < lStr2) { return -1; }
      if (lStr1 > lStr2) { return 1; }
      return 0;
    }

    static setup() {
      this.RGB_IDENTIFIERS = ["r", "g", "b"];
      this.defaultCompFuncs = [
        Sorter.ascendComp,
        Sorter.ascendComp,
        Sorter.ascendComp
      ];
      this.KEY_TYPE = {
        RGB: "rgb",
        HEX: "hex",
        COLOR: "color"
      };
    }
  }

  Sorter.setup();

  ColorContrastCalc.Sorter = Sorter;
})();

ColorContrastCalc.setup(require("./color-keywords.json"));

module.exports.ColorUtils = ColorUtils;
module.exports.ColorContrastCalc = ColorContrastCalc;
