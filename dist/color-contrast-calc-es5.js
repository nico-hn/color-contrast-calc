(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ColorContrastCalc = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = require("./lib/color-contrast-calc");

},{"./lib/color-contrast-calc":2}],2:[function(require,module,exports){
"use strict";

/** @private */

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ColorUtils = require("./color-utils").ColorUtils;
/** @private */
var Utils = ColorUtils;
/** @private */
var Color = require("./color").Color;
/** @private */
var Checker = require("./contrast-checker").ContrastChecker;

/**
 * Provides the top-level name space of this library.
 */

var ColorContrastCalc = function () {
  function ColorContrastCalc() {
    (0, _classCallCheck3.default)(this, ColorContrastCalc);
  }

  (0, _createClass3.default)(ColorContrastCalc, null, [{
    key: "colorFrom",

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
    value: function colorFrom(colorValue) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var errMessage = "A color should be given as an array or string.";

      if (!Utils.isString(colorValue) && !(colorValue instanceof Array)) {
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

  }, {
    key: "colorFromRgb",
    value: function colorFromRgb(colorValue) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var errMessage = "An RGB value should be given in form of [r, g, b].";

      if (!Utils.isValidRgb(colorValue)) {
        throw new Error(errMessage);
      }

      var hexCode = Utils.rgbToHexCode(colorValue);
      return Color.List.HEX_TO_COLOR.get(hexCode) || new Color(hexCode, name);
    }

    /**
     * @private
     */

  }, {
    key: "colorFromStr",
    value: function colorFromStr(colorValue) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var errMessage = "A hex code is in form of '#xxxxxx' where 0 <= x <= f.";

      var namedColor = Color.getByName(colorValue);

      if (namedColor) {
        return namedColor;
      }

      if (!Utils.isValidHexCode(colorValue)) {
        throw new Error(errMessage);
      }

      var hexCode = Utils.normalizeHexCode(colorValue);
      return Color.List.HEX_TO_COLOR.get(hexCode) || new Color(hexCode, name);
    }

    /**
     * Returns an array of named colors that satisfy a given level of
     * contrast ratio
     * @param {Color} color - base color to which other colors are compared
     * @param {string} [level="AA"] - A, AA or AAA
     * @returns {Color[]}
     */

  }, {
    key: "colorsWithSufficientContrast",
    value: function colorsWithSufficientContrast(color) {
      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "AA";

      var ratio = Checker.levelToRatio(level);

      return this.NAMED_COLORS.filter(function (combinedColor) {
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

  }, {
    key: "hslColors",
    value: function hslColors() {
      var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
      var l = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
      var h_interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

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

  }, {
    key: "compareFunction",
    value: function compareFunction() {
      var colorOrder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "rgb";
      var keyType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "color";
      var keyMapper = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

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

  }, {
    key: "sort",
    value: function sort(colors) {
      var colorOrder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "rgb";
      var keyMapper = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var mode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "auto";

      return this.Sorter.sort(colors, colorOrder, keyMapper, mode);
    }

    /**
     * @private
     */

  }, {
    key: "setup",
    value: function setup() {
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
      (0, _freeze2.default)(this);
    }
  }]);
  return ColorContrastCalc;
}();

Color.calc = ColorContrastCalc;

(function () {
  var Sorter = function () {
    function Sorter() {
      (0, _classCallCheck3.default)(this, Sorter);
    }

    (0, _createClass3.default)(Sorter, null, [{
      key: "sort",
      value: function sort(colors) {
        var colorOrder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "rgb";
        var keyMapper = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var mode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "auto";

        var keyType = this.guessKeyType(mode, colors[0], keyMapper);
        var compare = this.compareFunction(colorOrder, keyType, keyMapper);

        return colors.slice().sort(compare);
      }
    }, {
      key: "compareFunction",
      value: function compareFunction() {
        var colorOrder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "rgb";
        var keyType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.KEY_TYPE.COLOR;
        var keyMapper = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        var compare = null;

        if (keyType === this.KEY_TYPE.HEX) {
          compare = this.compareHexFunction(colorOrder);
        } else if (this.isComponentType(keyType)) {
          compare = this.compareComponentsFunction(colorOrder);
        } else {
          compare = this.compareColorFunction(colorOrder);
        }

        return this.composeFunction(compare, keyMapper);
      }
    }, {
      key: "composeFunction",
      value: function composeFunction(compareFunc) {
        var keyMapper = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (!keyMapper) {
          return compareFunc;
        }

        return function (color1, color2) {
          return compareFunc(keyMapper(color1), keyMapper(color2));
        };
      }
    }, {
      key: "guessKeyType",
      value: function guessKeyType(mode, color, keyMapper) {
        if (mode === this.KEY_TYPE.HEX || mode === "auto" && this.isStringKey(color, keyMapper)) {
          return this.KEY_TYPE.HEX;
        } else if (this.isComponentType(mode) || Array.isArray(color)) {
          return this.KEY_TYPE.COMPONENTS;
        } else {
          return this.KEY_TYPE.COLOR;
        }
      }
    }, {
      key: "isComponentType",
      value: function isComponentType(keyType) {
        return [this.KEY_TYPE.RGB, this.KEY_TYPE.HSL, this.KEY_TYPE.COMPONENTS].includes(keyType);
      }
    }, {
      key: "isStringKey",
      value: function isStringKey(color, keyMapper) {
        var keyType = keyMapper ? keyMapper(color) : color;
        return Utils.isString(keyType);
      }
    }, {
      key: "compareColorFunction",
      value: function compareColorFunction() {
        var colorOrder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "rgb";

        var order = this.parseColorOrder(colorOrder);
        var type = order.type;

        return function (color1, color2) {
          return Sorter.compareColorComponents(color1[type], color2[type], order);
        };
      }
    }, {
      key: "compareComponentsFunction",
      value: function compareComponentsFunction() {
        var colorOrder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "rgb";

        var order = this.parseColorOrder(colorOrder);

        return function (rgb1, rgb2) {
          return Sorter.compareColorComponents(rgb1, rgb2, order);
        };
      }
    }, {
      key: "compareHexFunction",
      value: function compareHexFunction() {
        var colorOrder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "rgb";

        var order = this.parseColorOrder(colorOrder);
        var componentsCache = new _map2.default();

        return function (hex1, hex2) {
          var color1 = Sorter.hexToComponents(hex1, order, componentsCache);
          var color2 = Sorter.hexToComponents(hex2, order, componentsCache);

          return Sorter.compareColorComponents(color1, color2, order);
        };
      }
    }, {
      key: "compareColorComponents",
      value: function compareColorComponents(color1, color2) {
        var order = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.parseColorOrder("rgb");
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(order.pos), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var i = _step.value;

            var result = order.funcs[i](color1[i], color2[i]);
            if (result !== 0) {
              return result;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return 0;
      }
    }, {
      key: "hexToComponents",
      value: function hexToComponents(hex, order, cache) {
        var cachedComponents = cache.get(hex);
        if (cachedComponents) {
          return cachedComponents;
        }

        var components = order.toComponents(hex);
        cache.set(hex, components);

        return components;
      }
    }, {
      key: "rgbComponentPos",
      value: function rgbComponentPos(colorOrder) {
        var _this = this;

        return colorOrder.toLowerCase().split("").map(function (primary) {
          return _this.RGB_IDENTIFIERS.indexOf(primary);
        });
      }
    }, {
      key: "hslComponentPos",
      value: function hslComponentPos(hslOrder) {
        var _this2 = this;

        return hslOrder.toLowerCase().split("").map(function (component) {
          return _this2.HSL_IDENTIFIERS.indexOf(component);
        });
      }
    }, {
      key: "ascendComp",
      value: function ascendComp(component1, component2) {
        return component1 - component2;
      }
    }, {
      key: "descendComp",
      value: function descendComp(component1, component2) {
        return component2 - component1;
      }
    }, {
      key: "chooseRgbCompFunc",
      value: function chooseRgbCompFunc(colorOrder) {
        var _this3 = this;

        var primaryColors = colorOrder.split("").sort(this.caseInsensitiveComp).reverse();

        return primaryColors.map(function (primary) {
          if (Utils.isUpperCase(primary)) {
            return _this3.descendComp;
          }

          return _this3.ascendComp;
        });
      }
    }, {
      key: "chooseHslCompFunc",
      value: function chooseHslCompFunc(hslOrder) {
        var _this4 = this;

        return this.HSL_RES.map(function (re) {
          var pos = hslOrder.search(re);
          if (Utils.isUpperCase(hslOrder[pos])) {
            return _this4.descendComp;
          }

          return _this4.ascendComp;
        });
      }
    }, {
      key: "parseColorOrder",
      value: function parseColorOrder(colorOrder) {
        if (/[rgb]{3}/i.test(colorOrder)) {
          return {
            pos: this.rgbComponentPos(colorOrder),
            funcs: this.chooseRgbCompFunc(colorOrder),
            toComponents: function toComponents(hexCode) {
              return Utils.hexCodeToDecimal(hexCode);
            },
            type: "rgb"
          };
        } else {
          return {
            pos: this.hslComponentPos(colorOrder),
            funcs: this.chooseHslCompFunc(colorOrder),
            toComponents: function toComponents(hexCode) {
              return Utils.hexCodeToHsl(hexCode);
            },
            type: "hsl"
          };
        }
      }
    }, {
      key: "caseInsensitiveComp",
      value: function caseInsensitiveComp(str1, str2) {
        var lStr1 = str1.toLowerCase();
        var lStr2 = str2.toLowerCase();

        if (lStr1 < lStr2) {
          return -1;
        }
        if (lStr1 > lStr2) {
          return 1;
        }
        return 0;
      }
    }, {
      key: "setup",
      value: function setup() {
        this.RGB_IDENTIFIERS = ["r", "g", "b"];
        this.HSL_IDENTIFIERS = ["h", "s", "l"];
        this.HSL_RES = [/h/i, /s/i, /l/i];
        this.defaultCompFuncs = [Sorter.ascendComp, Sorter.ascendComp, Sorter.ascendComp];
        this.KEY_TYPE = {
          COMPONENTS: "components",
          RGB: "rgb",
          HSL: "hsl",
          HEX: "hex",
          COLOR: "color"
        };
      }
    }]);
    return Sorter;
  }();

  Sorter.setup();

  ColorContrastCalc.Sorter = Sorter;
})();

ColorContrastCalc.setup();

module.exports.ColorUtils = ColorUtils;
module.exports.ContrastChecker = Checker;
module.exports.ColorContrastCalc = ColorContrastCalc;
module.exports.Color = Color;

},{"./color":5,"./color-utils":4,"./contrast-checker":6,"babel-runtime/core-js/get-iterator":9,"babel-runtime/core-js/map":11,"babel-runtime/core-js/object/freeze":16,"babel-runtime/helpers/classCallCheck":21,"babel-runtime/helpers/createClass":22}],3:[function(require,module,exports){
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

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

var _isInteger = require("babel-runtime/core-js/number/is-integer");

var _isInteger2 = _interopRequireDefault(_isInteger);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _parseInt = require("babel-runtime/core-js/number/parse-int");

var _parseInt2 = _interopRequireDefault(_parseInt);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ColorUtils = function () {
  function ColorUtils() {
    (0, _classCallCheck3.default)(this, ColorUtils);
  }

  (0, _createClass3.default)(ColorUtils, null, [{
    key: "hexCodeToRgb",

    /**
     * Converts a hex color code string to a decimal representation
     * @param {string} hexCode - Hex color code such as "#ffff00"
     * @returns {Array<number, number, number>} RGB value represented as
     *     an array of numbers
     */
    value: function hexCodeToRgb(hexCode) {
      var h = this.normalizeHexCode(hexCode, false);
      return [0, 2, 4].map(function (s) {
        return h.substr(s, 2);
      }).map(function (primaryColor) {
        return (0, _parseInt2.default)(primaryColor, 16);
      });
    }

    /**
     * Converts a hex color code to a 6-digit hexadecimal string
     * @param {string} hexString - String that represent a hex code
     * @param {boolean} [prefix=true] - Append '#' to the head of return value
     *     if a truthy value is given
     * @returns {string} 6-digit hexadecimal string with/without leading '#'
     */

  }, {
    key: "normalizeHexCode",
    value: function normalizeHexCode(hexString) {
      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var hl = hexString.toLowerCase();
      var h = hl.startsWith("#") ? hl.replace("#", "") : hl;
      var hexPart = h;
      if (h.length === 3) {
        hexPart = [0, 1, 2].map(function (s) {
          return h.substr(s, 1).repeat(2);
        }).join("");
      }

      return prefix ? "#" + hexPart : hexPart;
    }

    /**
     * Converts a decimal representation of color to a hex code string
     * @param {Array<number, number, number>} rgb - RGB value represented as
     *     an array of numbers
     * @returns {string} RGB value in hex code
     */

  }, {
    key: "rgbToHexCode",
    value: function rgbToHexCode(rgb) {
      return "#" + rgb.map(function (d) {
        var h = d.toString(16);
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

  }, {
    key: "hslToRgb",
    value: function hslToRgb(hsl) {
      /*
         https://www.w3.org/TR/css3-color/#hsl-color
       */
      var h = hsl[0] / 360;
      var s = hsl[1] / 100;
      var l = hsl[2] / 100;
      var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
      var m1 = l * 2 - m2;
      var r = this.hueToRgb(m1, m2, h + 1 / 3) * 255;
      var g = this.hueToRgb(m1, m2, h) * 255;
      var b = this.hueToRgb(m1, m2, h - 1 / 3) * 255;
      return [r, g, b].map(function (c) {
        return Math.round(c);
      });
    }

    /**
     * @private
     */

  }, {
    key: "hueToRgb",
    value: function hueToRgb(m1, m2, hInit) {
      var h = hInit;
      if (h < 0) {
        h = h + 1;
      }
      if (h > 1) {
        h = h - 1;
      }
      if (h * 6 < 1) {
        return m1 + (m2 - m1) * h * 6;
      }
      if (h * 2 < 1) {
        return m2;
      }
      if (h * 3 < 2) {
        return m1 + (m2 - m1) * (2 / 3 - h) * 6;
      }
      return m1;
    }

    /**
     * Converts HSL value to hex code
     * @param {Array<number, number, number>} hsl - An array of numbers that
     *     represents HSL value
     * @returns {string} Hex code
     */

  }, {
    key: "hslToHexCode",
    value: function hslToHexCode(hsl) {
      return this.rgbToHexCode(this.hslToRgb(hsl));
    }

    /**
     * Converts RGB value to HSL value
     * @param {Array<number, number, number>} rgb - An array of numbers that
     *     represents RGB value
     * @returns {Array<number, number, number>} An array of numbers that
     *     represents HSL value
     */

  }, {
    key: "rgbToHsl",
    value: function rgbToHsl(rgb) {
      var l = this.rgbToLightness(rgb) * 100;
      var s = this.rgbToSaturation(rgb) * 100;
      var h = this.rgbToHue(rgb);

      return [h, s, l];
    }

    /**
     * @private
     */

  }, {
    key: "rgbToLightness",
    value: function rgbToLightness(rgb) {
      return (Math.max.apply(Math, (0, _toConsumableArray3.default)(rgb)) + Math.min.apply(Math, (0, _toConsumableArray3.default)(rgb))) / 510;
    }

    /**
     * @private
     */

  }, {
    key: "rgbToHue",
    value: function rgbToHue(rgb) {
      /**
       References:
       Agoston, Max K. (2005).
       "Computer Graphics and Geometric Modeling: Implementation and Algorithms".
       London: Springer
        https://accessibility.kde.org/hsl-adjusted.php#hue
       */
      var max = Math.max.apply(Math, (0, _toConsumableArray3.default)(rgb));
      var min = Math.min.apply(Math, (0, _toConsumableArray3.default)(rgb));

      if (max === min) {
        return 0;
      } /* you can return whatever you like */

      var d = max - min;
      var mi = rgb.reduce(function (m, v, i) {
        return rgb[m] > v ? m : i;
      }, 0); /* maxIndex */
      var h = mi * 120 + (rgb[(mi + 1) % 3] - rgb[(mi + 2) % 3]) * 60 / d;

      return h < 0 ? h + 360 : h;
    }

    /**
     * @private
     */

  }, {
    key: "rgbToSaturation",
    value: function rgbToSaturation(rgb) {
      var l = this.rgbToLightness(rgb);
      var max = Math.max.apply(Math, (0, _toConsumableArray3.default)(rgb));
      var min = Math.min.apply(Math, (0, _toConsumableArray3.default)(rgb));
      var d = max - min;

      if (max === min) {
        return 0;
      }

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

  }, {
    key: "hexCodeToHsl",
    value: function hexCodeToHsl(hexCode) {
      return this.rgbToHsl(this.hexCodeToRgb(hexCode));
    }

    /**
     * Decimal rounding with a given precision
     * @param {number} number - Number to be rounded off
     * @param {number} precision - Number of digits after the decimal point
     * @returns {number} returns the rounded number
     */

  }, {
    key: "decimalRound",
    value: function decimalRound(number, precision) {
      var factor = Math.pow(10, precision);
      return Math.round(number * factor) / factor;
    }

    /**
     * Checks if a given array is a valid representation of RGB color.
     * @param {Array<number, number, number>} rgb - RGB value represented as
     *     an array of numbers
     * @returns {boolean} true if the argument is a valid RGB color
     */

  }, {
    key: "isValidRgb",
    value: function isValidRgb(rgb) {
      return rgb.length === 3 && rgb.every(function (c) {
        return c >= 0 && c <= 255 && (0, _isInteger2.default)(c);
      });
    }

    /**
     * Checks if a given array is a valid representation of HSL color.
     * @param {Array<number, number, number>} hsl - HSL value represented as
     *     an array of numbers
     * @returns {boolean} true if the argument is a valid HSL color
     */

  }, {
    key: "isValidHsl",
    value: function isValidHsl(hsl) {
      var upperLimits = [360, 100, 100];
      return hsl.length === 3 && hsl.every(function (c, i) {
        return typeof c === "number" && c >= 0 && c <= upperLimits[i];
      });
    }

    /**
     * Checks if a given string is a valid representation of RGB color.
     * @param {string} code - RGB value in hex code
     * @returns {boolean} returns true if then argument is a valid RGB color
     */

  }, {
    key: "isValidHexCode",
    value: function isValidHexCode(code) {
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

  }, {
    key: "isSameHexColor",
    value: function isSameHexColor(hexCode1, hexCode2) {
      var h1 = this.normalizeHexCode(hexCode1);
      var h2 = this.normalizeHexCode(hexCode2);
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

  }, {
    key: "isSameRgbColor",
    value: function isSameRgbColor(rgb1, rgb2) {
      if (rgb1.length !== rgb2.length) {
        return false;
      }
      return rgb1.every(function (primaryColor, i) {
        return primaryColor === rgb2[i];
      });
    }

    /**
     * Checks if a given object is a string
     * @param {object} str - Object to be checked
     * @returns {boolean} returns true if the argument is a string
     */

  }, {
    key: "isString",
    value: function isString(str) {
      return typeof str === "string" || str instanceof String;
    }

    /**
     * Checks if a given string is consists of uppercase letters
     * @param {string} str - string to be checked
     * @returns {boolean} returns true if letters in the argument string are
     *     all uppercase
     */

  }, {
    key: "isUpperCase",
    value: function isUpperCase(str) {
      return this.isString(str) && str.toUpperCase() === str;
    }

    /**
     * @private
     */

  }, {
    key: "setup",
    value: function setup() {
      /** @private */
      this.HEX_CODE_RE = /^#?[0-9a-f]{3}([0-9a-f]{3})?$/i;
    }

    /**
     * @private
     */

  }, {
    key: "clampToRange",
    value: function clampToRange(value, lowerBound, upperBound) {
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

  }, {
    key: "rgbMap",
    value: function rgbMap(values) {
      var func = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (func) {
        return values.map(function (val) {
          return ColorUtils.clampToRange(Math.round(func(val)), 0, 255);
        });
      } else {
        return values.map(function (val) {
          return ColorUtils.clampToRange(Math.round(val), 0, 255);
        });
      }
    }
  }]);
  return ColorUtils;
}();

/**
 * @deprecated Use .rgbToHexCode instead.
 */


ColorUtils.decimalToHexCode = ColorUtils.rgbToHexCode;

/**
 * @deprecated use .hexCodeToRgb instead.
 */
ColorUtils.hexCodeToDecimal = ColorUtils.hexCodeToRgb;

(function () {
  var Matrix = function () {
    function Matrix(matrix) {
      (0, _classCallCheck3.default)(this, Matrix);

      this.matrix = matrix;
    }

    (0, _createClass3.default)(Matrix, [{
      key: "add",
      value: function add(otherMatrix) {
        var newMatrix = this.matrix.map(function (row, i) {
          var otherRow = otherMatrix.matrix[i];
          return row.map(function (s, j) {
            return s + otherRow[j];
          });
        });

        return new Matrix(newMatrix);
      }
    }, {
      key: "multiply",
      value: function multiply(n) {
        if (typeof n === "number") {
          return this.multiplyByScalar(n);
        } else {
          return this.productByVector(n);
        }
      }
    }, {
      key: "multiplyByScalar",
      value: function multiplyByScalar(n) {
        var newMatrix = this.matrix.map(function (row) {
          return row.map(function (c) {
            return c * n;
          });
        });
        return new Matrix(newMatrix);
      }
    }, {
      key: "productByVector",
      value: function productByVector(vector) {
        return this.matrix.map(function (row) {
          return row.reduce(function (s, c, i) {
            return s += c * vector[i];
          }, 0);
        });
      }
    }]);
    return Matrix;
  }();

  ColorUtils.Matrix = Matrix;

  var rgbMap = ColorUtils.rgbMap;

  var ContrastCalc = function () {
    function ContrastCalc() {
      (0, _classCallCheck3.default)(this, ContrastCalc);
    }

    (0, _createClass3.default)(ContrastCalc, null, [{
      key: "calcRgb",

      /*
        https://www.w3.org/TR/filter-effects/#funcdef-contrast
        https://www.w3.org/TR/SVG/filters.html#TransferFunctionElementAttributes
      */
      value: function calcRgb(rgb) {
        var ratio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

        return rgbMap(rgb, function (c) {
          return (c * ratio + 255 * (50 - ratio / 2)) / 100;
        });
      }
    }]);
    return ContrastCalc;
  }();

  ColorUtils.ContrastCalc = ContrastCalc;

  var BrightnessCalc = function () {
    function BrightnessCalc() {
      (0, _classCallCheck3.default)(this, BrightnessCalc);
    }

    (0, _createClass3.default)(BrightnessCalc, null, [{
      key: "calcRgb",

      /*
        https://www.w3.org/TR/filter-effects/#funcdef-brightness
        https://www.w3.org/TR/SVG/filters.html#TransferFunctionElementAttributes
      */
      value: function calcRgb(rgb) {
        var ratio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

        return rgbMap(rgb, function (c) {
          return c * ratio / 100;
        });
      }
    }]);
    return BrightnessCalc;
  }();

  ColorUtils.BrightnessCalc = BrightnessCalc;

  var InvertCalc = function () {
    function InvertCalc() {
      (0, _classCallCheck3.default)(this, InvertCalc);
    }

    (0, _createClass3.default)(InvertCalc, null, [{
      key: "calcRgb",

      /*
        https://www.w3.org/TR/filter-effects/#funcdef-invert
        https://www.w3.org/TR/filter-effects-1/#invertEquivalent
        https://www.w3.org/TR/SVG/filters.html#TransferFunctionElementAttributes
      */
      value: function calcRgb(rgb, ratio) {
        return rgb.map(function (c) {
          return Math.round((100 * c - 2 * c * ratio + 255 * ratio) / 100);
        });
      }
    }]);
    return InvertCalc;
  }();

  ColorUtils.InvertCalc = InvertCalc;

  var HueRotateCalc = function () {
    function HueRotateCalc() {
      (0, _classCallCheck3.default)(this, HueRotateCalc);
    }

    (0, _createClass3.default)(HueRotateCalc, null, [{
      key: "calcRgb",

      /*
        https://www.w3.org/TR/filter-effects/#funcdef-hue-rotate
        https://www.w3.org/TR/SVG/filters.html#TransferFunctionElementAttributes
      */
      value: function calcRgb(rgb, deg) {
        return rgbMap(this.calcRotation(deg).multiply(rgb));
      }
    }, {
      key: "degToRad",
      value: function degToRad(deg) {
        return Math.PI * deg / 180;
      }
    }, {
      key: "calcRotation",
      value: function calcRotation(deg) {
        var rad = this.degToRad(deg);
        var cosPartResult = this.cosPart.multiply(Math.cos(rad));
        var sinPartResult = this.sinPart.multiply(Math.sin(rad));
        return this.constPart.add(cosPartResult).add(sinPartResult);
      }
    }]);
    return HueRotateCalc;
  }();

  HueRotateCalc.constPart = new Matrix([[0.213, 0.715, 0.072], [0.213, 0.715, 0.072], [0.213, 0.715, 0.072]]);

  HueRotateCalc.cosPart = new Matrix([[0.787, -0.715, -0.072], [-0.213, 0.285, -0.072], [-0.213, -0.715, 0.928]]);

  HueRotateCalc.sinPart = new Matrix([[-0.213, -0.715, 0.928], [0.143, 0.140, -0.283], [-0.787, 0.715, 0.072]]);

  ColorUtils.HueRotateCalc = HueRotateCalc;

  var SaturateCalc = function () {
    function SaturateCalc() {
      (0, _classCallCheck3.default)(this, SaturateCalc);
    }

    (0, _createClass3.default)(SaturateCalc, null, [{
      key: "calcRgb",

      /*
        https://www.w3.org/TR/filter-effects/#funcdef-saturate
        https://www.w3.org/TR/SVG/filters.html#feColorMatrixElement
      */
      value: function calcRgb(rgb, s) {
        return rgbMap(this.calcSaturation(s).multiply(rgb));
      }
    }, {
      key: "calcSaturation",
      value: function calcSaturation(s) {
        return this.constPart.add(this.saturatePart.multiply(s / 100));
      }
    }]);
    return SaturateCalc;
  }();

  SaturateCalc.constPart = HueRotateCalc.constPart;
  SaturateCalc.saturatePart = HueRotateCalc.cosPart;

  ColorUtils.SaturateCalc = SaturateCalc;

  var GrayscaleCalc = function () {
    function GrayscaleCalc() {
      (0, _classCallCheck3.default)(this, GrayscaleCalc);
    }

    (0, _createClass3.default)(GrayscaleCalc, null, [{
      key: "calcRgb",

      /*
        https://www.w3.org/TR/filter-effects/#funcdef-grayscale
        https://www.w3.org/TR/filter-effects/#grayscaleEquivalent
        https://www.w3.org/TR/SVG/filters.html#feColorMatrixElement
      */
      value: function calcRgb(rgb, s) {
        return rgbMap(this.calcGrayscale(s).multiply(rgb));
      }
    }, {
      key: "calcGrayscale",
      value: function calcGrayscale(s) {
        var r = 1 - Math.min(100, s) / 100;
        return this.constPart.add(this.ratioPart.multiply(r));
      }
    }]);
    return GrayscaleCalc;
  }();

  GrayscaleCalc.constPart = new Matrix([[0.2126, 0.7152, 0.0722], [0.2126, 0.7152, 0.0722], [0.2126, 0.7152, 0.0722]]);

  GrayscaleCalc.ratioPart = new Matrix([[0.7874, -0.7152, -0.0722], [-0.2126, 0.2848, -0.0722], [-0.2126, -0.7152, 0.9278]]);

  ColorUtils.GrayscaleCalc = GrayscaleCalc;

  /**
   * The RGB value of some colors.
   */
  ColorUtils.RGB = {
    BLACK: [0, 0, 0],
    WHITE: [255, 255, 255]
  };

  (0, _freeze2.default)(ColorUtils.RGB);
})();

ColorUtils.setup();

module.exports.ColorUtils = ColorUtils;

},{"babel-runtime/core-js/number/is-integer":12,"babel-runtime/core-js/number/parse-int":13,"babel-runtime/core-js/object/freeze":16,"babel-runtime/helpers/classCallCheck":21,"babel-runtime/helpers/createClass":22,"babel-runtime/helpers/toConsumableArray":26}],5:[function(require,module,exports){
"use strict";

/** @private */

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Utils = require("./color-utils").ColorUtils;
/** @private */
var Checker = require("./contrast-checker").ContrastChecker;
/** @private */
var LightnessFinder = require("./threshold-finder").LightnessFinder;
/** @private */
var BrightnessFinder = require("./threshold-finder").BrightnessFinder;

/**
 * Class of which each instance represents a specific color.
 * The instances provide methods to generate a new color with modified
 * properties, such as lightness or saturation.
 */

var Color = function () {
  (0, _createClass3.default)(Color, null, [{
    key: "getByName",

    /**
     * Returns an instance of Color for a predefined color name.
     * @param {string} name - names are defined at
     *     https://www.w3.org/TR/SVG/types.html#ColorKeywords
     * @returns {Color}
     */
    value: function getByName(name) {
      return this.List.NAME_TO_COLOR.get(name.toLowerCase());
    }

    /**
     * Returns an instance of Color for a hex code
     * @param {string} code - RGB value in hex code
     * @returns {Color}
     */

  }, {
    key: "getByHexCode",
    value: function getByHexCode(code) {
      var hexCode = Utils.normalizeHexCode(code);
      return this.List.HEX_TO_COLOR.get(hexCode) || new Color(hexCode);
    }

    /**
     * Creates an instance of Color from an HSL value
     * @param {Array<number,number, number>} hsl - an array of numbers that
     *     represents an HSL value
     * @returns {Color} An instance of Color
     */

  }, {
    key: "newHslColor",
    value: function newHslColor(hsl) {
      return this.getByHexCode(Utils.hslToHexCode(hsl));
    }

    /**
     * @private
     */

  }, {
    key: "assignColorConstants",
    value: function assignColorConstants() {
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

  }]);

  function Color(rgb) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    (0, _classCallCheck3.default)(this, Color);

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


  (0, _createClass3.default)(Color, [{
    key: "contrastRatioAgainst",


    /**
     * Calculate the contrast ratio against another color
     * @param {Color|string|Array<number, number, number>} color - another color
     *     as an instance of Color, a hex code or a RGB value
     * @returns {number}
     */
    value: function contrastRatioAgainst(color) {
      if (!(color instanceof Color)) {
        return Checker.contrastRatio(this.rgb, color);
      }

      return Checker.luminanceToContrastRatio(this.relativeLuminance, color.relativeLuminance);
    }

    /**
     * @param {number} ratio - Value in percent
     * @param {string} [name=null] - Name of color
     * @returns {Color}
     */

  }, {
    key: "newContrastColor",
    value: function newContrastColor(ratio) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return this.generateNewColor(Utils.ContrastCalc, ratio, name);
    }

    /**
     * @param {number} ratio - Value in percent
     * @param {string} [name=null] - Name of color
     * @returns {Color}
     */

  }, {
    key: "newBrightnessColor",
    value: function newBrightnessColor(ratio) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return this.generateNewColor(Utils.BrightnessCalc, ratio, name);
    }

    /**
     * @param {number} [ratio=100] - Value in percent
     * @param {string} [name=null] - Name of color
     * @returns {Color}
     */

  }, {
    key: "newInvertColor",
    value: function newInvertColor() {
      var ratio = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return this.generateNewColor(Utils.InvertCalc, ratio, name);
    }

    /**
     * @param {number} degree - Value in degree
     * @param {string} [name=null] - Name of color
     * @returns {Color}
     */

  }, {
    key: "newHueRotateColor",
    value: function newHueRotateColor(degree) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return this.generateNewColor(Utils.HueRotateCalc, degree, name);
    }

    /**
     * @param {number} ratio - Value in percent
     * @param {string} [name=null] - Name of color
     * @returns {Color}
     */

  }, {
    key: "newSaturateColor",
    value: function newSaturateColor(ratio) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return this.generateNewColor(Utils.SaturateCalc, ratio, name);
    }

    /**
     * @param {number} [ratio=100] - Conversion ratio in percentage
     * @param {string} [name=null] - Name of color
     * @returns {Color}
     */

  }, {
    key: "newGrayscaleColor",
    value: function newGrayscaleColor() {
      var ratio = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

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

  }, {
    key: "findBrightnessThreshold",
    value: function findBrightnessThreshold(otherColor) {
      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "AA";

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

  }, {
    key: "findLightnessThreshold",
    value: function findLightnessThreshold(otherColor) {
      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "AA";

      var newRgb = LightnessFinder.find(this.rgb, otherColor.rgb, level);
      return new Color(newRgb);
    }

    /**
     * @param {Color} otherColor
     * @returns {string} A, AA or AAA if the contrast ratio meets the criteria of
     *     WCAG 2.0, otherwise "-"
     */

  }, {
    key: "contrastLevel",
    value: function contrastLevel(otherColor) {
      var ratio = this.contrastRatioAgainst(otherColor);
      return Checker.ratioToLevel(ratio);
    }

    /**
     * Checks if the contrast ratio between the base color and otherColor meets
     * the requirement of WCAG 2.0
     * @param {Color} otherColor
     * @param {string} [level="AA"] - A, AA or AAA
     * @returns {boolean}
     */

  }, {
    key: "hasSufficientContrast",
    value: function hasSufficientContrast(otherColor) {
      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "AA";

      var ratio = Checker.levelToRatio(level);
      return this.contrastRatioAgainst(otherColor) >= ratio;
    }

    /**
     * Checks if the base color and otherColor have the same RGB value
     * @param {Color} otherColor
     * @returns {boolean}
     */

  }, {
    key: "isSameColor",
    value: function isSameColor(otherColor) {
      return this.hexCode === otherColor.hexCode;
    }

    /**
     * @returns {boolean} true if each primary color of the base color is 0 or 255
     */

  }, {
    key: "isMaxContrast",
    value: function isMaxContrast() {
      var limits = [0, 255];
      return this.rgb.every(function (primaryColor) {
        return limits.includes(primaryColor);
      });
    }

    /**
     * @returns {boolean} true if the hex code of the color is #808080
     */

  }, {
    key: "isMinContrast",
    value: function isMinContrast() {
      var _this = this;

      return this.rgb.every(function (primaryColor, i) {
        return _this.GRAY.rgb[i] === primaryColor;
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

  }, {
    key: "toString",
    value: function toString() {
      var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;

      switch (base) {
        case 16:
          return this.hexCode;
        case 10:
          return "rgb(" + this.rgb.join(",") + ")";
        default:
          return this.name || this.hexCode;
      }
    }

    /**
     * @param {Color} otherColor
     * @returns {boolean} true if the relative luminance of the base color is
     *     greater than that of otherColor
     */

  }, {
    key: "isBrighterThan",
    value: function isBrighterThan(otherColor) {
      return this.relativeLuminance > otherColor.relativeLuminance;
    }

    /**
     * @param {Color} otherColor
     * @returns {boolean} true if the relative luminance of the base color is
     *     equal to that of otherColor
     */

  }, {
    key: "hasSameLuminance",
    value: function hasSameLuminance(otherColor) {
      return this.relativeLuminance === otherColor.relativeLuminance;
    }

    /**
     * @returns {boolean} true if the contrast ratio against white is qual to or
     *     less than the ratio against black
     */

  }, {
    key: "isLightColor",
    value: function isLightColor() {
      return Checker.isLightColor(this.rgb);
    }

    /**
     * @private
     */

  }, {
    key: "freezeProperties",
    value: function freezeProperties() {
      (0, _freeze2.default)(this.rgb);
      (0, _freeze2.default)(this.relativeLuminance);
      (0, _freeze2.default)(this.name);
      (0, _freeze2.default)(this.hexCode);
    }

    /**
     * @private
     */

  }, {
    key: "generateNewColor",
    value: function generateNewColor(calc, ratio) {
      var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var newRgb = calc.calcRgb(this.rgb, ratio);
      return new Color(newRgb, name);
    }
  }, {
    key: "hsl",
    get: function get() {
      if (this._hsl) {
        return this._hsl;
      }
      this._hsl = Utils.rgbToHsl(this.rgb);
      return this._hsl;
    }
  }]);
  return Color;
}();

var List = function () {
  function List() {
    (0, _classCallCheck3.default)(this, List);
  }

  (0, _createClass3.default)(List, null, [{
    key: "setup",

    /**
     * @private
     */
    value: function setup(colorKeywordsJSON) {
      this.loadColorKeywords(colorKeywordsJSON);
      this.generateWebSafeColors();
      (0, _freeze2.default)(this);
    }

    /**
     * @private
     */

  }, {
    key: "loadColorKeywords",
    value: function loadColorKeywords(colorKeywordsJSON) {
      var _this2 = this;

      /**
       * Array of named colors defined at
       * https://www.w3.org/TR/SVG/types.html#ColorKeywords
       * @property {Color[]} NAMED_COLORS
       */
      this.NAMED_COLORS = [];
      /** @private */
      this.NAME_TO_COLOR = new _map2.default();
      /** @private */
      this.HEX_TO_COLOR = new _map2.default();
      colorKeywordsJSON.forEach(function (keyword) {
        var _keyword = (0, _slicedToArray3.default)(keyword, 2),
            name = _keyword[0],
            hex = _keyword[1];

        var color = new Color(hex, name);
        _this2.NAMED_COLORS.push(color);
        _this2.NAME_TO_COLOR.set(name, color);
        _this2.HEX_TO_COLOR.set(hex, color);
      });

      (0, _freeze2.default)(this.NAMED_COLORS);
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

  }, {
    key: "hslColors",
    value: function hslColors() {
      var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
      var l = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
      var h_interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      var colors = [];
      for (var h = 0; h < 361; h += h_interval) {
        colors.push(Color.newHslColor([h, s, l]));
      }
      return colors;
    }

    /**
     * @private
     */

  }, {
    key: "generateWebSafeColors",
    value: function generateWebSafeColors() {
      /**
       * Array of web safe colors
       * @property {Color[]} WEB_SAFE_COLORS
       */
      this.WEB_SAFE_COLORS = [];

      for (var r = 0; r < 16; r += 3) {
        for (var g = 0; g < 16; g += 3) {
          for (var b = 0; b < 16; b += 3) {
            var hexCode = Utils.rgbToHexCode([r, g, b].map(function (c) {
              return c * 17;
            }));
            var predefined = this.HEX_TO_COLOR.get(hexCode);
            var color = predefined || new Color(hexCode);
            this.WEB_SAFE_COLORS.push(color);
          }
        }
      }
    }
  }]);
  return List;
}();

List.setup(require("./color-keywords.json"));
Color.List = List;
Color.assignColorConstants();

module.exports.Color = Color;

},{"./color-keywords.json":3,"./color-utils":4,"./contrast-checker":6,"./threshold-finder":7,"babel-runtime/core-js/map":11,"babel-runtime/core-js/object/freeze":16,"babel-runtime/helpers/classCallCheck":21,"babel-runtime/helpers/createClass":22,"babel-runtime/helpers/slicedToArray":25}],6:[function(require,module,exports){
"use strict";

/** @private */

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Utils = require("./color-utils").ColorUtils;

/**
 * Collection of functions that check properties of given colors
 */

var ContrastChecker = function () {
  function ContrastChecker() {
    (0, _classCallCheck3.default)(this, ContrastChecker);
  }

  (0, _createClass3.default)(ContrastChecker, null, [{
    key: "relativeLuminance",

    /**
     * Calculate the relative luminance of a RGB color given as a string or
     * an array of numbers
     * @param {string|Array<number, number, number>} rgb - RGB value represented
     *     as a string (hex code) or an array of numbers
     * @returns {number} Relative luminance
     */
    value: function relativeLuminance() {
      var _this = this;

      var rgb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [255, 255, 255];

      /*
        https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
      */
      if (Utils.isString(rgb)) {
        rgb = Utils.hexCodeToRgb(rgb);
      }

      var _rgb$map = rgb.map(function (c) {
        return _this.tristimulusValue(c);
      }),
          _rgb$map2 = (0, _slicedToArray3.default)(_rgb$map, 3),
          r = _rgb$map2[0],
          g = _rgb$map2[1],
          b = _rgb$map2[2];

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

  }, {
    key: "contrastRatio",
    value: function contrastRatio(foreground, background) {
      var _this2 = this;

      /*
        https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
      */
      var _map = [foreground, background].map(function (c) {
        return _this2.relativeLuminance(c);
      }),
          _map2 = (0, _slicedToArray3.default)(_map, 2),
          l1 = _map2[0],
          l2 = _map2[1];

      return this.luminanceToContrastRatio(l1, l2);
    }

    /**
     * Rate a given contrast ratio according to the WCAG 2.0 criteria
     * @param {number} ratio - Contrast ratio
     * @returns {string} A, AA or AAA if the contrast ratio meets the criteria of
     *     WCAG 2.0, otherwise "-"
     */

  }, {
    key: "ratioToLevel",
    value: function ratioToLevel(ratio) {
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

  }, {
    key: "isLightColor",
    value: function isLightColor(color) {
      var whiteLuminance = this.LUMINANCE.WHITE;
      var blackLuminance = this.LUMINANCE.BLACK;
      var l = this.relativeLuminance(color);
      var ratioWithWhite = this.luminanceToContrastRatio(whiteLuminance, l);
      var ratioWithBlack = this.luminanceToContrastRatio(blackLuminance, l);
      return ratioWithWhite <= ratioWithBlack;
    }

    /**
     * @private
     */

  }, {
    key: "tristimulusValue",
    value: function tristimulusValue(primaryColor) {
      var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 255;

      var s = primaryColor / base;
      if (s <= 0.03928) {
        return s / 12.92;
      } else {
        return Math.pow((s + 0.055) / 1.055, 2.4);
      }
    }

    /**
     * @private
     */

  }, {
    key: "luminanceToContrastRatio",
    value: function luminanceToContrastRatio(luminance1, luminance2) {
      var _sort = [luminance1, luminance2].sort(function (f, s) {
        return s - f;
      }),
          _sort2 = (0, _slicedToArray3.default)(_sort, 2),
          l1 = _sort2[0],
          l2 = _sort2[1];

      return (l1 + 0.05) / (l2 + 0.05);
    }

    /**
     * @private
     */

  }, {
    key: "levelToRatio",
    value: function levelToRatio(level) {
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
  }]);
  return ContrastChecker;
}();

/**
 * The relative luminance of some colors.
 */


ContrastChecker.LUMINANCE = {
  BLACK: 0.0,
  WHITE: 1.0
};

(0, _freeze2.default)(ContrastChecker.LUMINANCE);

module.exports.ContrastChecker = ContrastChecker;

},{"./color-utils":4,"babel-runtime/core-js/object/freeze":16,"babel-runtime/helpers/classCallCheck":21,"babel-runtime/helpers/createClass":22,"babel-runtime/helpers/slicedToArray":25}],7:[function(require,module,exports){
"use strict";

/** @private */

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Utils = require("./color-utils").ColorUtils;
/** @private */
var Checker = require("./contrast-checker").ContrastChecker;

/** @private */

var SearchCriteria = function () {
  (0, _createClass3.default)(SearchCriteria, null, [{
    key: "shouldScanDarkerSide",
    value: function shouldScanDarkerSide(fixedRgb, otherRgb) {
      var fixedLuminance = Checker.relativeLuminance(fixedRgb);
      var otherLuminance = Checker.relativeLuminance(otherRgb);
      return fixedLuminance > otherLuminance || fixedLuminance === otherLuminance && Checker.isLightColor(fixedRgb);
    }
  }, {
    key: "define",
    value: function define(fixedRgb, otherRgb, level) {
      var targetRatio = Checker.levelToRatio(level);

      if (this.shouldScanDarkerSide(fixedRgb, otherRgb)) {
        return new ToDarkerSide(targetRatio, fixedRgb);
      } else {
        return new ToBrighterSide(targetRatio, fixedRgb);
      }
    }
  }]);

  function SearchCriteria(targetRatio, fixedRgb) {
    (0, _classCallCheck3.default)(this, SearchCriteria);

    this.targetRatio = targetRatio;
    this.fixedLuminance = Checker.relativeLuminance(fixedRgb);
  }

  (0, _createClass3.default)(SearchCriteria, [{
    key: "hasSufficientContrast",
    value: function hasSufficientContrast(rgb) {
      return this.contrastRatio(rgb) >= this.targetRatio;
    }
  }, {
    key: "contrastRatio",
    value: function contrastRatio(rgb) {
      var luminance = Checker.relativeLuminance(rgb);
      return Checker.luminanceToContrastRatio(this.fixedLuminance, luminance);
    }
  }]);
  return SearchCriteria;
}();

/** @private */


var ToDarkerSide = function (_SearchCriteria) {
  (0, _inherits3.default)(ToDarkerSide, _SearchCriteria);

  function ToDarkerSide() {
    (0, _classCallCheck3.default)(this, ToDarkerSide);
    return (0, _possibleConstructorReturn3.default)(this, (ToDarkerSide.__proto__ || (0, _getPrototypeOf2.default)(ToDarkerSide)).apply(this, arguments));
  }

  (0, _createClass3.default)(ToDarkerSide, [{
    key: "round",
    value: function round(r) {
      return Math.floor(r * 10) / 10;
    }
  }, {
    key: "incrementCondition",
    value: function incrementCondition(contrastRatio) {
      return contrastRatio > this.targetRatio;
    }
  }]);
  return ToDarkerSide;
}(SearchCriteria);

/** @private */


var ToBrighterSide = function (_SearchCriteria2) {
  (0, _inherits3.default)(ToBrighterSide, _SearchCriteria2);

  function ToBrighterSide() {
    (0, _classCallCheck3.default)(this, ToBrighterSide);
    return (0, _possibleConstructorReturn3.default)(this, (ToBrighterSide.__proto__ || (0, _getPrototypeOf2.default)(ToBrighterSide)).apply(this, arguments));
  }

  (0, _createClass3.default)(ToBrighterSide, [{
    key: "round",
    value: function round(r) {
      return Math.ceil(r * 10) / 10;
    }
  }, {
    key: "incrementCondition",
    value: function incrementCondition(contrastRatio) {
      return this.targetRatio > contrastRatio;
    }
  }]);
  return ToBrighterSide;
}(SearchCriteria);

/** @private */


var ThresholdFinder = function () {
  function ThresholdFinder() {
    (0, _classCallCheck3.default)(this, ThresholdFinder);
  }

  (0, _createClass3.default)(ThresholdFinder, null, [{
    key: "binarySearchWidth",

    /** @private */
    value: _regenerator2.default.mark(function binarySearchWidth(initWidth, min) {
      var i, d;
      return _regenerator2.default.wrap(function binarySearchWidth$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              i = 1;
              d = initWidth / Math.pow(2, i);

            case 2:
              if (!(d > min)) {
                _context.next = 9;
                break;
              }

              _context.next = 5;
              return d;

            case 5:
              i++;
              d = initWidth / Math.pow(2, i);
              _context.next = 2;
              break;

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, binarySearchWidth, this);
    })

    /**
     * @private
     */

  }, {
    key: "findRatio",
    value: function findRatio(otherColor, criteria, initRatio, initWidth) {
      var r = initRatio;
      var lastSufficientRatio = null;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(this.binarySearchWidth(initWidth, 0.01)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var d = _step.value;

          var newRgb = this.rgbWithRatio(otherColor, r);
          var newRatio = criteria.contrastRatio(newRgb);

          if (criteria.hasSufficientContrast(newRgb)) {
            lastSufficientRatio = r;
          }
          if (newRatio === criteria.targetRatio) {
            break;
          }
          r += criteria.incrementCondition(newRatio) ? d : -d;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return [r, lastSufficientRatio];
    }

    /**
     * @private
     */

  }, {
    key: "rgbWithBetterRatio",
    value: function rgbWithBetterRatio(color, criteria, r, lastSufficientRatio) {
      var nearestRgb = this.rgbWithRatio(color, r);

      if (lastSufficientRatio && !criteria.hasSufficientContrast(nearestRgb)) {
        return this.rgbWithRatio(color, lastSufficientRatio);
      }

      return nearestRgb;
    }
  }]);
  return ThresholdFinder;
}();

/** @private */


var LightnessFinder = function (_ThresholdFinder) {
  (0, _inherits3.default)(LightnessFinder, _ThresholdFinder);

  function LightnessFinder() {
    (0, _classCallCheck3.default)(this, LightnessFinder);
    return (0, _possibleConstructorReturn3.default)(this, (LightnessFinder.__proto__ || (0, _getPrototypeOf2.default)(LightnessFinder)).apply(this, arguments));
  }

  (0, _createClass3.default)(LightnessFinder, null, [{
    key: "find",

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
    value: function find(fixedRgb, otherRgb) {
      var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "AA";

      var criteria = SearchCriteria.define(fixedRgb, otherRgb, level);
      var otherHsl = Utils.rgbToHsl(otherRgb);

      var _determineMinmax = this.determineMinmax(fixedRgb, otherRgb, otherHsl[2]),
          _determineMinmax2 = (0, _slicedToArray3.default)(_determineMinmax, 2),
          max = _determineMinmax2[0],
          min = _determineMinmax2[1];

      var boundaryRgb = this.boundaryColor(fixedRgb, max, min, criteria);

      if (boundaryRgb) {
        return boundaryRgb;
      }

      var _findRatio = this.findRatio(otherHsl, criteria, (max + min) / 2, max - min),
          _findRatio2 = (0, _slicedToArray3.default)(_findRatio, 2),
          r = _findRatio2[0],
          lastSufficientRatio = _findRatio2[1];

      return this.rgbWithBetterRatio(otherHsl, criteria, r, lastSufficientRatio);
    }

    /**
     * @private
     */

  }, {
    key: "rgbWithRatio",
    value: function rgbWithRatio(hsl, ratio) {
      if (ratio !== undefined && hsl[2] !== ratio) {
        hsl = hsl.slice(0);
        hsl[2] = ratio;
      }

      return Utils.hslToRgb(hsl);
    }

    /**
     * @private
     */

  }, {
    key: "determineMinmax",
    value: function determineMinmax(fixedRgb, otherRgb, initL) {
      if (SearchCriteria.shouldScanDarkerSide(fixedRgb, otherRgb)) {
        return [initL, 0];
      } else {
        return [100, initL];
      }
    }

    /**
     * @private
     */

  }, {
    key: "boundaryColor",
    value: function boundaryColor(rgb, max, min, criteria) {
      var black = Checker.LUMINANCE.BLACK;
      var white = Checker.LUMINANCE.WHITE;

      if (min === 0 && !this.hasSufficientContrast(black, rgb, criteria)) {
        return Utils.RGB.BLACK;
      }

      if (max === 100 && !this.hasSufficientContrast(white, rgb, criteria)) {
        return Utils.RGB.WHITE;
      }

      return null;
    }

    /**
     * @private
     */

  }, {
    key: "hasSufficientContrast",
    value: function hasSufficientContrast(fixedLuminance, rgb, criteria) {
      var luminance = Checker.relativeLuminance(rgb);
      var ratio = Checker.luminanceToContrastRatio(fixedLuminance, luminance);
      return ratio >= criteria.targetRatio;
    }
  }]);
  return LightnessFinder;
}(ThresholdFinder);

/** @private */


var BrightnessFinder = function (_ThresholdFinder2) {
  (0, _inherits3.default)(BrightnessFinder, _ThresholdFinder2);

  function BrightnessFinder() {
    (0, _classCallCheck3.default)(this, BrightnessFinder);
    return (0, _possibleConstructorReturn3.default)(this, (BrightnessFinder.__proto__ || (0, _getPrototypeOf2.default)(BrightnessFinder)).apply(this, arguments));
  }

  (0, _createClass3.default)(BrightnessFinder, null, [{
    key: "find",

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
    value: function find(fixedRgb, otherRgb) {
      var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "AA";

      var criteria = SearchCriteria.define(fixedRgb, otherRgb, level);
      var w = this.calcUpperRatioLimit(otherRgb) / 2;

      var upperRgb = this.rgbWithRatio(otherRgb, w * 2);

      if (this.exceedUpperLimit(criteria, otherRgb, upperRgb)) {
        return upperRgb;
      }

      var ratios = this.findRatio(otherRgb, criteria, w, w).map(criteria.round);

      return this.rgbWithBetterRatio.apply(this, [otherRgb, criteria].concat((0, _toConsumableArray3.default)(ratios)));
    }

    /**
     * @private
     */

  }, {
    key: "rgbWithRatio",
    value: function rgbWithRatio(rgb, ratio) {
      return Utils.BrightnessCalc.calcRgb(rgb, ratio);
    }

    /**
     * @private
     */

  }, {
    key: "exceedUpperLimit",
    value: function exceedUpperLimit(criteria, otherRgb, upperRgb) {
      var otherLuminance = Checker.relativeLuminance(otherRgb);
      return otherLuminance > criteria.fixedLuminance && !criteria.hasSufficientContrast(upperRgb);
    }

    /**
     * @private
     */

  }, {
    key: "calcUpperRatioLimit",
    value: function calcUpperRatioLimit(rgb) {
      if (Utils.isSameRgbColor(Utils.RGB.BLACK, rgb)) {
        return 100;
      }

      var darkest = rgb.filter(function (c) {
        return c !== 0;
      }).reduce(function (a, b) {
        return Math.min(a, b);
      });
      return Math.ceil(255 / darkest * 100);
    }
  }]);
  return BrightnessFinder;
}(ThresholdFinder);

module.exports.LightnessFinder = LightnessFinder;
module.exports.BrightnessFinder = BrightnessFinder;

},{"./color-utils":4,"./contrast-checker":6,"babel-runtime/core-js/get-iterator":9,"babel-runtime/core-js/object/get-prototype-of":17,"babel-runtime/helpers/classCallCheck":21,"babel-runtime/helpers/createClass":22,"babel-runtime/helpers/inherits":23,"babel-runtime/helpers/possibleConstructorReturn":24,"babel-runtime/helpers/slicedToArray":25,"babel-runtime/helpers/toConsumableArray":26,"babel-runtime/regenerator":28}],8:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/array/from"), __esModule: true };
},{"core-js/library/fn/array/from":29}],9:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":30}],10:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/is-iterable"), __esModule: true };
},{"core-js/library/fn/is-iterable":31}],11:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/map"), __esModule: true };
},{"core-js/library/fn/map":32}],12:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/number/is-integer"), __esModule: true };
},{"core-js/library/fn/number/is-integer":33}],13:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/number/parse-int"), __esModule: true };
},{"core-js/library/fn/number/parse-int":34}],14:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":35}],15:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":36}],16:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/freeze"), __esModule: true };
},{"core-js/library/fn/object/freeze":37}],17:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/get-prototype-of":38}],18:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":39}],19:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":40}],20:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":41}],21:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
},{}],22:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _defineProperty = require("../core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
},{"../core-js/object/define-property":15}],23:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _setPrototypeOf = require("../core-js/object/set-prototype-of");

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = require("../core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _typeof2 = require("../helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};
},{"../core-js/object/create":14,"../core-js/object/set-prototype-of":18,"../helpers/typeof":27}],24:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _typeof2 = require("../helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};
},{"../helpers/typeof":27}],25:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _isIterable2 = require("../core-js/is-iterable");

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _getIterator2 = require("../core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();
},{"../core-js/get-iterator":9,"../core-js/is-iterable":10}],26:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _from = require("../core-js/array/from");

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};
},{"../core-js/array/from":8}],27:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _iterator = require("../core-js/symbol/iterator");

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = require("../core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
},{"../core-js/symbol":19,"../core-js/symbol/iterator":20}],28:[function(require,module,exports){
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":140}],29:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/_core').Array.from;
},{"../../modules/_core":56,"../../modules/es6.array.from":123,"../../modules/es6.string.iterator":134}],30:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.get-iterator');
},{"../modules/core.get-iterator":121,"../modules/es6.string.iterator":134,"../modules/web.dom.iterable":139}],31:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.is-iterable');
},{"../modules/core.is-iterable":122,"../modules/es6.string.iterator":134,"../modules/web.dom.iterable":139}],32:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.map');
require('../modules/es7.map.to-json');
module.exports = require('../modules/_core').Map;
},{"../modules/_core":56,"../modules/es6.map":125,"../modules/es6.object.to-string":133,"../modules/es6.string.iterator":134,"../modules/es7.map.to-json":136,"../modules/web.dom.iterable":139}],33:[function(require,module,exports){
require('../../modules/es6.number.is-integer');
module.exports = require('../../modules/_core').Number.isInteger;
},{"../../modules/_core":56,"../../modules/es6.number.is-integer":126}],34:[function(require,module,exports){
require('../../modules/es6.number.parse-int');
module.exports = parseInt;
},{"../../modules/es6.number.parse-int":127}],35:[function(require,module,exports){
require('../../modules/es6.object.create');
var $Object = require('../../modules/_core').Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};
},{"../../modules/_core":56,"../../modules/es6.object.create":128}],36:[function(require,module,exports){
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};
},{"../../modules/_core":56,"../../modules/es6.object.define-property":129}],37:[function(require,module,exports){
require('../../modules/es6.object.freeze');
module.exports = require('../../modules/_core').Object.freeze;
},{"../../modules/_core":56,"../../modules/es6.object.freeze":130}],38:[function(require,module,exports){
require('../../modules/es6.object.get-prototype-of');
module.exports = require('../../modules/_core').Object.getPrototypeOf;
},{"../../modules/_core":56,"../../modules/es6.object.get-prototype-of":131}],39:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/_core').Object.setPrototypeOf;
},{"../../modules/_core":56,"../../modules/es6.object.set-prototype-of":132}],40:[function(require,module,exports){
require('../../modules/es6.symbol');
require('../../modules/es6.object.to-string');
require('../../modules/es7.symbol.async-iterator');
require('../../modules/es7.symbol.observable');
module.exports = require('../../modules/_core').Symbol;
},{"../../modules/_core":56,"../../modules/es6.object.to-string":133,"../../modules/es6.symbol":135,"../../modules/es7.symbol.async-iterator":137,"../../modules/es7.symbol.observable":138}],41:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/web.dom.iterable');
module.exports = require('../../modules/_wks-ext').f('iterator');
},{"../../modules/_wks-ext":118,"../../modules/es6.string.iterator":134,"../../modules/web.dom.iterable":139}],42:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],43:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],44:[function(require,module,exports){
module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};
},{}],45:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":76}],46:[function(require,module,exports){
var forOf = require('./_for-of');

