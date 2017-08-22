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
    /** @private */
    this._hsl = null;
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
    const hexCode = Utils.normalizeHexCode(code);
    const registeredCode = this.HEX_TO_COLOR.get(hexCode);
    return registeredCode ? registeredCode : new ColorContrastCalc(hexCode);
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
   * @param {string} [colorOrder="rgb"] - A left side primary color has a higher sorting precedence, and an uppercase letter means descending order
   * @param {function} [keyMapper=null] - A function used to retrive key values from elements to be sorted
   * @param {string} [mode="auto"] - If set to "hex", key values are handled as hex code strings
   * @returns {ColorContrastCalc[]} An array of sorted colors
   */
  static sort(colors, colorOrder = "rgb", keyMapper = null, mode = "auto") {
    return this.Sorter.sort(colors, colorOrder, keyMapper, mode);
  }

  /**
   * Creates an instance of ColorContractCalc from an HSL value
   * @param {Array<number,number, number>} hsl - an array of numbers that represents an HSL value
   * @returns {ColorContrastCalc} An instance of ColorContrastCalc
   */
  static newHslColor(hsl) {
    return this.getByHexCode(Utils.hslToHexCode(hsl));
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
  static setup(colorKeywordsJSON) {
    this.loadColorKeywords(colorKeywordsJSON);
    this.assignColorConstants();
    this.generateWebSafeColors();
    Object.freeze(this);
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
   * @property {Array<number, number, number>} hsl - HSL value repsented as an array of decimal numbers
   */
  get hsl() {
    if (this._hsl) { return this._hsl; }
    this._hsl = Utils.rgbToHsl(this.rgb);
    return this._hsl;
  }

  /**
   * Calculate the contrast ratio against another color
   * @param {ColorContrastCalc|string|Array<number, number, number>} color - another instance of ColorContrastCalc or a RGB value
   * @returns {number}
   */
  contrastRatioAgainst(color) {
    const ownClass = this.constructor;

    if (!(color instanceof ColorContrastCalc)) {
      return ownClass.contrastRatio(this.rgb, color);
    }

    return ownClass.luminanceToContrastRatio(this.relativeLuminance,
                                             color.relativeLuminance);
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
    return this.generateNewColor(Utils.ContrastCalc, ratio, name);
  }

  /**
   * @param {number} ratio - Value in percent
   * @param {string} [name=null] - Name of color
   * @returns {ColorContrastCalc}
   */
  newBrightnessColor(ratio, name = null) {
    return this.generateNewColor(Utils.BrightnessCalc, ratio, name);
  }

  /**
   * @param {number} ratio - Value in percent
   * @param {string} [name=null] - Name of color
   * @returns {ColorContrastCalc}
   */
  newInvertColor(ratio, name = null) {
    return this.generateNewColor(Utils.InvertCalc, ratio, name);
  }

  /**
   * @param {number} degree - Value in degree
   * @param {string} [name=null] - Name of color
   * @returns {ColorContrastCalc}
   */
  newHueRotateColor(degree, name = null) {
    return this.generateNewColor(Utils.HueRotateCalc, degree, name);
  }

  /**
   * @param {number} ratio - Value in percent
   * @param {string} [name=null] - Name of color
   * @returns {ColorContrastCalc}
   */
  newSaturateColor(ratio, name = null) {
    return this.generateNewColor(Utils.SaturateCalc, ratio, name);
  }

  /**
   * @param {number} ratio - Value in percent
   * @param {string} [name=null] - Name of color
   * @returns {ColorContrastCalc}
   */
  newGrayscaleColor(ratio, name = null) {
    return this.generateNewColor(Utils.GrayscaleCalc, ratio, name);
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
   * Tries to find a color whose contrast against the base color is close to a given level.
   *
   * The returned color is gained by modifying the lightness of otherColor.
   * Even when a color that satisfies the level is not found, it returns a new color anyway.
   * @param {ColorContrastCalc} otherColor - The color before the modification of lightness
   * @param {string} [level="AA"] - A, AA or AAA
   * @returns {ColorContrastCalc} A color whose contrast against the base color is close to a specified level
   */
  findLightnessThreshold(otherColor, level = "AA") {
    const targetRatio = this.levelToContrastRatio(level);
    const criteria = this.brightnessThresholdCriteria(targetRatio, otherColor);
    const [h, s, initL] = Utils.rgbToHsl(otherColor.rgb);
    const [max, min] = this.shouldScanDarkerSide(otherColor) ? [initL, 0] : [100, initL];
    const boundaryColor = this.lightnessBoundaryColor(max, min, level);

    if (boundaryColor) { return boundaryColor; }

    let l = (max + min) / 2;
    let lastSufficientLightness = null;

    for (let d of ColorContrastCalc.binarySearchWidth(max - min, 0.01)) {
      let newColor = Utils.hslToRgb([h, s, l]);
      let contrastRatio = this.contrastRatioAgainst(newColor);

      if (contrastRatio >= targetRatio) { lastSufficientLightness = l; }
      if (contrastRatio === targetRatio) { break; }
      l += criteria.incrementCondition(contrastRatio) ? d : -d;
    }

    const nearlestColor = ColorContrastCalc.newHslColor([h, s, l]);

    if (lastSufficientLightness && nearlestColor.contrastRatioAgainst(this) < targetRatio) {
      return ColorContrastCalc.newHslColor([h, s, lastSufficientLightness]);
    }

    return nearlestColor;
  }

  /**
   * @private
   */
  shouldScanDarkerSide(otherColor) {
    if (this.isBrighterThan(otherColor) ||
        this.isSameColor(otherColor) && this.isLightColor()) {
      return true;
    }
    return false;
  }

  /**
   * @private
   */
  lightnessBoundaryColor(max, min, level) {
    if (min === 0 && ! this.hasSufficientContrast(this.BLACK, level)) {
      return this.BLACK;
    }

    if (max === 100 && ! this.hasSufficientContrast(this.WHITE, level)) {
      return this.WHITE;
    }

    return null;
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
  calcBrightnessRatio(otherColor, targetRatio, criteria, w) {
    const otherRgb = otherColor.rgb;
    let r = w;
    let lastSufficentRatio = null;

    for (let d of ColorContrastCalc.binarySearchWidth(w, 0.01)) {
      const newRgb = Utils.BrightnessCalc.calcRgb(otherRgb, r);
      const contrastRatio = this.calcContrastRatio(newRgb);

      if (contrastRatio >= targetRatio) { lastSufficentRatio = r; }
      if (contrastRatio === targetRatio) { break; }
      r += criteria.incrementCondition(contrastRatio) ? d : -d;
    }

    return [r, lastSufficentRatio];
  }

  /**
   * @private
   */
  calcContrastRatio(otherRgb) {
    const otherLuminance = ColorContrastCalc.relativeLuminance(otherRgb);
    return ColorContrastCalc.luminanceToContrastRatio(this.relativeLuminance,
                                                      otherLuminance);
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
  generateNewColor(calc, ratio, name = null) {
    const newRgb = calc.calcRgb(this.rgb, ratio);
    return new ColorContrastCalc(newRgb, name);
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
      } else if (this.isComponentType(keyType)) {
        compare = this.compareComponentsFunction(colorOrder);
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
      } else if (this.isComponentType(mode) || Array.isArray(color)) {
        return this.KEY_TYPE.COMPONENTS;
      } else {
        return this.KEY_TYPE.COLOR;
      }
    }

    static isComponentType(keyType) {
      return [
        this.KEY_TYPE.RGB,
        this.KEY_TYPE.HSL,
        this.KEY_TYPE.COMPONENTS
      ].includes(keyType);
    }

    static isStringKey(color, keyMapper) {
      const keyType = keyMapper ? keyMapper(color) : color;
      return Utils.isString(keyType);
    }

    static compareColorFunction(colorOrder = "rgb") {
      const order = this.parseColorOrder(colorOrder);
      const type = order.type;

      return function(color1, color2) {
        return Sorter.compareColorComponents(color1[type], color2[type], order);
      };
    }

    static compareComponentsFunction(colorOrder = "rgb") {
      const order = this.parseColorOrder(colorOrder);

      return function(rgb1, rgb2) {
        return Sorter.compareColorComponents(rgb1, rgb2, order);
      };
    }

    static compareHexFunction(colorOrder = "rgb") {
      const order = this.parseColorOrder(colorOrder);
      const componentsCache = new Map();

      return function(hex1, hex2) {
        const color1 = Sorter.hexToComponents(hex1, order, componentsCache);
        const color2 = Sorter.hexToComponents(hex2, order, componentsCache);

        return Sorter.compareColorComponents(color1, color2, order);
      };
    }

    static compareColorComponents(color1, color2,
                                  order = this.parseColorOrder("rgb")) {
      for (let i of order.pos) {
        const result = order.funcs[i](color1[i], color2[i]);
        if (result !== 0) { return result; }
      }

      return 0;
    }

    static hexToComponents(hex, order, cache) {
      const cachedComponents = cache.get(hex);
      if (cachedComponents) { return cachedComponents; }

      const components = order.toComponents(hex);
      cache.set(hex, components);

      return components;
    }

    static rgbComponentPos(colorOrder) {
      return colorOrder.toLowerCase().split("").map((primary) => {
        return this.RGB_IDENTIFIERS.indexOf(primary);
      });
    }

    static hslComponentPos(hslOrder) {
      return hslOrder.toLowerCase().split("").map(component => {
        return this.HSL_IDENTIFIERS.indexOf(component);
      });
    }

    static ascendComp(component1, component2) {
      return component1 - component2;
    }

    static descendComp(component1, component2) {
      return component2 - component1;
    }

    static chooseRgbCompFunc(colorOrder) {
      const primaryColors = colorOrder.split("")
              .sort(this.caseInsensitiveComp).reverse();

      return primaryColors.map(primary => {
        if (Utils.isUpperCase(primary)) {
          return this.descendComp;
        }

        return this.ascendComp;
      });
    }

    static chooseHslCompFunc(hslOrder) {
      return this.HSL_RES.map(re => {
        const pos = hslOrder.search(re);
        if (Utils.isUpperCase(hslOrder[pos])) {
          return this.descendComp;
        }

        return this.ascendComp;
      });
    }

    static parseColorOrder(colorOrder) {
      if (/[rgb]{3}/i.test(colorOrder)) {
        return {
          pos: this.rgbComponentPos(colorOrder),
          funcs: this.chooseRgbCompFunc(colorOrder),
          toComponents: hexCode => Utils.hexCodeToDecimal(hexCode),
          type: "rgb"
        };
      } else {
        return {
          pos: this.hslComponentPos(colorOrder),
          funcs: this.chooseHslCompFunc(colorOrder),
          toComponents: hexCode => Utils.hexCodeToHsl(hexCode),
          type: "hsl"
        };
      }
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
      this.HSL_IDENTIFIERS = ["h", "s", "l"];
      this.HSL_RES = [/h/i, /s/i, /l/i];
      this.defaultCompFuncs = [
        Sorter.ascendComp,
        Sorter.ascendComp,
        Sorter.ascendComp
      ];
      this.KEY_TYPE = {
        COMPONENTS: "components",
        RGB: "rgb",
        HSL: "hsl",
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
