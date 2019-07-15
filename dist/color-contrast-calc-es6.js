(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ColorContrastCalc = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

module.exports = require("./lib/color-contrast-calc");

},{"./lib/color-contrast-calc":2}],2:[function(require,module,exports){
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

},{"./color":5,"./color-utils":4,"./contrast-checker":6}],3:[function(require,module,exports){
module.exports=[
  ["aliceblue", "#f0f8ff"],
  ["antiquewhite", "#faebd7"],
  ["aqua", "#00ffff"],
  ["aquamarine", "#7fffd4"],
  ["azure", "#f0ffff"],
  ["beige", "#f5f5dc"],
  ["bisque", "#ffe4c4"],
  ["black", "#000000"],
  ["blanchedalmond", "#ffebcd"],
  ["blue", "#0000ff"],
  ["blueviolet", "#8a2be2"],
  ["brown", "#a52a2a"],
  ["burlywood", "#deb887"],
  ["cadetblue", "#5f9ea0"],
  ["chartreuse", "#7fff00"],
  ["chocolate", "#d2691e"],
  ["coral", "#ff7f50"],
  ["cornflowerblue", "#6495ed"],
  ["cornsilk", "#fff8dc"],
  ["crimson", "#dc143c"],
  ["cyan", "#00ffff"],
  ["darkblue", "#00008b"],
  ["darkcyan", "#008b8b"],
  ["darkgoldenrod", "#b8860b"],
  ["darkgray", "#a9a9a9"],
  ["darkgreen", "#006400"],
  ["darkgrey", "#a9a9a9"],
  ["darkkhaki", "#bdb76b"],
  ["darkmagenta", "#8b008b"],
  ["darkolivegreen", "#556b2f"],
  ["darkorange", "#ff8c00"],
  ["darkorchid", "#9932cc"],
  ["darkred", "#8b0000"],
  ["darksalmon", "#e9967a"],
  ["darkseagreen", "#8fbc8f"],
  ["darkslateblue", "#483d8b"],
  ["darkslategray", "#2f4f4f"],
  ["darkslategrey", "#2f4f4f"],
  ["darkturquoise", "#00ced1"],
  ["darkviolet", "#9400d3"],
  ["deeppink", "#ff1493"],
  ["deepskyblue", "#00bfff"],
  ["dimgray", "#696969"],
  ["dimgrey", "#696969"],
  ["dodgerblue", "#1e90ff"],
  ["firebrick", "#b22222"],
  ["floralwhite", "#fffaf0"],
  ["forestgreen", "#228b22"],
  ["fuchsia", "#ff00ff"],
  ["gainsboro", "#dcdcdc"],
  ["ghostwhite", "#f8f8ff"],
  ["gold", "#ffd700"],
  ["goldenrod", "#daa520"],
  ["gray", "#808080"],
  ["green", "#008000"],
  ["greenyellow", "#adff2f"],
  ["grey", "#808080"],
  ["honeydew", "#f0fff0"],
  ["hotpink", "#ff69b4"],
  ["indianred", "#cd5c5c"],
  ["indigo", "#4b0082"],
  ["ivory", "#fffff0"],
  ["khaki", "#f0e68c"],
  ["lavender", "#e6e6fa"],
  ["lavenderblush", "#fff0f5"],
  ["lawngreen", "#7cfc00"],
  ["lemonchiffon", "#fffacd"],
  ["lightblue", "#add8e6"],
  ["lightcoral", "#f08080"],
  ["lightcyan", "#e0ffff"],
  ["lightgoldenrodyellow", "#fafad2"],
  ["lightgray", "#d3d3d3"],
  ["lightgreen", "#90ee90"],
  ["lightgrey", "#d3d3d3"],
  ["lightpink", "#ffb6c1"],
  ["lightsalmon", "#ffa07a"],
  ["lightseagreen", "#20b2aa"],
  ["lightskyblue", "#87cefa"],
  ["lightslategray", "#778899"],
  ["lightslategrey", "#778899"],
  ["lightsteelblue", "#b0c4de"],
  ["lightyellow", "#ffffe0"],
  ["lime", "#00ff00"],
  ["limegreen", "#32cd32"],
  ["linen", "#faf0e6"],
  ["magenta", "#ff00ff"],
  ["maroon", "#800000"],
  ["mediumaquamarine", "#66cdaa"],
  ["mediumblue", "#0000cd"],
  ["mediumorchid", "#ba55d3"],
  ["mediumpurple", "#9370db"],
  ["mediumseagreen", "#3cb371"],
  ["mediumslateblue", "#7b68ee"],
  ["mediumspringgreen", "#00fa9a"],
  ["mediumturquoise", "#48d1cc"],
  ["mediumvioletred", "#c71585"],
  ["midnightblue", "#191970"],
  ["mintcream", "#f5fffa"],
  ["mistyrose", "#ffe4e1"],
  ["moccasin", "#ffe4b5"],
  ["navajowhite", "#ffdead"],
  ["navy", "#000080"],
  ["oldlace", "#fdf5e6"],
  ["olive", "#808000"],
  ["olivedrab", "#6b8e23"],
  ["orange", "#ffa500"],
  ["orangered", "#ff4500"],
  ["orchid", "#da70d6"],
  ["palegoldenrod", "#eee8aa"],
  ["palegreen", "#98fb98"],
  ["paleturquoise", "#afeeee"],
  ["palevioletred", "#db7093"],
  ["papayawhip", "#ffefd5"],
  ["peachpuff", "#ffdab9"],
  ["peru", "#cd853f"],
  ["pink", "#ffc0cb"],
  ["plum", "#dda0dd"],
  ["powderblue", "#b0e0e6"],
  ["purple", "#800080"],
  ["red", "#ff0000"],
  ["rosybrown", "#bc8f8f"],
  ["royalblue", "#4169e1"],
  ["saddlebrown", "#8b4513"],
  ["salmon", "#fa8072"],
  ["sandybrown", "#f4a460"],
  ["seagreen", "#2e8b57"],
  ["seashell", "#fff5ee"],
  ["sienna", "#a0522d"],
  ["silver", "#c0c0c0"],
  ["skyblue", "#87ceeb"],
  ["slateblue", "#6a5acd"],
  ["slategray", "#708090"],
  ["slategrey", "#708090"],
  ["snow", "#fffafa"],
  ["springgreen", "#00ff7f"],
  ["steelblue", "#4682b4"],
  ["tan", "#d2b48c"],
  ["teal", "#008080"],
  ["thistle", "#d8bfd8"],
  ["tomato", "#ff6347"],
  ["turquoise", "#40e0d0"],
  ["violet", "#ee82ee"],
  ["wheat", "#f5deb3"],
  ["white", "#ffffff"],
  ["whitesmoke", "#f5f5f5"],
  ["yellow", "#ffff00"],
  ["yellowgreen", "#9acd32"]
]

},{}],4:[function(require,module,exports){
"use strict";

/**
 * Collection of functions that provide basic operations on colors
 * represented as RGB/HSL value (given in the form of array of numbers)
 * or hex code (given in the form of string)
 */
class ColorUtils {
  /**
   * Converts a hex color code string to a decimal representation
   * @param {string} hexCode - Hex color code such as "#ffff00"
   * @returns {Array<number, number, number>} RGB value represented as
   *     an array of numbers
   */
  static hexCodeToRgb(hexCode) {
    const h = this.normalizeHexCode(hexCode, false);
    return [0, 2, 4].map(s => h.substr(s, 2))
      .map(primaryColor => Number.parseInt(primaryColor, 16));
  }

  /**
   * Converts a hex color code to a 6-digit hexadecimal string
   * @param {string} hexString - String that represent a hex code
   * @param {boolean} [prefix=true] - Append '#' to the head of return value
   *     if a truthy value is given
   * @returns {string} 6-digit hexadecimal string with/without leading '#'
   */
  static normalizeHexCode(hexString, prefix = true) {
    const hl = hexString.toLowerCase();
    const h = hl.startsWith("#") ? hl.replace("#", "") : hl;
    let hexPart = h;
    if (h.length === 3) {
      hexPart = [0, 1, 2].map(s => h.substr(s, 1).repeat(2)).join("");
    }

    return prefix ? `#${hexPart}` : hexPart;
  }

  /**
   * Converts a decimal representation of color to a hex code string
   * @param {Array<number, number, number>} rgb - RGB value represented as
   *     an array of numbers
   * @returns {string} RGB value in hex code
   */
  static rgbToHexCode(rgb) {
    return "#" + rgb.map(d => {
      const h = d.toString(16);
      return h.length === 1 ? "0" + h : h;
    }).join("");
  }

  /**
   * Converts HSL value to RGB value
   * @param {Array<number, number, number>} hsl - An array of numbers that
   *     represents HSL value
   * @returns {Array<number, number, number>} An array of numbers that
   *     represents RGB value
   */
  static hslToRgb(hsl) {
    /*
       https://www.w3.org/TR/css3-color/#hsl-color
     */
    const h = hsl[0] / 360;
    const s = hsl[1] / 100;
    const l = hsl[2] / 100;
    const m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
    const m1 = l * 2 - m2;
    const r = this.hueToRgb(m1, m2, h + 1 / 3) * 255;
    const g = this.hueToRgb(m1, m2, h) * 255;
    const b = this.hueToRgb(m1, m2, h - 1 / 3) * 255;
    return [r, g, b].map(c => Math.round(c));
  }

  /**
   * @private
   */
  static hueToRgb(m1, m2, hInit) {
    let h = hInit;
    if (h < 0) { h = h + 1; }
    if (h > 1) { h = h - 1; }
    if (h * 6 < 1) { return m1 + (m2 - m1) * h * 6; }
    if (h * 2 < 1) { return m2; }
    if (h * 3 < 2) { return m1 + (m2 - m1) * (2 / 3 - h) * 6; }
    return m1;
  }

  /**
   * Converts HSL value to hex code
   * @param {Array<number, number, number>} hsl - An array of numbers that
   *     represents HSL value
   * @returns {string} Hex code
   */
  static hslToHexCode(hsl) {
    return this.rgbToHexCode(this.hslToRgb(hsl));
  }

  /**
   * Converts RGB value to HSL value
   * @param {Array<number, number, number>} rgb - An array of numbers that
   *     represents RGB value
   * @returns {Array<number, number, number>} An array of numbers that
   *     represents HSL value
   */
  static rgbToHsl(rgb) {
    const l = this.rgbToLightness(rgb) * 100;
    const s = this.rgbToSaturation(rgb) * 100;
    const h = this.rgbToHue(rgb);

    return [h, s, l];
  }

  /**
   * @private
   */
  static rgbToLightness(rgb) {
    return (Math.max(...rgb) + Math.min(...rgb)) / 510;
  }

  /**
   * @private
   */
  static rgbToHue(rgb) {
    /**
     References:
     Agoston, Max K. (2005).
     "Computer Graphics and Geometric Modeling: Implementation and Algorithms".
     London: Springer

     https://accessibility.kde.org/hsl-adjusted.php#hue
     */
    const max = Math.max(...rgb);
    const min = Math.min(...rgb);

    if (max === min) { return 0; } /* you can return whatever you like */

    const d = max - min;
    const mi = rgb.reduce((m, v, i) => rgb[m] > v ? m : i, 0); /* maxIndex */
    const h = mi * 120 + (rgb[(mi + 1) % 3] - rgb[(mi + 2) % 3]) * 60 / d;

    return h < 0 ? h + 360 : h;
  }

  /**
   * @private
   */
  static rgbToSaturation(rgb) {
    const l = this.rgbToLightness(rgb);
    const max = Math.max(...rgb);
    const min = Math.min(...rgb);
    const d = max - min;

    if (max === min) { return 0; }

    if (l <= 0.5) {
      return d / (max + min);
    } else {
      return d / (510 - max - min);
    }
  }

  /**
   * Converts a hex color code string to an HSL representation
   * @param {string} hexCode - Hex color code such as "#ffff00"
   * @returns {Array<number, number, number>} HSL value represented as
   *     an array of numbers
   */
  static hexCodeToHsl(hexCode) {
    return this.rgbToHsl(this.hexCodeToRgb(hexCode));
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
   * @param {Array<number, number, number>} rgb - RGB value represented as
   *     an array of numbers
   * @returns {boolean} true if the argument is a valid RGB color
   */
  static isValidRgb(rgb) {
    return rgb.length === 3 &&
      rgb.every(c => c >= 0 && c <= 255 &&
                Number.isInteger(c));
  }

  /**
   * Checks if a given array is a valid representation of HSL color.
   * @param {Array<number, number, number>} hsl - HSL value represented as
   *     an array of numbers
   * @returns {boolean} true if the argument is a valid HSL color
   */
  static isValidHsl(hsl) {
    const upperLimits = [360, 100, 100];
    return hsl.length === 3 &&
      hsl.every((c, i) => typeof c === "number" &&
                c >= 0 && c <= upperLimits[i]);
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
   * @param {string} hexCode1 - Color given as a hex code,
   *     such as "#ffff00", "#FFFF00" or "#ff0"
   * @param {string} hexCode2 - Color given as a hex code,
   *     such as "#ffff00", "#FFFF00" or "#ff0"
   * @returns {boolean} True if given two colors are same
   */
  static isSameHexColor(hexCode1, hexCode2) {
    const h1 = this.normalizeHexCode(hexCode1);
    const h2 = this.normalizeHexCode(hexCode2);
    return h1 === h2;
  }

  /**
   * Checks if given two RGB values represent a same color.
   * @param {Array<number, number, number>} rgb1 - Color given as an array
   *     of numbers, such as [255, 255, 0]
   * @param {Array<number, number, number>} rgb2 - Color given as an array
   *     of numbers, such as [255, 255, 0]
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
   * @returns {boolean} returns true if letters in the argument string are
   *     all uppercase
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


  /**
   * @private
   */
  static clampToRange(value, lowerBound, upperBound) {
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
  static rgbMap(values, func = null) {
    if (func) {
      return values.map(val => {
        return ColorUtils.clampToRange(Math.round(func(val)), 0, 255);
      });
    } else {
      return values.map(val => {
        return ColorUtils.clampToRange(Math.round(val), 0, 255);
      });
    }
  }
}

/**
 * @deprecated Use .rgbToHexCode instead.
 */
ColorUtils.decimalToHexCode = ColorUtils.rgbToHexCode;

/**
 * @deprecated use .hexCodeToRgb instead.
 */
ColorUtils.hexCodeToDecimal = ColorUtils.hexCodeToRgb;

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

  ColorUtils.Matrix = Matrix;

  const rgbMap = ColorUtils.rgbMap;

  class ContrastCalc {
    /*
      https://www.w3.org/TR/filter-effects/#funcdef-contrast
      https://www.w3.org/TR/SVG/filters.html#TransferFunctionElementAttributes
    */
    static calcRgb(rgb, ratio = 100) {
      return rgbMap(rgb, c => (c * ratio + 255 * (50 - ratio / 2)) / 100);
    }
  }

  ColorUtils.ContrastCalc = ContrastCalc;

  class BrightnessCalc {
    /*
      https://www.w3.org/TR/filter-effects/#funcdef-brightness
      https://www.w3.org/TR/SVG/filters.html#TransferFunctionElementAttributes
    */
    static calcRgb(rgb, ratio = 100) {
      return rgbMap(rgb, c => c * ratio / 100);
    }
  }

  ColorUtils.BrightnessCalc = BrightnessCalc;

  class InvertCalc {
    /*
      https://www.w3.org/TR/filter-effects/#funcdef-invert
      https://www.w3.org/TR/filter-effects-1/#invertEquivalent
      https://www.w3.org/TR/SVG/filters.html#TransferFunctionElementAttributes
    */
    static calcRgb(rgb, ratio) {
      return rgb.map(c => {
        return Math.round((100 * c - 2 * c * ratio + 255 * ratio) / 100);
      });
    }
  }

  ColorUtils.InvertCalc = InvertCalc;

  class HueRotateCalc {
    /*
      https://www.w3.org/TR/filter-effects/#funcdef-hue-rotate
      https://www.w3.org/TR/SVG/filters.html#TransferFunctionElementAttributes
    */
    static calcRgb(rgb, deg) {
      return rgbMap(this.calcRotation(deg).multiply(rgb));
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
                                      [-0.213, 0.285, -0.072],
                                      [-0.213, -0.715, 0.928]]);

  HueRotateCalc.sinPart = new Matrix([[-0.213, -0.715, 0.928],
                                      [0.143, 0.140, -0.283],
                                      [-0.787, 0.715, 0.072]]);

  ColorUtils.HueRotateCalc = HueRotateCalc;

  class SaturateCalc {
    /*
      https://www.w3.org/TR/filter-effects/#funcdef-saturate
      https://www.w3.org/TR/SVG/filters.html#feColorMatrixElement
    */
    static calcRgb(rgb, s) {
      return rgbMap(this.calcSaturation(s).multiply(rgb));
    }

    static calcSaturation(s) {
      return this.constPart.add(this.saturatePart.multiply(s / 100));
    }
  }

  SaturateCalc.constPart = HueRotateCalc.constPart;
  SaturateCalc.saturatePart = HueRotateCalc.cosPart;

  ColorUtils.SaturateCalc = SaturateCalc;

  class GrayscaleCalc {
    /*
      https://www.w3.org/TR/filter-effects/#funcdef-grayscale
      https://www.w3.org/TR/filter-effects/#grayscaleEquivalent
      https://www.w3.org/TR/SVG/filters.html#feColorMatrixElement
    */
    static calcRgb(rgb, s) {
      return rgbMap(this.calcGrayscale(s).multiply(rgb));
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

  ColorUtils.GrayscaleCalc = GrayscaleCalc;

  /**
   * The RGB value of some colors.
   */
  ColorUtils.RGB = {
    BLACK: [0, 0, 0],
    WHITE: [255, 255, 255]
  };

  Object.freeze(ColorUtils.RGB);
})();

ColorUtils.setup();

module.exports.ColorUtils = ColorUtils;

},{}],5:[function(require,module,exports){
"use strict";

/** @private */
const Utils = require("./color-utils").ColorUtils;
/** @private */
const Checker = require("./contrast-checker").ContrastChecker;
/** @private */
const LightnessFinder = require("./threshold-finder").LightnessFinder;
/** @private */
const BrightnessFinder = require("./threshold-finder").BrightnessFinder;

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
   * Return a new instance of Color with adjusted contrast.
   * @param {number} ratio - Value in percent
   * @param {string} [name=null] - Name of color
   * @returns {Color}
   */
  withContrast(ratio, name = null) {
    return this.generateNewColor(Utils.ContrastCalc, ratio, name);
  }

  /**
   * Return a new instance of Color with adjusted brightness.
   * @param {number} ratio - Value in percent
   * @param {string} [name=null] - Name of color
   * @returns {Color}
   */
  withBrightness(ratio, name = null) {
    return this.generateNewColor(Utils.BrightnessCalc, ratio, name);
  }

  /**
   * Return an inverted color as an instance of Color.
   * @param {number} [ratio=100] - Value in percent
   * @param {string} [name=null] - Name of color
   * @returns {Color}
   */
  withInvert(ratio = 100, name = null) {
    return this.generateNewColor(Utils.InvertCalc, ratio, name);
  }

  /**
   * Return a hue rotation applied color as an instance of Color.
   * @param {number} degree - Value in degree
   * @param {string} [name=null] - Name of color
   * @returns {Color}
   */
  withHueRotate(degree, name = null) {
    return this.generateNewColor(Utils.HueRotateCalc, degree, name);
  }

  /**
   * Return a saturated color as an instance of Color.
   * @param {number} ratio - Value in percent
   * @param {string} [name=null] - Name of color
   * @returns {Color}
   */
  withSaturate(ratio, name = null) {
    return this.generateNewColor(Utils.SaturateCalc, ratio, name);
  }

  /**
   * Return a grayscale of the original color.
   * @param {number} [ratio=100] - Conversion ratio in percentage
   * @param {string} [name=null] - Name of color
   * @returns {Color}
   */
  withGrayscale(ratio = 100, name = null) {
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
    return new Color(BrightnessFinder.find(this.rgb, otherColor.rgb, level));
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

/**
 * @deprecated use withContrast() instead.
 */
Color.prototype.newContrastColor = Color.prototype.withContrast;

/**
 * @deprecated use withBrightness() instead.
 */
Color.prototype.newBrightnessColor = Color.prototype.withBrightness;

/**
 * @deprecated use withInvert() instead.
 */
Color.prototype.newInvertColor = Color.prototype.withInvert;

/**
 * @deprecated use withHueRotate() instead.
 */
Color.prototype.newHueRotateColor = Color.prototype.withHueRotate;

/**
 * @deprecated use withSaturate() instead.
 */
Color.prototype.newSaturateColor = Color.prototype.withSaturate;

/**
 * @deprecated use withGrayScale() instead.
 */
Color.prototype.newGrayscaleColor = Color.prototype.withGrayscale;

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

},{"./color-keywords.json":3,"./color-utils":4,"./contrast-checker":6,"./threshold-finder":7}],6:[function(require,module,exports){
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

},{"./color-utils":4}],7:[function(require,module,exports){
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

  static define(fixedRgb, otherRgb, level) {
    const targetContrast = Checker.levelToRatio(level);

    if (this.shouldScanDarkerSide(fixedRgb, otherRgb)) {
      return new ToDarkerSide(targetContrast, fixedRgb);
    } else {
      return new ToBrighterSide(targetContrast, fixedRgb);
    }
  }

  constructor(targetContrast, fixedRgb) {
    this.targetContrast = targetContrast;
    this.fixedLuminance = Checker.relativeLuminance(fixedRgb);
  }

  hasSufficientContrast(rgb) {
    return this.contrastRatio(rgb) >= this.targetContrast;
  }

  contrastRatio(rgb) {
    const luminance = Checker.relativeLuminance(rgb);
    return Checker.luminanceToContrastRatio(this.fixedLuminance,
                                            luminance);
  }
}

/** @private */
class ToDarkerSide extends SearchCriteria {
  round(ratio) {
    return Math.floor(ratio * 10 ) / 10;
  }

  incrementCondition(contrastRatio) {
    return contrastRatio > this.targetContrast;
  }
}

/** @private */
class ToBrighterSide extends SearchCriteria {
  round(ratio) {
    return Math.ceil(ratio * 10) / 10;
  }

  incrementCondition(contrastRatio) {
    return this.targetContrast > contrastRatio;
  }
}

/** @private */
class ThresholdFinder {
  /** @private */
  static * binarySearchWidth(initWidth, min) {
    let i = 1;
    let d = initWidth / Math.pow(2, i);

    while (d > min) {
      yield d;
      i++;
      d = initWidth / Math.pow(2, i);
    }
  }

  /**
   * @private
   */
  static findRatio(otherColor, criteria, initRatio, initWidth) {
    let r = initRatio;
    let passingRatio = null;

    for (let d of this.binarySearchWidth(initWidth, 0.01)) {
      const newRgb = this.rgbWithRatio(otherColor, r);
      const contrast = criteria.contrastRatio(newRgb);

      if (criteria.hasSufficientContrast(newRgb)) { passingRatio = r; }
      if (contrast === criteria.targetContrast) { break; }
      r += criteria.incrementCondition(contrast) ? d : -d;
    }

    return [r, passingRatio];
  }

  /**
   * @private
   */
  static rgbWithBetterRatio(color, criteria, lastRatio, passingRatio) {
    const closestRgb = this.rgbWithRatio(color, lastRatio);

    if (passingRatio && ! criteria.hasSufficientContrast(closestRgb)) {
      return this.rgbWithRatio(color, passingRatio);
    }

    return closestRgb;
  }
}

/** @private */
class LightnessFinder extends ThresholdFinder {
  /**
   * Tries to find a color whose contrast against the base color is close to
   * a given level.
   *
   * The returned color is gained by modifying the lightness of otherRgb.
   * Even when a color that satisfies the level is not found, it returns
   * a new color anyway.
   * @param {Array<number, number, number>} fixedRgb - RGB value which remains
   *     unchanged
   * @param {Array<number, number, number>} otherRgb - RGB value before the
   *     modification of lightness
   * @param {string} [level="AA"] - A, AA or AAA
   * @returns {Array<number, number, number>} RGB value of a new color whose
   *     contrast ratio against fixedRgb is close to a specified level
   */
  static find(fixedRgb, otherRgb, level = "AA") {
    const criteria = SearchCriteria.define(fixedRgb, otherRgb, level);
    const otherHsl = Utils.rgbToHsl(otherRgb);
    const [max, min] = this.determineMinmax(fixedRgb, otherRgb, otherHsl[2]);

    const boundaryRgb = this.boundaryColor(fixedRgb, max, min, criteria);

    if (boundaryRgb) { return boundaryRgb; }

    const [r, passingRatio] = this.findRatio(otherHsl, criteria,
                                             (max + min) / 2, max - min);

    return this.rgbWithBetterRatio(otherHsl, criteria, r, passingRatio);
  }

  /**
   * @private
   */
  static rgbWithRatio(hsl, ratio) {
    if (ratio !== undefined && hsl[2] !== ratio) {
      hsl = hsl.slice(0);
      hsl[2] = ratio;
    }

    return Utils.hslToRgb(hsl);
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
    const black = Checker.LUMINANCE.BLACK;
    const white = Checker.LUMINANCE.WHITE;

    if (min === 0 && ! this.hasSufficientContrast(black, rgb, criteria)) {
      return Utils.RGB.BLACK;
    }

    if (max === 100 && ! this.hasSufficientContrast(white, rgb, criteria)) {
      return Utils.RGB.WHITE;
    }

    return null;
  }

  /**
   * @private
   */
  static hasSufficientContrast(refLuminance, rgb, criteria) {
    const luminance = Checker.relativeLuminance(rgb);
    const ratio = Checker.luminanceToContrastRatio(refLuminance, luminance);
    return ratio >= criteria.targetContrast;
  }
}

/** @private */
class BrightnessFinder extends ThresholdFinder {
  /**
   * Tries to find a color whose contrast against the base color is close
   *  to a given level.
   *
   * The returned color is gained by modifying the brightness of otherRgb.
   * Even when a color that satisfies the level is not found, it returns
   * a new color anyway.
   * @param {Array<number, number, number>} fixedRgb - RGB value which remains
   *     unchanged
   * @param {Array<number, number, number>} otherRgb - RGB value before the
   *     modification of brightness
   * @param {string} [level="AA"] - A, AA or AAA
   * @returns {Array<number, number, number>} RGB value of a new color whose
   *     contrast ratio against fixedRgb is close to a specified level
   */
  static find(fixedRgb, otherRgb, level = "AA") {
    const criteria = SearchCriteria.define(fixedRgb, otherRgb, level);
    const w = this.calcUpperRatioLimit(otherRgb) / 2;

    const upperRgb = this.rgbWithRatio(otherRgb, w * 2);

    if (this.exceedUpperLimit(criteria, otherRgb, upperRgb)) {
      return upperRgb;
    }

    const ratios = this.findRatio(otherRgb, criteria, w, w).map(criteria.round);

    return this.rgbWithBetterRatio(otherRgb, criteria, ...ratios);
  }

  /**
   * @private
   */
  static rgbWithRatio(rgb, ratio) {
    return Utils.BrightnessCalc.calcRgb(rgb, ratio);
  }

  /**
   * @private
   */
  static exceedUpperLimit(criteria, otherRgb, upperRgb) {
    const otherLuminance = Checker.relativeLuminance(otherRgb);
    return otherLuminance > criteria.fixedLuminance &&
      ! criteria.hasSufficientContrast(upperRgb);
  }

  /**
   * @private
   */
  static calcUpperRatioLimit(rgb) {
    if (Utils.isSameRgbColor(Utils.RGB.BLACK, rgb)) {
      return 100;
    }

    const darkest = rgb
          .filter(c => c !== 0)
          .reduce((a, b) => Math.min(a, b));
    return Math.ceil((255 / darkest) * 100);
  }
}

module.exports.LightnessFinder = LightnessFinder;
module.exports.BrightnessFinder = BrightnessFinder;

},{"./color-utils":4,"./contrast-checker":6}]},{},[1])(1)
});