module.exports = function(iter, ITERATOR){
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":66}],47:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length')
  , toIndex   = require('./_to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};
},{"./_to-index":110,"./_to-iobject":112,"./_to-length":113}],48:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = require('./_ctx')
  , IObject  = require('./_iobject')
  , toObject = require('./_to-object')
  , toLength = require('./_to-length')
  , asc      = require('./_array-species-create');
module.exports = function(TYPE, $create){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
    , create        = $create || asc;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"./_array-species-create":50,"./_ctx":58,"./_iobject":72,"./_to-length":113,"./_to-object":114}],49:[function(require,module,exports){
var isObject = require('./_is-object')
  , isArray  = require('./_is-array')
  , SPECIES  = require('./_wks')('species');

module.exports = function(original){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return C === undefined ? Array : C;
};
},{"./_is-array":74,"./_is-object":76,"./_wks":119}],50:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function(original, length){
  return new (speciesConstructor(original))(length);
};
},{"./_array-species-constructor":49}],51:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof')
  , TAG = require('./_wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./_cof":52,"./_wks":119}],52:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],53:[function(require,module,exports){
'use strict';
var dP          = require('./_object-dp').f
  , create      = require('./_object-create')
  , redefineAll = require('./_redefine-all')
  , ctx         = require('./_ctx')
  , anInstance  = require('./_an-instance')
  , defined     = require('./_defined')
  , forOf       = require('./_for-of')
  , $iterDefine = require('./_iter-define')
  , step        = require('./_iter-step')
  , setSpecies  = require('./_set-species')
  , DESCRIPTORS = require('./_descriptors')
  , fastKey     = require('./_meta').fastKey
  , SIZE        = DESCRIPTORS ? '_s' : 'size';

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        anInstance(this, C, 'forEach');
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)dP(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};
},{"./_an-instance":44,"./_ctx":58,"./_defined":59,"./_descriptors":60,"./_for-of":66,"./_iter-define":79,"./_iter-step":81,"./_meta":85,"./_object-create":86,"./_object-dp":87,"./_redefine-all":100,"./_set-species":103}],54:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = require('./_classof')
  , from    = require('./_array-from-iterable');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};
},{"./_array-from-iterable":46,"./_classof":51}],55:[function(require,module,exports){
'use strict';
var global         = require('./_global')
  , $export        = require('./_export')
  , meta           = require('./_meta')
  , fails          = require('./_fails')
  , hide           = require('./_hide')
  , redefineAll    = require('./_redefine-all')
  , forOf          = require('./_for-of')
  , anInstance     = require('./_an-instance')
  , isObject       = require('./_is-object')
  , setToStringTag = require('./_set-to-string-tag')
  , dP             = require('./_object-dp').f
  , each           = require('./_array-methods')(0)
  , DESCRIPTORS    = require('./_descriptors');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  if(!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    C = wrapper(function(target, iterable){
      anInstance(target, C, NAME, '_c');
      target._c = new Base;
      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
    });
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','),function(KEY){
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
        anInstance(this, C, KEY);
        if(!IS_ADDER && IS_WEAK && !isObject(a))return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    if('size' in proto)dP(C.prototype, 'size', {
      get: function(){
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F, O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./_an-instance":44,"./_array-methods":48,"./_descriptors":60,"./_export":64,"./_fails":65,"./_for-of":66,"./_global":67,"./_hide":69,"./_is-object":76,"./_meta":85,"./_object-dp":87,"./_redefine-all":100,"./_set-to-string-tag":104}],56:[function(require,module,exports){
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],57:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp')
  , createDesc      = require('./_property-desc');

module.exports = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};
},{"./_object-dp":87,"./_property-desc":99}],58:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":42}],59:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],60:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":65}],61:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":67,"./_is-object":76}],62:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
},{}],63:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys')
  , gOPS    = require('./_object-gops')
  , pIE     = require('./_object-pie');
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};
},{"./_object-gops":92,"./_object-keys":95,"./_object-pie":96}],64:[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , ctx       = require('./_ctx')
  , hide      = require('./_hide')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
},{"./_core":56,"./_ctx":58,"./_global":67,"./_hide":69}],65:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],66:[function(require,module,exports){
var ctx         = require('./_ctx')
  , call        = require('./_iter-call')
  , isArrayIter = require('./_is-array-iter')
  , anObject    = require('./_an-object')
  , toLength    = require('./_to-length')
  , getIterFn   = require('./core.get-iterator-method')
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;
},{"./_an-object":45,"./_ctx":58,"./_is-array-iter":73,"./_iter-call":77,"./_to-length":113,"./core.get-iterator-method":120}],67:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],68:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],69:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":60,"./_object-dp":87,"./_property-desc":99}],70:[function(require,module,exports){
module.exports = require('./_global').document && document.documentElement;
},{"./_global":67}],71:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":60,"./_dom-create":61,"./_fails":65}],72:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":52}],73:[function(require,module,exports){
// check on default Array iterator
var Iterators  = require('./_iterators')
  , ITERATOR   = require('./_wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./_iterators":82,"./_wks":119}],74:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};
},{"./_cof":52}],75:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object')
  , floor    = Math.floor;
module.exports = function isInteger(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
};
},{"./_is-object":76}],76:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],77:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./_an-object":45}],78:[function(require,module,exports){
'use strict';
var create         = require('./_object-create')
  , descriptor     = require('./_property-desc')
  , setToStringTag = require('./_set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./_hide":69,"./_object-create":86,"./_property-desc":99,"./_set-to-string-tag":104,"./_wks":119}],79:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./_library')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , hide           = require('./_hide')
  , has            = require('./_has')
  , Iterators      = require('./_iterators')
  , $iterCreate    = require('./_iter-create')
  , setToStringTag = require('./_set-to-string-tag')
  , getPrototypeOf = require('./_object-gpo')
  , ITERATOR       = require('./_wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./_export":64,"./_has":68,"./_hide":69,"./_iter-create":78,"./_iterators":82,"./_library":84,"./_object-gpo":93,"./_redefine":101,"./_set-to-string-tag":104,"./_wks":119}],80:[function(require,module,exports){
var ITERATOR     = require('./_wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./_wks":119}],81:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],82:[function(require,module,exports){
module.exports = {};
},{}],83:[function(require,module,exports){
var getKeys   = require('./_object-keys')
  , toIObject = require('./_to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./_object-keys":95,"./_to-iobject":112}],84:[function(require,module,exports){
module.exports = true;
},{}],85:[function(require,module,exports){
var META     = require('./_uid')('meta')
  , isObject = require('./_is-object')
  , has      = require('./_has')
  , setDesc  = require('./_object-dp').f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !require('./_fails')(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};
},{"./_fails":65,"./_has":68,"./_is-object":76,"./_object-dp":87,"./_uid":116}],86:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = require('./_an-object')
  , dPs         = require('./_object-dps')
  , enumBugKeys = require('./_enum-bug-keys')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":45,"./_dom-create":61,"./_enum-bug-keys":62,"./_html":70,"./_object-dps":88,"./_shared-key":105}],87:[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":45,"./_descriptors":60,"./_ie8-dom-define":71,"./_to-primitive":115}],88:[function(require,module,exports){
var dP       = require('./_object-dp')
  , anObject = require('./_an-object')
  , getKeys  = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};
},{"./_an-object":45,"./_descriptors":60,"./_object-dp":87,"./_object-keys":95}],89:[function(require,module,exports){
var pIE            = require('./_object-pie')
  , createDesc     = require('./_property-desc')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , has            = require('./_has')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};
},{"./_descriptors":60,"./_has":68,"./_ie8-dom-define":71,"./_object-pie":96,"./_property-desc":99,"./_to-iobject":112,"./_to-primitive":115}],90:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject')
  , gOPN      = require('./_object-gopn').f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":91,"./_to-iobject":112}],91:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = require('./_object-keys-internal')
  , hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};
},{"./_enum-bug-keys":62,"./_object-keys-internal":94}],92:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;
},{}],93:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = require('./_has')
  , toObject    = require('./_to-object')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};
},{"./_has":68,"./_shared-key":105,"./_to-object":114}],94:[function(require,module,exports){
var has          = require('./_has')
  , toIObject    = require('./_to-iobject')
  , arrayIndexOf = require('./_array-includes')(false)
  , IE_PROTO     = require('./_shared-key')('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};
},{"./_array-includes":47,"./_has":68,"./_shared-key":105,"./_to-iobject":112}],95:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require('./_object-keys-internal')
  , enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
},{"./_enum-bug-keys":62,"./_object-keys-internal":94}],96:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;
},{}],97:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export')
  , core    = require('./_core')
  , fails   = require('./_fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./_core":56,"./_export":64,"./_fails":65}],98:[function(require,module,exports){
var $parseInt = require('./_global').parseInt
  , $trim     = require('./_string-trim').trim
  , ws        = require('./_string-ws')
  , hex       = /^[\-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix){
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;
},{"./_global":67,"./_string-trim":108,"./_string-ws":109}],99:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],100:[function(require,module,exports){
var hide = require('./_hide');
module.exports = function(target, src, safe){
  for(var key in src){
    if(safe && target[key])target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};
},{"./_hide":69}],101:[function(require,module,exports){
module.exports = require('./_hide');
},{"./_hide":69}],102:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object')
  , anObject = require('./_an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./_an-object":45,"./_ctx":58,"./_is-object":76,"./_object-gopd":89}],103:[function(require,module,exports){
'use strict';
var global      = require('./_global')
  , core        = require('./_core')
  , dP          = require('./_object-dp')
  , DESCRIPTORS = require('./_descriptors')
  , SPECIES     = require('./_wks')('species');

module.exports = function(KEY){
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./_core":56,"./_descriptors":60,"./_global":67,"./_object-dp":87,"./_wks":119}],104:[function(require,module,exports){
var def = require('./_object-dp').f
  , has = require('./_has')
  , TAG = require('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_has":68,"./_object-dp":87,"./_wks":119}],105:[function(require,module,exports){
var shared = require('./_shared')('keys')
  , uid    = require('./_uid');
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
},{"./_shared":106,"./_uid":116}],106:[function(require,module,exports){
var global = require('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":67}],107:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , defined   = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./_defined":59,"./_to-integer":111}],108:[function(require,module,exports){
var $export = require('./_export')
  , defined = require('./_defined')
  , fails   = require('./_fails')
  , spaces  = require('./_string-ws')
  , space   = '[' + spaces + ']'
  , non     = '\u200b\u0085'
  , ltrim   = RegExp('^' + space + space + '*')
  , rtrim   = RegExp(space + space + '*$');

var exporter = function(KEY, exec, ALIAS){
  var exp   = {};
  var FORCE = fails(function(){
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if(ALIAS)exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function(string, TYPE){
  string = String(defined(string));
  if(TYPE & 1)string = string.replace(ltrim, '');
  if(TYPE & 2)string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;
},{"./_defined":59,"./_export":64,"./_fails":65,"./_string-ws":109}],109:[function(require,module,exports){
module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';
},{}],110:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./_to-integer":111}],111:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],112:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject')
  , defined = require('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":59,"./_iobject":72}],113:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":111}],114:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":59}],115:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":76}],116:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],117:[function(require,module,exports){
var global         = require('./_global')
  , core           = require('./_core')
  , LIBRARY        = require('./_library')
  , wksExt         = require('./_wks-ext')
  , defineProperty = require('./_object-dp').f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};
},{"./_core":56,"./_global":67,"./_library":84,"./_object-dp":87,"./_wks-ext":118}],118:[function(require,module,exports){
exports.f = require('./_wks');
},{"./_wks":119}],119:[function(require,module,exports){
var store      = require('./_shared')('wks')
  , uid        = require('./_uid')
  , Symbol     = require('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
},{"./_global":67,"./_shared":106,"./_uid":116}],120:[function(require,module,exports){
var classof   = require('./_classof')
  , ITERATOR  = require('./_wks')('iterator')
  , Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./_classof":51,"./_core":56,"./_iterators":82,"./_wks":119}],121:[function(require,module,exports){
var anObject = require('./_an-object')
  , get      = require('./core.get-iterator-method');
module.exports = require('./_core').getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};
},{"./_an-object":45,"./_core":56,"./core.get-iterator-method":120}],122:[function(require,module,exports){
var classof   = require('./_classof')
  , ITERATOR  = require('./_wks')('iterator')
  , Iterators = require('./_iterators');
module.exports = require('./_core').isIterable = function(it){
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    || Iterators.hasOwnProperty(classof(O));
};
},{"./_classof":51,"./_core":56,"./_iterators":82,"./_wks":119}],123:[function(require,module,exports){
'use strict';
var ctx            = require('./_ctx')
  , $export        = require('./_export')
  , toObject       = require('./_to-object')
  , call           = require('./_iter-call')
  , isArrayIter    = require('./_is-array-iter')
  , toLength       = require('./_to-length')
  , createProperty = require('./_create-property')
  , getIterFn      = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":57,"./_ctx":58,"./_export":64,"./_is-array-iter":73,"./_iter-call":77,"./_iter-detect":80,"./_to-length":113,"./_to-object":114,"./core.get-iterator-method":120}],124:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables')
  , step             = require('./_iter-step')
  , Iterators        = require('./_iterators')
  , toIObject        = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./_add-to-unscopables":43,"./_iter-define":79,"./_iter-step":81,"./_iterators":82,"./_to-iobject":112}],125:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');

// 23.1 Map Objects
module.exports = require('./_collection')('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./_collection":55,"./_collection-strong":53}],126:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', {isInteger: require('./_is-integer')});
},{"./_export":64,"./_is-integer":75}],127:[function(require,module,exports){
var $export   = require('./_export')
  , $parseInt = require('./_parse-int');
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', {parseInt: $parseInt});
},{"./_export":64,"./_parse-int":98}],128:[function(require,module,exports){
var $export = require('./_export')
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: require('./_object-create')});
},{"./_export":64,"./_object-create":86}],129:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperty: require('./_object-dp').f});
},{"./_descriptors":60,"./_export":64,"./_object-dp":87}],130:[function(require,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = require('./_is-object')
  , meta     = require('./_meta').onFreeze;

require('./_object-sap')('freeze', function($freeze){
  return function freeze(it){
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});
},{"./_is-object":76,"./_meta":85,"./_object-sap":97}],131:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = require('./_to-object')
  , $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});
},{"./_object-gpo":93,"./_object-sap":97,"./_to-object":114}],132:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', {setPrototypeOf: require('./_set-proto').set});
},{"./_export":64,"./_set-proto":102}],133:[function(require,module,exports){

},{}],134:[function(require,module,exports){
'use strict';
var $at  = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./_iter-define":79,"./_string-at":107}],135:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global         = require('./_global')
  , has            = require('./_has')
  , DESCRIPTORS    = require('./_descriptors')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , META           = require('./_meta').KEY
  , $fails         = require('./_fails')
  , shared         = require('./_shared')
  , setToStringTag = require('./_set-to-string-tag')
  , uid            = require('./_uid')
  , wks            = require('./_wks')
  , wksExt         = require('./_wks-ext')
  , wksDefine      = require('./_wks-define')
  , keyOf          = require('./_keyof')
  , enumKeys       = require('./_enum-keys')
  , isArray        = require('./_is-array')
  , anObject       = require('./_an-object')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , createDesc     = require('./_property-desc')
  , _create        = require('./_object-create')
  , gOPNExt        = require('./_object-gopn-ext')
  , $GOPD          = require('./_object-gopd')
  , $DP            = require('./_object-dp')
  , $keys          = require('./_object-keys')
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f  = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require('./_library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./_an-object":45,"./_descriptors":60,"./_enum-keys":63,"./_export":64,"./_fails":65,"./_global":67,"./_has":68,"./_hide":69,"./_is-array":74,"./_keyof":83,"./_library":84,"./_meta":85,"./_object-create":86,"./_object-dp":87,"./_object-gopd":89,"./_object-gopn":91,"./_object-gopn-ext":90,"./_object-gops":92,"./_object-keys":95,"./_object-pie":96,"./_property-desc":99,"./_redefine":101,"./_set-to-string-tag":104,"./_shared":106,"./_to-iobject":112,"./_to-primitive":115,"./_uid":116,"./_wks":119,"./_wks-define":117,"./_wks-ext":118}],136:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./_export');

$export($export.P + $export.R, 'Map', {toJSON: require('./_collection-to-json')('Map')});
},{"./_collection-to-json":54,"./_export":64}],137:[function(require,module,exports){
require('./_wks-define')('asyncIterator');
},{"./_wks-define":117}],138:[function(require,module,exports){
require('./_wks-define')('observable');
},{"./_wks-define":117}],139:[function(require,module,exports){
require('./es6.array.iterator');
var global        = require('./_global')
  , hide          = require('./_hide')
  , Iterators     = require('./_iterators')
  , TO_STRING_TAG = require('./_wks')('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}
},{"./_global":67,"./_hide":69,"./_iterators":82,"./_wks":119,"./es6.array.iterator":124}],140:[function(require,module,exports){
(function (global){
// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g =
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this;

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = require("./runtime");

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./runtime":141}],141:[function(require,module,exports){
(function (global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});