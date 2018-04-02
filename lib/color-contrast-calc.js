"use strict";

/** @private */
const ColorUtils = require("./color-utils").ColorUtils;
/** @private */
const Utils = ColorUtils;
/** @private */
const Color = require("./color").Color;
/** @private */
const Checker = require("./contrast-checker").ContrastChecker;

/**
 * Provides the top-level name space of this library.
 */
class ColorContrastCalc {
  /**
   * Returns an instance of Color.
   *
   * As colorValue, you can pass a predefined color name, or an RGB
   * value represented as an array of Integers or a hex code such as
   * [255, 255, 255] or "#ffff00". name is assigned to the returned
   * instance if it does not have a name already assigned.
   * @param {string|Array<number, number, number>} colorValue - name
   *     of a predefined color or RGB value
   * @param {string} name - Unless the instance has predefined name,
   *     the name passed to the method is set to self.name
   * @returns {Color} Instance of Color
   */
  static colorFrom(colorValue, name = null) {
    const errMessage = "A color should be given as an array or string.";

    if (! (Utils.isString(colorValue)) && ! (colorValue instanceof Array)) {
      throw new Error(errMessage);
    }

    if (colorValue instanceof Array) {
      return this.colorFromRgb(colorValue, name);
    }

    return this.colorFromStr(colorValue, name);
  }

  /**
   * @private
   */
  static colorFromRgb(colorValue, name = null) {
    const errMessage = "An RGB value should be given in form of [r, g, b].";

    if (! Utils.isValidRgb(colorValue)) {
      throw new Error(errMessage);
    }

    const hexCode = Utils.rgbToHexCode(colorValue);
    return Color.List.HEX_TO_COLOR.get(hexCode) || new Color(hexCode, name);
  }

  /**
   * @private
   */
  static colorFromStr(colorValue, name = null) {
    const errMessage = "A hex code is in form of '#xxxxxx' where 0 <= x <= f.";

    const namedColor = Color.getByName(colorValue);

    if (namedColor) {
      return namedColor;
    }

    if (! Utils.isValidHexCode(colorValue)) {
      throw new Error(errMessage);
    }

    const hexCode = Utils.normalizeHexCode(colorValue);
    return Color.List.HEX_TO_COLOR.get(hexCode) || new Color(hexCode, name);
  }

  /**
   * Returns an array of named colors that satisfy a given level of
   * contrast ratio
   * @param {Color} color - base color to which other colors are compared
   * @param {string} [level="AA"] - A, AA or AAA
   * @returns {Color[]}
   */
  static colorsWithSufficientContrast(color, level = "AA") {
    const ratio = Checker.levelToRatio(level);

    return this.NAMED_COLORS.filter(combinedColor => {
      return color.contrastRatioAgainst(combinedColor) >= ratio;
    });
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
    return Color.List.hslColors(s, l, h_interval);
  }

  /**
   * Returns a function to be used as a parameter of Array.prototype.sort()
   * @param {string} [colorOrder="rgb"] - A left side primary color has a higher
   *     sorting precedence
   * @param {string} [keyType="color"] - Type of keys used for sorting:
   *     "color", "hex" or "rgb"
   * @param {function} [keyMapper=null] - A function used to retrive key values
   *     from elements to be sorted
   * @returns {function} Function that compares given two colors
   */
  static compareFunction(colorOrder = "rgb", keyType = "color", keyMapper = null) {
    return this.Sorter.compareFunction(colorOrder, keyType, keyMapper);
  }

  /**
   * Sorts colors in an array and returns the result as a new array
   * @param {Color[]|String[]} colors - List of colors
   * @param {string} [colorOrder="rgb"] - A left side primary color has a higher
   *     sorting precedence, and an uppercase letter means descending order
   * @param {function} [keyMapper=null] - A function used to retrive key values
   *     from elements to be sorted
   * @param {string} [mode="auto"] - If set to "hex", key values are handled as
   *     hex code strings
   * @returns {Color[]} An array of sorted colors
   */
  static sort(colors, colorOrder = "rgb", keyMapper = null, mode = "auto") {
    return this.Sorter.sort(colors, colorOrder, keyMapper, mode);
  }

  /**
   * @private
   */
  static setup() {
    /**
     * Array of named colors defined at
     * https://www.w3.org/TR/SVG/types.html#ColorKeywords
     * @property {Color[]} NAMED_COLORS
     */
    this.NAMED_COLORS = Color.List.NAMED_COLORS;
    /** @private */
    this.NAME_TO_COLOR = Color.List.NAME_TO_COLOR;
    /** @private */
    this.HEX_TO_COLOR = Color.List.HEX_TO_COLOR;
    /**
     * Array of web safe colors
     * @property {Color[]} WEB_SAFE_COLORS
     */
    this.WEB_SAFE_COLORS = Color.List.WEB_SAFE_COLORS;
    Object.freeze(this);
  }
}

Color.calc = ColorContrastCalc;

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

ColorContrastCalc.setup();

module.exports.ColorUtils = ColorUtils;
module.exports.ContrastChecker = Checker;
module.exports.ColorContrastCalc = ColorContrastCalc;
module.exports.Color = Color;
