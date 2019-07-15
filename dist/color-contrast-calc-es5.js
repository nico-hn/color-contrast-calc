(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ColorContrastCalc = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

module.exports = require("./lib/color-contrast-calc");

},{"./lib/color-contrast-calc":2}],2:[function(require,module,exports){
"use strict";
/** @private */

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _reverse = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reverse"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _map2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

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


var ColorContrastCalc =
/*#__PURE__*/
function () {
  function ColorContrastCalc() {
    (0, _classCallCheck2["default"])(this, ColorContrastCalc);
  }

  (0, _createClass2["default"])(ColorContrastCalc, null, [{
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
      var _context;

      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "AA";
      var ratio = Checker.levelToRatio(level);
      return (0, _filter["default"])(_context = this.NAMED_COLORS).call(_context, function (combinedColor) {
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
      var _context2;

      var colorOrder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "rgb";
      var keyMapper = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var mode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "auto";
      return (0, _sort["default"])(_context2 = this.Sorter).call(_context2, colors, colorOrder, keyMapper, mode);
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
      (0, _freeze["default"])(this);
    }
  }]);
  return ColorContrastCalc;
}();

Color.calc = ColorContrastCalc;

(function () {
  var Sorter =
  /*#__PURE__*/
  function () {
    function Sorter() {
      (0, _classCallCheck2["default"])(this, Sorter);
    }

    (0, _createClass2["default"])(Sorter, null, [{
      key: "sort",
      value: function sort(colors) {
        var _context3;

        var colorOrder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "rgb";
        var keyMapper = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var mode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "auto";
        var keyType = this.guessKeyType(mode, colors[0], keyMapper);
        var compare = this.compareFunction(colorOrder, keyType, keyMapper);
        return (0, _sort["default"])(_context3 = (0, _slice["default"])(colors).call(colors)).call(_context3, compare);
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
        } else if (this.isComponentType(mode) || (0, _isArray["default"])(color)) {
          return this.KEY_TYPE.COMPONENTS;
        } else {
          return this.KEY_TYPE.COLOR;
        }
      }
    }, {
      key: "isComponentType",
      value: function isComponentType(keyType) {
        var _context4;

        return (0, _includes["default"])(_context4 = [this.KEY_TYPE.RGB, this.KEY_TYPE.HSL, this.KEY_TYPE.COMPONENTS]).call(_context4, keyType);
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
        var componentsCache = new _map2["default"]();
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
          for (var _iterator = (0, _getIterator2["default"])(order.pos), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
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
        var _context5,
            _this = this;

        return (0, _map["default"])(_context5 = colorOrder.toLowerCase().split("")).call(_context5, function (primary) {
          var _context6;

          return (0, _indexOf["default"])(_context6 = _this.RGB_IDENTIFIERS).call(_context6, primary);
        });
      }
    }, {
      key: "hslComponentPos",
      value: function hslComponentPos(hslOrder) {
        var _context7,
            _this2 = this;

        return (0, _map["default"])(_context7 = hslOrder.toLowerCase().split("")).call(_context7, function (component) {
          var _context8;

          return (0, _indexOf["default"])(_context8 = _this2.HSL_IDENTIFIERS).call(_context8, component);
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
        var _context9,
            _context10,
            _this3 = this;

        var primaryColors = (0, _reverse["default"])(_context9 = (0, _sort["default"])(_context10 = colorOrder.split("")).call(_context10, this.caseInsensitiveComp)).call(_context9);
        return (0, _map["default"])(primaryColors).call(primaryColors, function (primary) {
          if (Utils.isUpperCase(primary)) {
            return _this3.descendComp;
          }

          return _this3.ascendComp;
        });
      }
    }, {
      key: "chooseHslCompFunc",
      value: function chooseHslCompFunc(hslOrder) {
        var _context11,
            _this4 = this;

        return (0, _map["default"])(_context11 = this.HSL_RES).call(_context11, function (re) {
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

},{"./color":5,"./color-utils":4,"./contrast-checker":6,"@babel/runtime-corejs3/core-js-stable/array/is-array":8,"@babel/runtime-corejs3/core-js-stable/instance/filter":11,"@babel/runtime-corejs3/core-js-stable/instance/includes":14,"@babel/runtime-corejs3/core-js-stable/instance/index-of":15,"@babel/runtime-corejs3/core-js-stable/instance/map":16,"@babel/runtime-corejs3/core-js-stable/instance/reverse":19,"@babel/runtime-corejs3/core-js-stable/instance/slice":20,"@babel/runtime-corejs3/core-js-stable/instance/sort":21,"@babel/runtime-corejs3/core-js-stable/map":23,"@babel/runtime-corejs3/core-js-stable/object/freeze":26,"@babel/runtime-corejs3/core-js/get-iterator":29,"@babel/runtime-corejs3/helpers/classCallCheck":40,"@babel/runtime-corejs3/helpers/createClass":41,"@babel/runtime-corejs3/helpers/interopRequireDefault":44}],3:[function(require,module,exports){
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

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _isInteger = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/number/is-integer"));

var _every = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/every"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));

var _repeat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/repeat"));

var _startsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/starts-with"));

var _parseInt = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/number/parse-int"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var ColorUtils =
/*#__PURE__*/
function () {
  function ColorUtils() {
    (0, _classCallCheck2["default"])(this, ColorUtils);
  }

  (0, _createClass2["default"])(ColorUtils, null, [{
    key: "hexCodeToRgb",

    /**
     * Converts a hex color code string to a decimal representation
     * @param {string} hexCode - Hex color code such as "#ffff00"
     * @returns {Array<number, number, number>} RGB value represented as
     *     an array of numbers
     */
    value: function hexCodeToRgb(hexCode) {
      var _context, _context2;

      var h = this.normalizeHexCode(hexCode, false);
      return (0, _map["default"])(_context = (0, _map["default"])(_context2 = [0, 2, 4]).call(_context2, function (s) {
        return h.substr(s, 2);
      })).call(_context, function (primaryColor) {
        return (0, _parseInt["default"])(primaryColor, 16);
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
      var h = (0, _startsWith["default"])(hl).call(hl, "#") ? hl.replace("#", "") : hl;
      var hexPart = h;

      if (h.length === 3) {
        var _context3;

        hexPart = (0, _map["default"])(_context3 = [0, 1, 2]).call(_context3, function (s) {
          var _context4;

          return (0, _repeat["default"])(_context4 = h.substr(s, 1)).call(_context4, 2);
        }).join("");
      }

      return prefix ? "#".concat(hexPart) : hexPart;
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
      return "#" + (0, _map["default"])(rgb).call(rgb, function (d) {
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
      var _context5;

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
      return (0, _map["default"])(_context5 = [r, g, b]).call(_context5, function (c) {
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
      return (Math.max.apply(Math, (0, _toConsumableArray2["default"])(rgb)) + Math.min.apply(Math, (0, _toConsumableArray2["default"])(rgb))) / 510;
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
      var max = Math.max.apply(Math, (0, _toConsumableArray2["default"])(rgb));
      var min = Math.min.apply(Math, (0, _toConsumableArray2["default"])(rgb));

      if (max === min) {
        return 0;
      }
      /* you can return whatever you like */


      var d = max - min;
      var mi = (0, _reduce["default"])(rgb).call(rgb, function (m, v, i) {
        return rgb[m] > v ? m : i;
      }, 0);
      /* maxIndex */

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
      var max = Math.max.apply(Math, (0, _toConsumableArray2["default"])(rgb));
      var min = Math.min.apply(Math, (0, _toConsumableArray2["default"])(rgb));
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
      return rgb.length === 3 && (0, _every["default"])(rgb).call(rgb, function (c) {
        return c >= 0 && c <= 255 && (0, _isInteger["default"])(c);
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
      return hsl.length === 3 && (0, _every["default"])(hsl).call(hsl, function (c, i) {
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

      return (0, _every["default"])(rgb1).call(rgb1, function (primaryColor, i) {
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
        return (0, _map["default"])(values).call(values, function (val) {
          return ColorUtils.clampToRange(Math.round(func(val)), 0, 255);
        });
      } else {
        return (0, _map["default"])(values).call(values, function (val) {
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
  var Matrix =
  /*#__PURE__*/
  function () {
    function Matrix(matrix) {
      (0, _classCallCheck2["default"])(this, Matrix);
      this.matrix = matrix;
    }

    (0, _createClass2["default"])(Matrix, [{
      key: "add",
      value: function add(otherMatrix) {
        var _context6;

        var newMatrix = (0, _map["default"])(_context6 = this.matrix).call(_context6, function (row, i) {
          var otherRow = otherMatrix.matrix[i];
          return (0, _map["default"])(row).call(row, function (s, j) {
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
        var _context7;

        var newMatrix = (0, _map["default"])(_context7 = this.matrix).call(_context7, function (row) {
          return (0, _map["default"])(row).call(row, function (c) {
            return c * n;
          });
        });
        return new Matrix(newMatrix);
      }
    }, {
      key: "productByVector",
      value: function productByVector(vector) {
        var _context8;

        return (0, _map["default"])(_context8 = this.matrix).call(_context8, function (row) {
          return (0, _reduce["default"])(row).call(row, function (s, c, i) {
            return s += c * vector[i];
          }, 0);
        });
      }
    }]);
    return Matrix;
  }();

  ColorUtils.Matrix = Matrix;
  var rgbMap = ColorUtils.rgbMap;

  var ContrastCalc =
  /*#__PURE__*/
  function () {
    function ContrastCalc() {
      (0, _classCallCheck2["default"])(this, ContrastCalc);
    }

    (0, _createClass2["default"])(ContrastCalc, null, [{
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

  var BrightnessCalc =
  /*#__PURE__*/
  function () {
    function BrightnessCalc() {
      (0, _classCallCheck2["default"])(this, BrightnessCalc);
    }

    (0, _createClass2["default"])(BrightnessCalc, null, [{
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

  var InvertCalc =
  /*#__PURE__*/
  function () {
    function InvertCalc() {
      (0, _classCallCheck2["default"])(this, InvertCalc);
    }

    (0, _createClass2["default"])(InvertCalc, null, [{
      key: "calcRgb",

      /*
        https://www.w3.org/TR/filter-effects/#funcdef-invert
        https://www.w3.org/TR/filter-effects-1/#invertEquivalent
        https://www.w3.org/TR/SVG/filters.html#TransferFunctionElementAttributes
      */
      value: function calcRgb(rgb, ratio) {
        return (0, _map["default"])(rgb).call(rgb, function (c) {
          return Math.round((100 * c - 2 * c * ratio + 255 * ratio) / 100);
        });
      }
    }]);
    return InvertCalc;
  }();

  ColorUtils.InvertCalc = InvertCalc;

  var HueRotateCalc =
  /*#__PURE__*/
  function () {
    function HueRotateCalc() {
      (0, _classCallCheck2["default"])(this, HueRotateCalc);
    }

    (0, _createClass2["default"])(HueRotateCalc, null, [{
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

  var SaturateCalc =
  /*#__PURE__*/
  function () {
    function SaturateCalc() {
      (0, _classCallCheck2["default"])(this, SaturateCalc);
    }

    (0, _createClass2["default"])(SaturateCalc, null, [{
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

  var GrayscaleCalc =
  /*#__PURE__*/
  function () {
    function GrayscaleCalc() {
      (0, _classCallCheck2["default"])(this, GrayscaleCalc);
    }

    (0, _createClass2["default"])(GrayscaleCalc, null, [{
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
  (0, _freeze["default"])(ColorUtils.RGB);
})();

ColorUtils.setup();
module.exports.ColorUtils = ColorUtils;

},{"@babel/runtime-corejs3/core-js-stable/instance/every":10,"@babel/runtime-corejs3/core-js-stable/instance/map":16,"@babel/runtime-corejs3/core-js-stable/instance/reduce":17,"@babel/runtime-corejs3/core-js-stable/instance/repeat":18,"@babel/runtime-corejs3/core-js-stable/instance/starts-with":22,"@babel/runtime-corejs3/core-js-stable/number/is-integer":24,"@babel/runtime-corejs3/core-js-stable/number/parse-int":25,"@babel/runtime-corejs3/core-js-stable/object/freeze":26,"@babel/runtime-corejs3/helpers/classCallCheck":40,"@babel/runtime-corejs3/helpers/createClass":41,"@babel/runtime-corejs3/helpers/interopRequireDefault":44,"@babel/runtime-corejs3/helpers/toConsumableArray":52}],5:[function(require,module,exports){
"use strict";
/** @private */

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _map2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

var _every = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/every"));

var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

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


var Color =
/*#__PURE__*/
function () {
  (0, _createClass2["default"])(Color, null, [{
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
    (0, _classCallCheck2["default"])(this, Color);

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


  (0, _createClass2["default"])(Color, [{
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
     * Return a new instance of Color with adjusted contrast.
     * @param {number} ratio - Value in percent
     * @param {string} [name=null] - Name of color
     * @returns {Color}
     */

  }, {
    key: "withContrast",
    value: function withContrast(ratio) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return this.generateNewColor(Utils.ContrastCalc, ratio, name);
    }
    /**
     * Return a new instance of Color with adjusted brightness.
     * @param {number} ratio - Value in percent
     * @param {string} [name=null] - Name of color
     * @returns {Color}
     */

  }, {
    key: "withBrightness",
    value: function withBrightness(ratio) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return this.generateNewColor(Utils.BrightnessCalc, ratio, name);
    }
    /**
     * Return an inverted color as an instance of Color.
     * @param {number} [ratio=100] - Value in percent
     * @param {string} [name=null] - Name of color
     * @returns {Color}
     */

  }, {
    key: "withInvert",
    value: function withInvert() {
      var ratio = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return this.generateNewColor(Utils.InvertCalc, ratio, name);
    }
    /**
     * Return a hue rotation applied color as an instance of Color.
     * @param {number} degree - Value in degree
     * @param {string} [name=null] - Name of color
     * @returns {Color}
     */

  }, {
    key: "withHueRotate",
    value: function withHueRotate(degree) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return this.generateNewColor(Utils.HueRotateCalc, degree, name);
    }
    /**
     * Return a saturated color as an instance of Color.
     * @param {number} ratio - Value in percent
     * @param {string} [name=null] - Name of color
     * @returns {Color}
     */

  }, {
    key: "withSaturate",
    value: function withSaturate(ratio) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return this.generateNewColor(Utils.SaturateCalc, ratio, name);
    }
    /**
     * Return a grayscale of the original color.
     * @param {number} [ratio=100] - Conversion ratio in percentage
     * @param {string} [name=null] - Name of color
     * @returns {Color}
     */

  }, {
    key: "withGrayscale",
    value: function withGrayscale() {
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
      return new Color((0, _find["default"])(BrightnessFinder).call(BrightnessFinder, this.rgb, otherColor.rgb, level));
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
      var newRgb = (0, _find["default"])(LightnessFinder).call(LightnessFinder, this.rgb, otherColor.rgb, level);
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
      var _context;

      var limits = [0, 255];
      return (0, _every["default"])(_context = this.rgb).call(_context, function (primaryColor) {
        return (0, _includes["default"])(limits).call(limits, primaryColor);
      });
    }
    /**
     * @returns {boolean} true if the hex code of the color is #808080
     */

  }, {
    key: "isMinContrast",
    value: function isMinContrast() {
      var _context2,
          _this = this;

      return (0, _every["default"])(_context2 = this.rgb).call(_context2, function (primaryColor, i) {
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
          return "rgb(".concat(this.rgb.join(","), ")");

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
      (0, _freeze["default"])(this.rgb);
      (0, _freeze["default"])(this.relativeLuminance);
      (0, _freeze["default"])(this.name);
      (0, _freeze["default"])(this.hexCode);
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

var List =
/*#__PURE__*/
function () {
  function List() {
    (0, _classCallCheck2["default"])(this, List);
  }

  (0, _createClass2["default"])(List, null, [{
    key: "setup",

    /**
     * @private
     */
    value: function setup(colorKeywordsJSON) {
      this.loadColorKeywords(colorKeywordsJSON);
      this.generateWebSafeColors();
      (0, _freeze["default"])(this);
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

      this.NAME_TO_COLOR = new _map2["default"]();
      /** @private */

      this.HEX_TO_COLOR = new _map2["default"]();
      (0, _forEach["default"])(colorKeywordsJSON).call(colorKeywordsJSON, function (keyword) {
        var _keyword = (0, _slicedToArray2["default"])(keyword, 2),
            name = _keyword[0],
            hex = _keyword[1];

        var color = new Color(hex, name);

        _this2.NAMED_COLORS.push(color);

        _this2.NAME_TO_COLOR.set(name, color);

        _this2.HEX_TO_COLOR.set(hex, color);
      });
      (0, _freeze["default"])(this.NAMED_COLORS);
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
            var _context3;

            var hexCode = Utils.rgbToHexCode((0, _map["default"])(_context3 = [r, g, b]).call(_context3, function (c) {
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

},{"./color-keywords.json":3,"./color-utils":4,"./contrast-checker":6,"./threshold-finder":7,"@babel/runtime-corejs3/core-js-stable/instance/every":10,"@babel/runtime-corejs3/core-js-stable/instance/find":12,"@babel/runtime-corejs3/core-js-stable/instance/for-each":13,"@babel/runtime-corejs3/core-js-stable/instance/includes":14,"@babel/runtime-corejs3/core-js-stable/instance/map":16,"@babel/runtime-corejs3/core-js-stable/map":23,"@babel/runtime-corejs3/core-js-stable/object/freeze":26,"@babel/runtime-corejs3/helpers/classCallCheck":40,"@babel/runtime-corejs3/helpers/createClass":41,"@babel/runtime-corejs3/helpers/interopRequireDefault":44,"@babel/runtime-corejs3/helpers/slicedToArray":51}],6:[function(require,module,exports){
"use strict";
/** @private */

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _sort3 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

var _map3 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var Utils = require("./color-utils").ColorUtils;
/**
 * Collection of functions that check properties of given colors
 */


var ContrastChecker =
/*#__PURE__*/
function () {
  function ContrastChecker() {
    (0, _classCallCheck2["default"])(this, ContrastChecker);
  }

  (0, _createClass2["default"])(ContrastChecker, null, [{
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

      var _rgb$map = (0, _map3["default"])(rgb).call(rgb, function (c) {
        return _this.tristimulusValue(c);
      }),
          _rgb$map2 = (0, _slicedToArray2["default"])(_rgb$map, 3),
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
      var _context,
          _this2 = this;

      /*
        https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
      */
      var _map = (0, _map3["default"])(_context = [foreground, background]).call(_context, function (c) {
        return _this2.relativeLuminance(c);
      }),
          _map2 = (0, _slicedToArray2["default"])(_map, 2),
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
      var _context2;

      var _sort = (0, _sort3["default"])(_context2 = [luminance1, luminance2]).call(_context2, function (f, s) {
        return s - f;
      }),
          _sort2 = (0, _slicedToArray2["default"])(_sort, 2),
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
(0, _freeze["default"])(ContrastChecker.LUMINANCE);
module.exports.ContrastChecker = ContrastChecker;

},{"./color-utils":4,"@babel/runtime-corejs3/core-js-stable/instance/map":16,"@babel/runtime-corejs3/core-js-stable/instance/sort":21,"@babel/runtime-corejs3/core-js-stable/object/freeze":26,"@babel/runtime-corejs3/helpers/classCallCheck":40,"@babel/runtime-corejs3/helpers/createClass":41,"@babel/runtime-corejs3/helpers/interopRequireDefault":44,"@babel/runtime-corejs3/helpers/slicedToArray":51}],7:[function(require,module,exports){
"use strict";
/** @private */

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var Utils = require("./color-utils").ColorUtils;
/** @private */


var Checker = require("./contrast-checker").ContrastChecker;
/** @private */


var SearchCriteria =
/*#__PURE__*/
function () {
  (0, _createClass2["default"])(SearchCriteria, null, [{
    key: "shouldScanDarkerSide",
    value: function shouldScanDarkerSide(fixedRgb, otherRgb) {
      var fixedLuminance = Checker.relativeLuminance(fixedRgb);
      var otherLuminance = Checker.relativeLuminance(otherRgb);
      return fixedLuminance > otherLuminance || fixedLuminance === otherLuminance && Checker.isLightColor(fixedRgb);
    }
  }, {
    key: "define",
    value: function define(fixedRgb, otherRgb, level) {
      var targetContrast = Checker.levelToRatio(level);

      if (this.shouldScanDarkerSide(fixedRgb, otherRgb)) {
        return new ToDarkerSide(targetContrast, fixedRgb);
      } else {
        return new ToBrighterSide(targetContrast, fixedRgb);
      }
    }
  }]);

  function SearchCriteria(targetContrast, fixedRgb) {
    (0, _classCallCheck2["default"])(this, SearchCriteria);
    this.targetContrast = targetContrast;
    this.fixedLuminance = Checker.relativeLuminance(fixedRgb);
  }

  (0, _createClass2["default"])(SearchCriteria, [{
    key: "hasSufficientContrast",
    value: function hasSufficientContrast(rgb) {
      return this.contrastRatio(rgb) >= this.targetContrast;
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


var ToDarkerSide =
/*#__PURE__*/
function (_SearchCriteria) {
  (0, _inherits2["default"])(ToDarkerSide, _SearchCriteria);

  function ToDarkerSide() {
    (0, _classCallCheck2["default"])(this, ToDarkerSide);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ToDarkerSide).apply(this, arguments));
  }

  (0, _createClass2["default"])(ToDarkerSide, [{
    key: "round",
    value: function round(ratio) {
      return Math.floor(ratio * 10) / 10;
    }
  }, {
    key: "incrementCondition",
    value: function incrementCondition(contrastRatio) {
      return contrastRatio > this.targetContrast;
    }
  }]);
  return ToDarkerSide;
}(SearchCriteria);
/** @private */


var ToBrighterSide =
/*#__PURE__*/
function (_SearchCriteria2) {
  (0, _inherits2["default"])(ToBrighterSide, _SearchCriteria2);

  function ToBrighterSide() {
    (0, _classCallCheck2["default"])(this, ToBrighterSide);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ToBrighterSide).apply(this, arguments));
  }

  (0, _createClass2["default"])(ToBrighterSide, [{
    key: "round",
    value: function round(ratio) {
      return Math.ceil(ratio * 10) / 10;
    }
  }, {
    key: "incrementCondition",
    value: function incrementCondition(contrastRatio) {
      return this.targetContrast > contrastRatio;
    }
  }]);
  return ToBrighterSide;
}(SearchCriteria);
/** @private */


var ThresholdFinder =
/*#__PURE__*/
function () {
  function ThresholdFinder() {
    (0, _classCallCheck2["default"])(this, ThresholdFinder);
  }

  (0, _createClass2["default"])(ThresholdFinder, null, [{
    key: "binarySearchWidth",

    /** @private */
    value:
    /*#__PURE__*/
    _regenerator["default"].mark(function binarySearchWidth(initWidth, min) {
      var i, d;
      return _regenerator["default"].wrap(function binarySearchWidth$(_context) {
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
      }, binarySearchWidth);
    })
    /**
     * @private
     */

  }, {
    key: "findRatio",
    value: function findRatio(otherColor, criteria, initRatio, initWidth) {
      var r = initRatio;
      var passingRatio = null;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator2["default"])(this.binarySearchWidth(initWidth, 0.01)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var d = _step.value;
          var newRgb = this.rgbWithRatio(otherColor, r);
          var contrast = criteria.contrastRatio(newRgb);

          if (criteria.hasSufficientContrast(newRgb)) {
            passingRatio = r;
          }

          if (contrast === criteria.targetContrast) {
            break;
          }

          r += criteria.incrementCondition(contrast) ? d : -d;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return [r, passingRatio];
    }
    /**
     * @private
     */

  }, {
    key: "rgbWithBetterRatio",
    value: function rgbWithBetterRatio(color, criteria, lastRatio, passingRatio) {
      var closestRgb = this.rgbWithRatio(color, lastRatio);

      if (passingRatio && !criteria.hasSufficientContrast(closestRgb)) {
        return this.rgbWithRatio(color, passingRatio);
      }

      return closestRgb;
    }
  }]);
  return ThresholdFinder;
}();
/** @private */


var LightnessFinder =
/*#__PURE__*/
function (_ThresholdFinder) {
  (0, _inherits2["default"])(LightnessFinder, _ThresholdFinder);

  function LightnessFinder() {
    (0, _classCallCheck2["default"])(this, LightnessFinder);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(LightnessFinder).apply(this, arguments));
  }

  (0, _createClass2["default"])(LightnessFinder, null, [{
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

      var _this$determineMinmax = this.determineMinmax(fixedRgb, otherRgb, otherHsl[2]),
          _this$determineMinmax2 = (0, _slicedToArray2["default"])(_this$determineMinmax, 2),
          max = _this$determineMinmax2[0],
          min = _this$determineMinmax2[1];

      var boundaryRgb = this.boundaryColor(fixedRgb, max, min, criteria);

      if (boundaryRgb) {
        return boundaryRgb;
      }

      var _this$findRatio = this.findRatio(otherHsl, criteria, (max + min) / 2, max - min),
          _this$findRatio2 = (0, _slicedToArray2["default"])(_this$findRatio, 2),
          r = _this$findRatio2[0],
          passingRatio = _this$findRatio2[1];

      return this.rgbWithBetterRatio(otherHsl, criteria, r, passingRatio);
    }
    /**
     * @private
     */

  }, {
    key: "rgbWithRatio",
    value: function rgbWithRatio(hsl, ratio) {
      if (ratio !== undefined && hsl[2] !== ratio) {
        hsl = (0, _slice["default"])(hsl).call(hsl, 0);
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
    value: function hasSufficientContrast(refLuminance, rgb, criteria) {
      var luminance = Checker.relativeLuminance(rgb);
      var ratio = Checker.luminanceToContrastRatio(refLuminance, luminance);
      return ratio >= criteria.targetContrast;
    }
  }]);
  return LightnessFinder;
}(ThresholdFinder);
/** @private */


var BrightnessFinder =
/*#__PURE__*/
function (_ThresholdFinder2) {
  (0, _inherits2["default"])(BrightnessFinder, _ThresholdFinder2);

  function BrightnessFinder() {
    (0, _classCallCheck2["default"])(this, BrightnessFinder);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(BrightnessFinder).apply(this, arguments));
  }

  (0, _createClass2["default"])(BrightnessFinder, null, [{
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
      var _context2, _context3;

      var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "AA";
      var criteria = SearchCriteria.define(fixedRgb, otherRgb, level);
      var w = this.calcUpperRatioLimit(otherRgb) / 2;
      var upperRgb = this.rgbWithRatio(otherRgb, w * 2);

      if (this.exceedUpperLimit(criteria, otherRgb, upperRgb)) {
        return upperRgb;
      }

      var ratios = (0, _map["default"])(_context2 = this.findRatio(otherRgb, criteria, w, w)).call(_context2, criteria.round);
      return this.rgbWithBetterRatio.apply(this, (0, _concat["default"])(_context3 = [otherRgb, criteria]).call(_context3, (0, _toConsumableArray2["default"])(ratios)));
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
      var _context4;

      if (Utils.isSameRgbColor(Utils.RGB.BLACK, rgb)) {
        return 100;
      }

      var darkest = (0, _reduce["default"])(_context4 = (0, _filter["default"])(rgb).call(rgb, function (c) {
        return c !== 0;
      })).call(_context4, function (a, b) {
        return Math.min(a, b);
      });
      return Math.ceil(255 / darkest * 100);
    }
  }]);
  return BrightnessFinder;
}(ThresholdFinder);

module.exports.LightnessFinder = LightnessFinder;
module.exports.BrightnessFinder = BrightnessFinder;

},{"./color-utils":4,"./contrast-checker":6,"@babel/runtime-corejs3/core-js-stable/instance/concat":9,"@babel/runtime-corejs3/core-js-stable/instance/filter":11,"@babel/runtime-corejs3/core-js-stable/instance/map":16,"@babel/runtime-corejs3/core-js-stable/instance/reduce":17,"@babel/runtime-corejs3/core-js-stable/instance/slice":20,"@babel/runtime-corejs3/core-js/get-iterator":29,"@babel/runtime-corejs3/helpers/classCallCheck":40,"@babel/runtime-corejs3/helpers/createClass":41,"@babel/runtime-corejs3/helpers/getPrototypeOf":42,"@babel/runtime-corejs3/helpers/inherits":43,"@babel/runtime-corejs3/helpers/interopRequireDefault":44,"@babel/runtime-corejs3/helpers/possibleConstructorReturn":49,"@babel/runtime-corejs3/helpers/slicedToArray":51,"@babel/runtime-corejs3/helpers/toConsumableArray":52,"@babel/runtime-corejs3/regenerator":54}],8:[function(require,module,exports){
module.exports = require("core-js-pure/stable/array/is-array");
},{"core-js-pure/stable/array/is-array":253}],9:[function(require,module,exports){
module.exports = require("core-js-pure/stable/instance/concat");
},{"core-js-pure/stable/instance/concat":255}],10:[function(require,module,exports){
module.exports = require("core-js-pure/stable/instance/every");
},{"core-js-pure/stable/instance/every":256}],11:[function(require,module,exports){
module.exports = require("core-js-pure/stable/instance/filter");
},{"core-js-pure/stable/instance/filter":257}],12:[function(require,module,exports){
module.exports = require("core-js-pure/stable/instance/find");
},{"core-js-pure/stable/instance/find":258}],13:[function(require,module,exports){
module.exports = require("core-js-pure/stable/instance/for-each");
},{"core-js-pure/stable/instance/for-each":259}],14:[function(require,module,exports){
module.exports = require("core-js-pure/stable/instance/includes");
},{"core-js-pure/stable/instance/includes":260}],15:[function(require,module,exports){
module.exports = require("core-js-pure/stable/instance/index-of");
},{"core-js-pure/stable/instance/index-of":261}],16:[function(require,module,exports){
module.exports = require("core-js-pure/stable/instance/map");
},{"core-js-pure/stable/instance/map":262}],17:[function(require,module,exports){
module.exports = require("core-js-pure/stable/instance/reduce");
},{"core-js-pure/stable/instance/reduce":263}],18:[function(require,module,exports){
module.exports = require("core-js-pure/stable/instance/repeat");
},{"core-js-pure/stable/instance/repeat":264}],19:[function(require,module,exports){
module.exports = require("core-js-pure/stable/instance/reverse");
},{"core-js-pure/stable/instance/reverse":265}],20:[function(require,module,exports){
module.exports = require("core-js-pure/stable/instance/slice");
},{"core-js-pure/stable/instance/slice":266}],21:[function(require,module,exports){
module.exports = require("core-js-pure/stable/instance/sort");
},{"core-js-pure/stable/instance/sort":267}],22:[function(require,module,exports){
module.exports = require("core-js-pure/stable/instance/starts-with");
},{"core-js-pure/stable/instance/starts-with":268}],23:[function(require,module,exports){
module.exports = require("core-js-pure/stable/map");
},{"core-js-pure/stable/map":269}],24:[function(require,module,exports){
module.exports = require("core-js-pure/stable/number/is-integer");
},{"core-js-pure/stable/number/is-integer":270}],25:[function(require,module,exports){
module.exports = require("core-js-pure/stable/number/parse-int");
},{"core-js-pure/stable/number/parse-int":271}],26:[function(require,module,exports){
module.exports = require("core-js-pure/stable/object/freeze");
},{"core-js-pure/stable/object/freeze":272}],27:[function(require,module,exports){
module.exports = require("core-js-pure/features/array/from");
},{"core-js-pure/features/array/from":95}],28:[function(require,module,exports){
module.exports = require("core-js-pure/features/array/is-array");
},{"core-js-pure/features/array/is-array":96}],29:[function(require,module,exports){
module.exports = require("core-js-pure/features/get-iterator");
},{"core-js-pure/features/get-iterator":97}],30:[function(require,module,exports){
module.exports = require("core-js-pure/features/is-iterable");
},{"core-js-pure/features/is-iterable":98}],31:[function(require,module,exports){
module.exports = require("core-js-pure/features/object/create");
},{"core-js-pure/features/object/create":99}],32:[function(require,module,exports){
module.exports = require("core-js-pure/features/object/define-property");
},{"core-js-pure/features/object/define-property":100}],33:[function(require,module,exports){
module.exports = require("core-js-pure/features/object/get-prototype-of");
},{"core-js-pure/features/object/get-prototype-of":101}],34:[function(require,module,exports){
module.exports = require("core-js-pure/features/object/set-prototype-of");
},{"core-js-pure/features/object/set-prototype-of":102}],35:[function(require,module,exports){
module.exports = require("core-js-pure/features/symbol");
},{"core-js-pure/features/symbol":103}],36:[function(require,module,exports){
module.exports = require("core-js-pure/features/symbol/iterator");
},{"core-js-pure/features/symbol/iterator":104}],37:[function(require,module,exports){
var _Array$isArray = require("../core-js/array/is-array");

function _arrayWithHoles(arr) {
  if (_Array$isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
},{"../core-js/array/is-array":28}],38:[function(require,module,exports){
var _Array$isArray = require("../core-js/array/is-array");

function _arrayWithoutHoles(arr) {
  if (_Array$isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

module.exports = _arrayWithoutHoles;
},{"../core-js/array/is-array":28}],39:[function(require,module,exports){
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;
},{}],40:[function(require,module,exports){
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],41:[function(require,module,exports){
var _Object$defineProperty = require("../core-js/object/define-property");

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;

    _Object$defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
},{"../core-js/object/define-property":32}],42:[function(require,module,exports){
var _Object$getPrototypeOf = require("../core-js/object/get-prototype-of");

var _Object$setPrototypeOf = require("../core-js/object/set-prototype-of");

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = _Object$setPrototypeOf ? _Object$getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || _Object$getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
},{"../core-js/object/get-prototype-of":33,"../core-js/object/set-prototype-of":34}],43:[function(require,module,exports){
var _Object$create = require("../core-js/object/create");

var setPrototypeOf = require("./setPrototypeOf");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = _Object$create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;
},{"../core-js/object/create":31,"./setPrototypeOf":50}],44:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
},{}],45:[function(require,module,exports){
var _Array$from = require("../core-js/array/from");

var _isIterable = require("../core-js/is-iterable");

function _iterableToArray(iter) {
  if (_isIterable(Object(iter)) || Object.prototype.toString.call(iter) === "[object Arguments]") return _Array$from(iter);
}

module.exports = _iterableToArray;
},{"../core-js/array/from":27,"../core-js/is-iterable":30}],46:[function(require,module,exports){
var _getIterator = require("../core-js/get-iterator");

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = _getIterator(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;
},{"../core-js/get-iterator":29}],47:[function(require,module,exports){
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

module.exports = _nonIterableRest;
},{}],48:[function(require,module,exports){
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

module.exports = _nonIterableSpread;
},{}],49:[function(require,module,exports){
var _typeof = require("../helpers/typeof");

var assertThisInitialized = require("./assertThisInitialized");

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;
},{"../helpers/typeof":53,"./assertThisInitialized":39}],50:[function(require,module,exports){
var _Object$setPrototypeOf = require("../core-js/object/set-prototype-of");

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = _Object$setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
},{"../core-js/object/set-prototype-of":34}],51:[function(require,module,exports){
var arrayWithHoles = require("./arrayWithHoles");

var iterableToArrayLimit = require("./iterableToArrayLimit");

var nonIterableRest = require("./nonIterableRest");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
},{"./arrayWithHoles":37,"./iterableToArrayLimit":46,"./nonIterableRest":47}],52:[function(require,module,exports){
var arrayWithoutHoles = require("./arrayWithoutHoles");

var iterableToArray = require("./iterableToArray");

var nonIterableSpread = require("./nonIterableSpread");

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;
},{"./arrayWithoutHoles":38,"./iterableToArray":45,"./nonIterableSpread":48}],53:[function(require,module,exports){
var _Symbol$iterator = require("../core-js/symbol/iterator");

var _Symbol = require("../core-js/symbol");

function _typeof2(obj) { if (typeof _Symbol === "function" && typeof _Symbol$iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof _Symbol === "function" && obj.constructor === _Symbol && obj !== _Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof _Symbol === "function" && _typeof2(_Symbol$iterator) === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof _Symbol === "function" && obj.constructor === _Symbol && obj !== _Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
},{"../core-js/symbol":35,"../core-js/symbol/iterator":36}],54:[function(require,module,exports){
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":273}],55:[function(require,module,exports){
require('../../modules/es.string.iterator');
require('../../modules/es.array.from');
var path = require('../../internals/path');

module.exports = path.Array.from;

},{"../../internals/path":180,"../../modules/es.array.from":208,"../../modules/es.string.iterator":230}],56:[function(require,module,exports){
require('../../modules/es.array.is-array');
var path = require('../../internals/path');

module.exports = path.Array.isArray;

},{"../../internals/path":180,"../../modules/es.array.is-array":211}],57:[function(require,module,exports){
require('../../../modules/es.array.concat');
var entryVirtual = require('../../../internals/entry-virtual');

module.exports = entryVirtual('Array').concat;

},{"../../../internals/entry-virtual":134,"../../../modules/es.array.concat":203}],58:[function(require,module,exports){
require('../../../modules/es.array.every');
var entryVirtual = require('../../../internals/entry-virtual');

module.exports = entryVirtual('Array').every;

},{"../../../internals/entry-virtual":134,"../../../modules/es.array.every":204}],59:[function(require,module,exports){
require('../../../modules/es.array.filter');
var entryVirtual = require('../../../internals/entry-virtual');

module.exports = entryVirtual('Array').filter;

},{"../../../internals/entry-virtual":134,"../../../modules/es.array.filter":205}],60:[function(require,module,exports){
require('../../../modules/es.array.find');
var entryVirtual = require('../../../internals/entry-virtual');

module.exports = entryVirtual('Array').find;

},{"../../../internals/entry-virtual":134,"../../../modules/es.array.find":206}],61:[function(require,module,exports){
require('../../../modules/es.array.for-each');
var entryVirtual = require('../../../internals/entry-virtual');

module.exports = entryVirtual('Array').forEach;

},{"../../../internals/entry-virtual":134,"../../../modules/es.array.for-each":207}],62:[function(require,module,exports){
require('../../../modules/es.array.includes');
var entryVirtual = require('../../../internals/entry-virtual');

module.exports = entryVirtual('Array').includes;

},{"../../../internals/entry-virtual":134,"../../../modules/es.array.includes":209}],63:[function(require,module,exports){
require('../../../modules/es.array.index-of');
var entryVirtual = require('../../../internals/entry-virtual');

module.exports = entryVirtual('Array').indexOf;

},{"../../../internals/entry-virtual":134,"../../../modules/es.array.index-of":210}],64:[function(require,module,exports){
require('../../../modules/es.array.map');
var entryVirtual = require('../../../internals/entry-virtual');

module.exports = entryVirtual('Array').map;

},{"../../../internals/entry-virtual":134,"../../../modules/es.array.map":213}],65:[function(require,module,exports){
require('../../../modules/es.array.reduce');
var entryVirtual = require('../../../internals/entry-virtual');

module.exports = entryVirtual('Array').reduce;

},{"../../../internals/entry-virtual":134,"../../../modules/es.array.reduce":214}],66:[function(require,module,exports){
require('../../../modules/es.array.reverse');
var entryVirtual = require('../../../internals/entry-virtual');

module.exports = entryVirtual('Array').reverse;

},{"../../../internals/entry-virtual":134,"../../../modules/es.array.reverse":215}],67:[function(require,module,exports){
require('../../../modules/es.array.slice');
var entryVirtual = require('../../../internals/entry-virtual');

module.exports = entryVirtual('Array').slice;

},{"../../../internals/entry-virtual":134,"../../../modules/es.array.slice":216}],68:[function(require,module,exports){
require('../../../modules/es.array.sort');
var entryVirtual = require('../../../internals/entry-virtual');

module.exports = entryVirtual('Array').sort;

},{"../../../internals/entry-virtual":134,"../../../modules/es.array.sort":217}],69:[function(require,module,exports){
var concat = require('../array/virtual/concat');

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.concat;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.concat) ? concat : own;
};

},{"../array/virtual/concat":57}],70:[function(require,module,exports){
var every = require('../array/virtual/every');

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.every;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.every) ? every : own;
};

},{"../array/virtual/every":58}],71:[function(require,module,exports){
var filter = require('../array/virtual/filter');

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.filter;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.filter) ? filter : own;
};

},{"../array/virtual/filter":59}],72:[function(require,module,exports){
var find = require('../array/virtual/find');

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.find;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.find) ? find : own;
};

},{"../array/virtual/find":60}],73:[function(require,module,exports){
var arrayIncludes = require('../array/virtual/includes');
var stringIncludes = require('../string/virtual/includes');

var ArrayPrototype = Array.prototype;
var StringPrototype = String.prototype;

module.exports = function (it) {
  var own = it.includes;
  if (it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.includes)) return arrayIncludes;
  if (typeof it === 'string' || it === StringPrototype || (it instanceof String && own === StringPrototype.includes)) {
    return stringIncludes;
  } return own;
};

},{"../array/virtual/includes":62,"../string/virtual/includes":90}],74:[function(require,module,exports){
var indexOf = require('../array/virtual/index-of');

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.indexOf;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.indexOf) ? indexOf : own;
};

},{"../array/virtual/index-of":63}],75:[function(require,module,exports){
var map = require('../array/virtual/map');

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.map;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.map) ? map : own;
};

},{"../array/virtual/map":64}],76:[function(require,module,exports){
var reduce = require('../array/virtual/reduce');

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.reduce;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.reduce) ? reduce : own;
};

},{"../array/virtual/reduce":65}],77:[function(require,module,exports){
var repeat = require('../string/virtual/repeat');

var StringPrototype = String.prototype;

module.exports = function (it) {
  var own = it.repeat;
  return typeof it === 'string' || it === StringPrototype
    || (it instanceof String && own === StringPrototype.repeat) ? repeat : own;
};

},{"../string/virtual/repeat":91}],78:[function(require,module,exports){
var reverse = require('../array/virtual/reverse');

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.reverse;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.reverse) ? reverse : own;
};

},{"../array/virtual/reverse":66}],79:[function(require,module,exports){
var slice = require('../array/virtual/slice');

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.slice;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.slice) ? slice : own;
};

},{"../array/virtual/slice":67}],80:[function(require,module,exports){
var sort = require('../array/virtual/sort');

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.sort;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.sort) ? sort : own;
};

},{"../array/virtual/sort":68}],81:[function(require,module,exports){
var startsWith = require('../string/virtual/starts-with');

var StringPrototype = String.prototype;

module.exports = function (it) {
  var own = it.startsWith;
  return typeof it === 'string' || it === StringPrototype
    || (it instanceof String && own === StringPrototype.startsWith) ? startsWith : own;
};

},{"../string/virtual/starts-with":92}],82:[function(require,module,exports){
require('../../modules/es.map');
require('../../modules/es.object.to-string');
require('../../modules/es.string.iterator');
require('../../modules/web.dom-collections.iterator');
var path = require('../../internals/path');

module.exports = path.Map;

},{"../../internals/path":180,"../../modules/es.map":219,"../../modules/es.object.to-string":228,"../../modules/es.string.iterator":230,"../../modules/web.dom-collections.iterator":252}],83:[function(require,module,exports){
require('../../modules/es.number.is-integer');
var path = require('../../internals/path');

module.exports = path.Number.isInteger;

},{"../../internals/path":180,"../../modules/es.number.is-integer":221}],84:[function(require,module,exports){
require('../../modules/es.number.parse-int');
var path = require('../../internals/path');

module.exports = path.Number.parseInt;

},{"../../internals/path":180,"../../modules/es.number.parse-int":222}],85:[function(require,module,exports){
require('../../modules/es.object.create');
var path = require('../../internals/path');

var Object = path.Object;

module.exports = function create(P, D) {
  return Object.create(P, D);
};

},{"../../internals/path":180,"../../modules/es.object.create":223}],86:[function(require,module,exports){
require('../../modules/es.object.define-property');
var path = require('../../internals/path');

var Object = path.Object;

var defineProperty = module.exports = function defineProperty(it, key, desc) {
  return Object.defineProperty(it, key, desc);
};

if (Object.defineProperty.sham) defineProperty.sham = true;

},{"../../internals/path":180,"../../modules/es.object.define-property":224}],87:[function(require,module,exports){
require('../../modules/es.object.freeze');
var path = require('../../internals/path');

module.exports = path.Object.freeze;

},{"../../internals/path":180,"../../modules/es.object.freeze":225}],88:[function(require,module,exports){
require('../../modules/es.object.get-prototype-of');
var path = require('../../internals/path');

module.exports = path.Object.getPrototypeOf;

},{"../../internals/path":180,"../../modules/es.object.get-prototype-of":226}],89:[function(require,module,exports){
require('../../modules/es.object.set-prototype-of');
var path = require('../../internals/path');

module.exports = path.Object.setPrototypeOf;

},{"../../internals/path":180,"../../modules/es.object.set-prototype-of":227}],90:[function(require,module,exports){
require('../../../modules/es.string.includes');
var entryVirtual = require('../../../internals/entry-virtual');

module.exports = entryVirtual('String').includes;

},{"../../../internals/entry-virtual":134,"../../../modules/es.string.includes":229}],91:[function(require,module,exports){
require('../../../modules/es.string.repeat');
var entryVirtual = require('../../../internals/entry-virtual');

module.exports = entryVirtual('String').repeat;

},{"../../../internals/entry-virtual":134,"../../../modules/es.string.repeat":231}],92:[function(require,module,exports){
require('../../../modules/es.string.starts-with');
var entryVirtual = require('../../../internals/entry-virtual');

module.exports = entryVirtual('String').startsWith;

},{"../../../internals/entry-virtual":134,"../../../modules/es.string.starts-with":232}],93:[function(require,module,exports){
require('../../modules/es.array.concat');
require('../../modules/es.object.to-string');
require('../../modules/es.symbol');
require('../../modules/es.symbol.async-iterator');
require('../../modules/es.symbol.description');
require('../../modules/es.symbol.has-instance');
require('../../modules/es.symbol.is-concat-spreadable');
require('../../modules/es.symbol.iterator');
require('../../modules/es.symbol.match');
require('../../modules/es.symbol.match-all');
require('../../modules/es.symbol.replace');
require('../../modules/es.symbol.search');
require('../../modules/es.symbol.species');
require('../../modules/es.symbol.split');
require('../../modules/es.symbol.to-primitive');
require('../../modules/es.symbol.to-string-tag');
require('../../modules/es.symbol.unscopables');
require('../../modules/es.math.to-string-tag');
require('../../modules/es.json.to-string-tag');
var path = require('../../internals/path');

module.exports = path.Symbol;

},{"../../internals/path":180,"../../modules/es.array.concat":203,"../../modules/es.json.to-string-tag":218,"../../modules/es.math.to-string-tag":220,"../../modules/es.object.to-string":228,"../../modules/es.symbol":238,"../../modules/es.symbol.async-iterator":233,"../../modules/es.symbol.description":234,"../../modules/es.symbol.has-instance":235,"../../modules/es.symbol.is-concat-spreadable":236,"../../modules/es.symbol.iterator":237,"../../modules/es.symbol.match":240,"../../modules/es.symbol.match-all":239,"../../modules/es.symbol.replace":241,"../../modules/es.symbol.search":242,"../../modules/es.symbol.species":243,"../../modules/es.symbol.split":244,"../../modules/es.symbol.to-primitive":245,"../../modules/es.symbol.to-string-tag":246,"../../modules/es.symbol.unscopables":247}],94:[function(require,module,exports){
require('../../modules/es.symbol.iterator');
require('../../modules/es.string.iterator');
require('../../modules/web.dom-collections.iterator');
var WrappedWellKnownSymbolModule = require('../../internals/wrapped-well-known-symbol');

module.exports = WrappedWellKnownSymbolModule.f('iterator');

},{"../../internals/wrapped-well-known-symbol":202,"../../modules/es.string.iterator":230,"../../modules/es.symbol.iterator":237,"../../modules/web.dom-collections.iterator":252}],95:[function(require,module,exports){
module.exports = require('../../es/array/from');

},{"../../es/array/from":55}],96:[function(require,module,exports){
module.exports = require('../../es/array/is-array');

},{"../../es/array/is-array":56}],97:[function(require,module,exports){
require('../modules/web.dom-collections.iterator');
require('../modules/es.string.iterator');

module.exports = require('../internals/get-iterator');

},{"../internals/get-iterator":142,"../modules/es.string.iterator":230,"../modules/web.dom-collections.iterator":252}],98:[function(require,module,exports){
require('../modules/web.dom-collections.iterator');
require('../modules/es.string.iterator');

module.exports = require('../internals/is-iterable');

},{"../internals/is-iterable":156,"../modules/es.string.iterator":230,"../modules/web.dom-collections.iterator":252}],99:[function(require,module,exports){
module.exports = require('../../es/object/create');

},{"../../es/object/create":85}],100:[function(require,module,exports){
module.exports = require('../../es/object/define-property');

},{"../../es/object/define-property":86}],101:[function(require,module,exports){
module.exports = require('../../es/object/get-prototype-of');

},{"../../es/object/get-prototype-of":88}],102:[function(require,module,exports){
module.exports = require('../../es/object/set-prototype-of');

},{"../../es/object/set-prototype-of":89}],103:[function(require,module,exports){
module.exports = require('../../es/symbol');

require('../../modules/esnext.symbol.dispose');
require('../../modules/esnext.symbol.observable');
require('../../modules/esnext.symbol.pattern-match');
require('../../modules/esnext.symbol.replace-all');

},{"../../es/symbol":93,"../../modules/esnext.symbol.dispose":248,"../../modules/esnext.symbol.observable":249,"../../modules/esnext.symbol.pattern-match":250,"../../modules/esnext.symbol.replace-all":251}],104:[function(require,module,exports){
module.exports = require('../../es/symbol/iterator');

},{"../../es/symbol/iterator":94}],105:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};

},{}],106:[function(require,module,exports){
var isObject = require('../internals/is-object');

module.exports = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};

},{"../internals/is-object":157}],107:[function(require,module,exports){
module.exports = function () { /* empty */ };

},{}],108:[function(require,module,exports){
module.exports = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};

},{}],109:[function(require,module,exports){
var isObject = require('../internals/is-object');

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};

},{"../internals/is-object":157}],110:[function(require,module,exports){
'use strict';
var $forEach = require('../internals/array-iteration').forEach;
var sloppyArrayMethod = require('../internals/sloppy-array-method');

// `Array.prototype.forEach` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
module.exports = sloppyArrayMethod('forEach') ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
} : [].forEach;

},{"../internals/array-iteration":113,"../internals/sloppy-array-method":189}],111:[function(require,module,exports){
'use strict';
var bind = require('../internals/bind-context');
var toObject = require('../internals/to-object');
var callWithSafeIterationClosing = require('../internals/call-with-safe-iteration-closing');
var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
var toLength = require('../internals/to-length');
var createProperty = require('../internals/create-property');
var getIteratorMethod = require('../internals/get-iterator-method');

// `Array.from` method implementation
// https://tc39.github.io/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var index = 0;
  var iteratorMethod = getIteratorMethod(O);
  var length, result, step, iterator;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    result = new C();
    for (;!(step = iterator.next()).done; index++) {
      createProperty(result, index, mapping
        ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true)
        : step.value
      );
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
    }
  }
  result.length = index;
  return result;
};

},{"../internals/bind-context":117,"../internals/call-with-safe-iteration-closing":118,"../internals/create-property":128,"../internals/get-iterator-method":141,"../internals/is-array-iterator-method":152,"../internals/to-length":196,"../internals/to-object":197}],112:[function(require,module,exports){
var toIndexedObject = require('../internals/to-indexed-object');
var toLength = require('../internals/to-length');
var toAbsoluteIndex = require('../internals/to-absolute-index');

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

},{"../internals/to-absolute-index":193,"../internals/to-indexed-object":194,"../internals/to-length":196}],113:[function(require,module,exports){
var bind = require('../internals/bind-context');
var IndexedObject = require('../internals/indexed-object');
var toObject = require('../internals/to-object');
var toLength = require('../internals/to-length');
var arraySpeciesCreate = require('../internals/array-species-create');

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else if (IS_EVERY) return false;  // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6)
};

},{"../internals/array-species-create":116,"../internals/bind-context":117,"../internals/indexed-object":149,"../internals/to-length":196,"../internals/to-object":197}],114:[function(require,module,exports){
var fails = require('../internals/fails');
var wellKnownSymbol = require('../internals/well-known-symbol');

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  return !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

},{"../internals/fails":137,"../internals/well-known-symbol":200}],115:[function(require,module,exports){
var aFunction = require('../internals/a-function');
var toObject = require('../internals/to-object');
var IndexedObject = require('../internals/indexed-object');
var toLength = require('../internals/to-length');

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aFunction(callbackfn);
    var O = toObject(that);
    var self = IndexedObject(O);
    var length = toLength(O.length);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

module.exports = {
  // `Array.prototype.reduce` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
  left: createMethod(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
  right: createMethod(true)
};

},{"../internals/a-function":105,"../internals/indexed-object":149,"../internals/to-length":196,"../internals/to-object":197}],116:[function(require,module,exports){
var isObject = require('../internals/is-object');
var isArray = require('../internals/is-array');
var wellKnownSymbol = require('../internals/well-known-symbol');

var SPECIES = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};

},{"../internals/is-array":153,"../internals/is-object":157,"../internals/well-known-symbol":200}],117:[function(require,module,exports){
var aFunction = require('../internals/a-function');

// optional / simple context binding
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"../internals/a-function":105}],118:[function(require,module,exports){
var anObject = require('../internals/an-object');

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    var returnMethod = iterator['return'];
    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
    throw error;
  }
};

},{"../internals/an-object":109}],119:[function(require,module,exports){
var wellKnownSymbol = require('../internals/well-known-symbol');

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

},{"../internals/well-known-symbol":200}],120:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],121:[function(require,module,exports){
var classofRaw = require('../internals/classof-raw');
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};

},{"../internals/classof-raw":120,"../internals/well-known-symbol":200}],122:[function(require,module,exports){
'use strict';
var defineProperty = require('../internals/object-define-property').f;
var create = require('../internals/object-create');
var redefineAll = require('../internals/redefine-all');
var bind = require('../internals/bind-context');
var anInstance = require('../internals/an-instance');
var iterate = require('../internals/iterate');
var defineIterator = require('../internals/define-iterator');
var setSpecies = require('../internals/set-species');
var DESCRIPTORS = require('../internals/descriptors');
var fastKey = require('../internals/internal-metadata').fastKey;
var InternalStateModule = require('../internals/internal-state');

var setInternalState = InternalStateModule.set;
var internalStateGetterFor = InternalStateModule.getterFor;

module.exports = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, CONSTRUCTOR_NAME);
      setInternalState(that, {
        type: CONSTRUCTOR_NAME,
        index: create(null),
        first: undefined,
        last: undefined,
        size: 0
      });
      if (!DESCRIPTORS) that.size = 0;
      if (iterable != undefined) iterate(iterable, that[ADDER], that, IS_MAP);
    });

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var entry = getEntry(that, key);
      var previous, index;
      // change existing entry
      if (entry) {
        entry.value = value;
      // create new entry
      } else {
        state.last = entry = {
          index: index = fastKey(key, true),
          key: key,
          value: value,
          previous: previous = state.last,
          next: undefined,
          removed: false
        };
        if (!state.first) state.first = entry;
        if (previous) previous.next = entry;
        if (DESCRIPTORS) state.size++;
        else that.size++;
        // add to index
        if (index !== 'F') state.index[index] = entry;
      } return that;
    };

    var getEntry = function (that, key) {
      var state = getInternalState(that);
      // fast case
      var index = fastKey(key);
      var entry;
      if (index !== 'F') return state.index[index];
      // frozen object case
      for (entry = state.first; entry; entry = entry.next) {
        if (entry.key == key) return entry;
      }
    };

    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        var that = this;
        var state = getInternalState(that);
        var data = state.index;
        var entry = state.first;
        while (entry) {
          entry.removed = true;
          if (entry.previous) entry.previous = entry.previous.next = undefined;
          delete data[entry.index];
          entry = entry.next;
        }
        state.first = state.last = undefined;
        if (DESCRIPTORS) state.size = 0;
        else that.size = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = this;
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.next;
          var prev = entry.previous;
          delete state.index[entry.index];
          entry.removed = true;
          if (prev) prev.next = next;
          if (next) next.previous = prev;
          if (state.first == entry) state.first = next;
          if (state.last == entry) state.last = prev;
          if (DESCRIPTORS) state.size--;
          else that.size--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        var state = getInternalState(this);
        var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.next : state.first) {
          boundFunction(entry.value, entry.key, this);
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });

    redefineAll(C.prototype, IS_MAP ? {
      // 23.1.3.6 Map.prototype.get(key)
      get: function get(key) {
        var entry = getEntry(this, key);
        return entry && entry.value;
      },
      // 23.1.3.9 Map.prototype.set(key, value)
      set: function set(key, value) {
        return define(this, key === 0 ? 0 : key, value);
      }
    } : {
      // 23.2.3.1 Set.prototype.add(value)
      add: function add(value) {
        return define(this, value = value === 0 ? 0 : value, value);
      }
    });
    if (DESCRIPTORS) defineProperty(C.prototype, 'size', {
      get: function () {
        return getInternalState(this).size;
      }
    });
    return C;
  },
  setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
      setInternalState(this, {
        type: ITERATOR_NAME,
        target: iterated,
        state: getInternalCollectionState(iterated),
        kind: kind,
        last: undefined
      });
    }, function () {
      var state = getInternalIteratorState(this);
      var kind = state.kind;
      var entry = state.last;
      // revert to the last existing entry
      while (entry && entry.removed) entry = entry.previous;
      // get next entry
      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
        // or finish the iteration
        state.target = undefined;
        return { value: undefined, done: true };
      }
      // return step by kind
      if (kind == 'keys') return { value: entry.key, done: false };
      if (kind == 'values') return { value: entry.value, done: false };
      return { value: [entry.key, entry.value], done: false };
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(CONSTRUCTOR_NAME);
  }
};

},{"../internals/an-instance":108,"../internals/bind-context":117,"../internals/define-iterator":129,"../internals/descriptors":131,"../internals/internal-metadata":150,"../internals/internal-state":151,"../internals/iterate":160,"../internals/object-create":166,"../internals/object-define-property":168,"../internals/redefine-all":181,"../internals/set-species":185}],123:[function(require,module,exports){
'use strict';
var $ = require('./export');
var global = require('../internals/global');
var InternalMetadataModule = require('../internals/internal-metadata');
var fails = require('../internals/fails');
var hide = require('../internals/hide');
var iterate = require('../internals/iterate');
var anInstance = require('../internals/an-instance');
var isObject = require('../internals/is-object');
var setToStringTag = require('../internals/set-to-string-tag');
var defineProperty = require('../internals/object-define-property').f;
var forEach = require('../internals/array-iteration').forEach;
var DESCRIPTORS = require('../internals/descriptors');
var InternalStateModule = require('../internals/internal-state');

var setInternalState = InternalStateModule.set;
var internalStateGetterFor = InternalStateModule.getterFor;

module.exports = function (CONSTRUCTOR_NAME, wrapper, common, IS_MAP, IS_WEAK) {
  var NativeConstructor = global[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var ADDER = IS_MAP ? 'set' : 'add';
  var exported = {};
  var Constructor;

  if (!DESCRIPTORS || typeof NativeConstructor != 'function'
    || !(IS_WEAK || NativePrototype.forEach && !fails(function () { new NativeConstructor().entries().next(); }))
  ) {
    // create collection constructor
    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
    InternalMetadataModule.REQUIRED = true;
  } else {
    Constructor = wrapper(function (target, iterable) {
      setInternalState(anInstance(target, Constructor, CONSTRUCTOR_NAME), {
        type: CONSTRUCTOR_NAME,
        collection: new NativeConstructor()
      });
      if (iterable != undefined) iterate(iterable, target[ADDER], target, IS_MAP);
    });

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    forEach(['add', 'clear', 'delete', 'forEach', 'get', 'has', 'set', 'keys', 'values', 'entries'], function (KEY) {
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if (KEY in NativePrototype && !(IS_WEAK && KEY == 'clear')) hide(Constructor.prototype, KEY, function (a, b) {
        var collection = getInternalState(this).collection;
        if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY == 'get' ? undefined : false;
        var result = collection[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });

    IS_WEAK || defineProperty(Constructor.prototype, 'size', {
      get: function () {
        return getInternalState(this).collection.size;
      }
    });
  }

  setToStringTag(Constructor, CONSTRUCTOR_NAME, false, true);

  exported[CONSTRUCTOR_NAME] = Constructor;
  $({ global: true, forced: true }, exported);

  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

  return Constructor;
};

},{"../internals/an-instance":108,"../internals/array-iteration":113,"../internals/descriptors":131,"../internals/fails":137,"../internals/global":143,"../internals/hide":146,"../internals/internal-metadata":150,"../internals/internal-state":151,"../internals/is-object":157,"../internals/iterate":160,"../internals/object-define-property":168,"../internals/set-to-string-tag":186,"./export":136}],124:[function(require,module,exports){
var wellKnownSymbol = require('../internals/well-known-symbol');

var MATCH = wellKnownSymbol('match');

module.exports = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (e) {
    try {
      regexp[MATCH] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (f) { /* empty */ }
  } return false;
};

},{"../internals/well-known-symbol":200}],125:[function(require,module,exports){
var fails = require('../internals/fails');

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

},{"../internals/fails":137}],126:[function(require,module,exports){
'use strict';
var IteratorPrototype = require('../internals/iterators-core').IteratorPrototype;
var create = require('../internals/object-create');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var setToStringTag = require('../internals/set-to-string-tag');
var Iterators = require('../internals/iterators');

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};

},{"../internals/create-property-descriptor":127,"../internals/iterators":162,"../internals/iterators-core":161,"../internals/object-create":166,"../internals/set-to-string-tag":186}],127:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],128:[function(require,module,exports){
'use strict';
var toPrimitive = require('../internals/to-primitive');
var definePropertyModule = require('../internals/object-define-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');

module.exports = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

},{"../internals/create-property-descriptor":127,"../internals/object-define-property":168,"../internals/to-primitive":198}],129:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var createIteratorConstructor = require('../internals/create-iterator-constructor');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var setToStringTag = require('../internals/set-to-string-tag');
var hide = require('../internals/hide');
var redefine = require('../internals/redefine');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IS_PURE = require('../internals/is-pure');
var Iterators = require('../internals/iterators');
var IteratorsCore = require('../internals/iterators-core');

var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (typeof CurrentIteratorPrototype[ITERATOR] != 'function') {
          hide(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    hide(IterablePrototype, ITERATOR, defaultIterator);
  }
  Iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};

},{"../internals/create-iterator-constructor":126,"../internals/export":136,"../internals/hide":146,"../internals/is-pure":158,"../internals/iterators":162,"../internals/iterators-core":161,"../internals/object-get-prototype-of":173,"../internals/object-set-prototype-of":177,"../internals/redefine":182,"../internals/set-to-string-tag":186,"../internals/well-known-symbol":200}],130:[function(require,module,exports){
var path = require('../internals/path');
var has = require('../internals/has');
var wrappedWellKnownSymbolModule = require('../internals/wrapped-well-known-symbol');
var defineProperty = require('../internals/object-define-property').f;

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};

},{"../internals/has":144,"../internals/object-define-property":168,"../internals/path":180,"../internals/wrapped-well-known-symbol":202}],131:[function(require,module,exports){
var fails = require('../internals/fails');

// Thank's IE8 for his funny defineProperty
module.exports = !fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"../internals/fails":137}],132:[function(require,module,exports){
var global = require('../internals/global');
var isObject = require('../internals/is-object');

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};

},{"../internals/global":143,"../internals/is-object":157}],133:[function(require,module,exports){
// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

},{}],134:[function(require,module,exports){
var path = require('../internals/path');

module.exports = function (CONSTRUCTOR) {
  return path[CONSTRUCTOR + 'Prototype'];
};

},{"../internals/path":180}],135:[function(require,module,exports){
// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

},{}],136:[function(require,module,exports){
'use strict';
var global = require('../internals/global');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var isForced = require('../internals/is-forced');
var path = require('../internals/path');
var bind = require('../internals/bind-context');
var hide = require('../internals/hide');
var has = require('../internals/has');

var wrapConstructor = function (NativeConstructor) {
  var Wrapper = function (a, b, c) {
    if (this instanceof NativeConstructor) {
      switch (arguments.length) {
        case 0: return new NativeConstructor();
        case 1: return new NativeConstructor(a);
        case 2: return new NativeConstructor(a, b);
      } return new NativeConstructor(a, b, c);
    } return NativeConstructor.apply(this, arguments);
  };
  Wrapper.prototype = NativeConstructor.prototype;
  return Wrapper;
};

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var PROTO = options.proto;

  var nativeSource = GLOBAL ? global : STATIC ? global[TARGET] : (global[TARGET] || {}).prototype;

  var target = GLOBAL ? path : path[TARGET] || (path[TARGET] = {});
  var targetPrototype = target.prototype;

  var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
  var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

  for (key in source) {
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contains in native
    USE_NATIVE = !FORCED && nativeSource && has(nativeSource, key);

    targetProperty = target[key];

    if (USE_NATIVE) if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(nativeSource, key);
      nativeProperty = descriptor && descriptor.value;
    } else nativeProperty = nativeSource[key];

    // export native or implementation
    sourceProperty = (USE_NATIVE && nativeProperty) ? nativeProperty : source[key];

    if (USE_NATIVE && typeof targetProperty === typeof sourceProperty) continue;

    // bind timers to global for call from export context
    if (options.bind && USE_NATIVE) resultProperty = bind(sourceProperty, global);
    // wrap global constructors for prevent changs in this version
    else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
    // make static versions for prototype methods
    else if (PROTO && typeof sourceProperty == 'function') resultProperty = bind(Function.call, sourceProperty);
    // default case
    else resultProperty = sourceProperty;

    // add a flag to not completely full polyfills
    if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
      hide(resultProperty, 'sham', true);
    }

    target[key] = resultProperty;

    if (PROTO) {
      VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
      if (!has(path, VIRTUAL_PROTOTYPE)) hide(path, VIRTUAL_PROTOTYPE, {});
      // export virtual prototype methods
      path[VIRTUAL_PROTOTYPE][key] = sourceProperty;
      // export real prototype methods
      if (options.real && targetPrototype && !targetPrototype[key]) hide(targetPrototype, key, sourceProperty);
    }
  }
};

},{"../internals/bind-context":117,"../internals/global":143,"../internals/has":144,"../internals/hide":146,"../internals/is-forced":154,"../internals/object-get-own-property-descriptor":169,"../internals/path":180}],137:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

},{}],138:[function(require,module,exports){
var fails = require('../internals/fails');

module.exports = !fails(function () {
  return Object.isExtensible(Object.preventExtensions({}));
});

},{"../internals/fails":137}],139:[function(require,module,exports){
var shared = require('../internals/shared');

module.exports = shared('native-function-to-string', Function.toString);

},{"../internals/shared":188}],140:[function(require,module,exports){
var path = require('../internals/path');
var global = require('../internals/global');

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace])
    : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
};

},{"../internals/global":143,"../internals/path":180}],141:[function(require,module,exports){
var classof = require('../internals/classof');
var Iterators = require('../internals/iterators');
var wellKnownSymbol = require('../internals/well-known-symbol');

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"../internals/classof":121,"../internals/iterators":162,"../internals/well-known-symbol":200}],142:[function(require,module,exports){
var anObject = require('../internals/an-object');
var getIteratorMethod = require('../internals/get-iterator-method');

module.exports = function (it) {
  var iteratorMethod = getIteratorMethod(it);
  if (typeof iteratorMethod != 'function') {
    throw TypeError(String(it) + ' is not iterable');
  } return anObject(iteratorMethod.call(it));
};

},{"../internals/an-object":109,"../internals/get-iterator-method":141}],143:[function(require,module,exports){
(function (global){
var O = 'object';
var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line no-undef
  check(typeof globalThis == O && globalThis) ||
  check(typeof window == O && window) ||
  check(typeof self == O && self) ||
  check(typeof global == O && global) ||
  // eslint-disable-next-line no-new-func
  Function('return this')();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],144:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;

module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],145:[function(require,module,exports){
module.exports = {};

},{}],146:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var definePropertyModule = require('../internals/object-define-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"../internals/create-property-descriptor":127,"../internals/descriptors":131,"../internals/object-define-property":168}],147:[function(require,module,exports){
var getBuiltIn = require('../internals/get-built-in');

module.exports = getBuiltIn('document', 'documentElement');

},{"../internals/get-built-in":140}],148:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var fails = require('../internals/fails');
var createElement = require('../internals/document-create-element');

// Thank's IE8 for his funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

},{"../internals/descriptors":131,"../internals/document-create-element":132,"../internals/fails":137}],149:[function(require,module,exports){
var fails = require('../internals/fails');
var classof = require('../internals/classof-raw');

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;

},{"../internals/classof-raw":120,"../internals/fails":137}],150:[function(require,module,exports){
var hiddenKeys = require('../internals/hidden-keys');
var isObject = require('../internals/is-object');
var has = require('../internals/has');
var defineProperty = require('../internals/object-define-property').f;
var uid = require('../internals/uid');
var FREEZING = require('../internals/freezing');

var METADATA = uid('meta');
var id = 0;

var isExtensible = Object.isExtensible || function () {
  return true;
};

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + ++id, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData = function (it, create) {
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZING && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
  return it;
};

var meta = module.exports = {
  REQUIRED: false,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};

hiddenKeys[METADATA] = true;

},{"../internals/freezing":138,"../internals/has":144,"../internals/hidden-keys":145,"../internals/is-object":157,"../internals/object-define-property":168,"../internals/uid":199}],151:[function(require,module,exports){
var NATIVE_WEAK_MAP = require('../internals/native-weak-map');
var global = require('../internals/global');
var isObject = require('../internals/is-object');
var hide = require('../internals/hide');
var objectHas = require('../internals/has');
var sharedKey = require('../internals/shared-key');
var hiddenKeys = require('../internals/hidden-keys');

var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP) {
  var store = new WeakMap();
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    hide(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return objectHas(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return objectHas(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

},{"../internals/global":143,"../internals/has":144,"../internals/hidden-keys":145,"../internals/hide":146,"../internals/is-object":157,"../internals/native-weak-map":164,"../internals/shared-key":187}],152:[function(require,module,exports){
var wellKnownSymbol = require('../internals/well-known-symbol');
var Iterators = require('../internals/iterators');

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};

},{"../internals/iterators":162,"../internals/well-known-symbol":200}],153:[function(require,module,exports){
var classof = require('../internals/classof-raw');

// `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray
module.exports = Array.isArray || function isArray(arg) {
  return classof(arg) == 'Array';
};

},{"../internals/classof-raw":120}],154:[function(require,module,exports){
var fails = require('../internals/fails');

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;

},{"../internals/fails":137}],155:[function(require,module,exports){
var isObject = require('../internals/is-object');

var floor = Math.floor;

// `Number.isInteger` method implementation
// https://tc39.github.io/ecma262/#sec-number.isinteger
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

},{"../internals/is-object":157}],156:[function(require,module,exports){
var classof = require('../internals/classof');
var wellKnownSymbol = require('../internals/well-known-symbol');
var Iterators = require('../internals/iterators');

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    // eslint-disable-next-line no-prototype-builtins
    || Iterators.hasOwnProperty(classof(O));
};

},{"../internals/classof":121,"../internals/iterators":162,"../internals/well-known-symbol":200}],157:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],158:[function(require,module,exports){
module.exports = true;

},{}],159:[function(require,module,exports){
var isObject = require('../internals/is-object');
var classof = require('../internals/classof-raw');
var wellKnownSymbol = require('../internals/well-known-symbol');

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.github.io/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) == 'RegExp');
};

},{"../internals/classof-raw":120,"../internals/is-object":157,"../internals/well-known-symbol":200}],160:[function(require,module,exports){
var anObject = require('../internals/an-object');
var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
var toLength = require('../internals/to-length');
var bind = require('../internals/bind-context');
var getIteratorMethod = require('../internals/get-iterator-method');
var callWithSafeIterationClosing = require('../internals/call-with-safe-iteration-closing');

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
  var boundFunction = bind(fn, that, AS_ENTRIES ? 2 : 1);
  var iterator, iterFn, index, length, result, step;

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = toLength(iterable.length); length > index; index++) {
        result = AS_ENTRIES
          ? boundFunction(anObject(step = iterable[index])[0], step[1])
          : boundFunction(iterable[index]);
        if (result && result instanceof Result) return result;
      } return new Result(false);
    }
    iterator = iterFn.call(iterable);
  }

  while (!(step = iterator.next()).done) {
    result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
    if (result && result instanceof Result) return result;
  } return new Result(false);
};

iterate.stop = function (result) {
  return new Result(true, result);
};

},{"../internals/an-object":109,"../internals/bind-context":117,"../internals/call-with-safe-iteration-closing":118,"../internals/get-iterator-method":141,"../internals/is-array-iterator-method":152,"../internals/to-length":196}],161:[function(require,module,exports){
'use strict';
var getPrototypeOf = require('../internals/object-get-prototype-of');
var hide = require('../internals/hide');
var has = require('../internals/has');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IS_PURE = require('../internals/is-pure');

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

if (IteratorPrototype == undefined) IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if (!IS_PURE && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

},{"../internals/has":144,"../internals/hide":146,"../internals/is-pure":158,"../internals/object-get-prototype-of":173,"../internals/well-known-symbol":200}],162:[function(require,module,exports){
arguments[4][145][0].apply(exports,arguments)
},{"dup":145}],163:[function(require,module,exports){
var fails = require('../internals/fails');

module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});

},{"../internals/fails":137}],164:[function(require,module,exports){
var global = require('../internals/global');
var nativeFunctionToString = require('../internals/function-to-string');

var WeakMap = global.WeakMap;

module.exports = typeof WeakMap === 'function' && /native code/.test(nativeFunctionToString.call(WeakMap));

},{"../internals/function-to-string":139,"../internals/global":143}],165:[function(require,module,exports){
var isRegExp = require('../internals/is-regexp');

module.exports = function (it) {
  if (isRegExp(it)) {
    throw TypeError("The method doesn't accept regular expressions");
  } return it;
};

},{"../internals/is-regexp":159}],166:[function(require,module,exports){
var anObject = require('../internals/an-object');
var defineProperties = require('../internals/object-define-properties');
var enumBugKeys = require('../internals/enum-bug-keys');
var hiddenKeys = require('../internals/hidden-keys');
var html = require('../internals/html');
var documentCreateElement = require('../internals/document-create-element');
var sharedKey = require('../internals/shared-key');
var IE_PROTO = sharedKey('IE_PROTO');

var PROTOTYPE = 'prototype';
var Empty = function () { /* empty */ };

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var length = enumBugKeys.length;
  var lt = '<';
  var script = 'script';
  var gt = '>';
  var js = 'java' + script + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = String(js);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + script + gt + 'document.F=Object' + lt + '/' + script + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (length--) delete createDict[PROTOTYPE][enumBugKeys[length]];
  return createDict();
};

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : defineProperties(result, Properties);
};

hiddenKeys[IE_PROTO] = true;

},{"../internals/an-object":109,"../internals/document-create-element":132,"../internals/enum-bug-keys":135,"../internals/hidden-keys":145,"../internals/html":147,"../internals/object-define-properties":167,"../internals/shared-key":187}],167:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var definePropertyModule = require('../internals/object-define-property');
var anObject = require('../internals/an-object');
var objectKeys = require('../internals/object-keys');

// `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
  return O;
};

},{"../internals/an-object":109,"../internals/descriptors":131,"../internals/object-define-property":168,"../internals/object-keys":175}],168:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');
var anObject = require('../internals/an-object');
var toPrimitive = require('../internals/to-primitive');

var nativeDefineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"../internals/an-object":109,"../internals/descriptors":131,"../internals/ie8-dom-define":148,"../internals/to-primitive":198}],169:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var toIndexedObject = require('../internals/to-indexed-object');
var toPrimitive = require('../internals/to-primitive');
var has = require('../internals/has');
var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
};

},{"../internals/create-property-descriptor":127,"../internals/descriptors":131,"../internals/has":144,"../internals/ie8-dom-define":148,"../internals/object-property-is-enumerable":176,"../internals/to-indexed-object":194,"../internals/to-primitive":198}],170:[function(require,module,exports){
var toIndexedObject = require('../internals/to-indexed-object');
var nativeGetOwnPropertyNames = require('../internals/object-get-own-property-names').f;

var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return nativeGetOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]'
    ? getWindowNames(it)
    : nativeGetOwnPropertyNames(toIndexedObject(it));
};

},{"../internals/object-get-own-property-names":171,"../internals/to-indexed-object":194}],171:[function(require,module,exports){
var internalObjectKeys = require('../internals/object-keys-internal');
var enumBugKeys = require('../internals/enum-bug-keys');

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};

},{"../internals/enum-bug-keys":135,"../internals/object-keys-internal":174}],172:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],173:[function(require,module,exports){
var has = require('../internals/has');
var toObject = require('../internals/to-object');
var sharedKey = require('../internals/shared-key');
var CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter');

var IE_PROTO = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
module.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};

},{"../internals/correct-prototype-getter":125,"../internals/has":144,"../internals/shared-key":187,"../internals/to-object":197}],174:[function(require,module,exports){
var has = require('../internals/has');
var toIndexedObject = require('../internals/to-indexed-object');
var indexOf = require('../internals/array-includes').indexOf;
var hiddenKeys = require('../internals/hidden-keys');

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};

},{"../internals/array-includes":112,"../internals/has":144,"../internals/hidden-keys":145,"../internals/to-indexed-object":194}],175:[function(require,module,exports){
var internalObjectKeys = require('../internals/object-keys-internal');
var enumBugKeys = require('../internals/enum-bug-keys');

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};

},{"../internals/enum-bug-keys":135,"../internals/object-keys-internal":174}],176:[function(require,module,exports){
'use strict';
var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;

},{}],177:[function(require,module,exports){
var anObject = require('../internals/an-object');
var aPossiblePrototype = require('../internals/a-possible-prototype');

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

},{"../internals/a-possible-prototype":106,"../internals/an-object":109}],178:[function(require,module,exports){
'use strict';
var classof = require('../internals/classof');
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

// `Object.prototype.toString` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
module.exports = String(test) !== '[object z]' ? function toString() {
  return '[object ' + classof(this) + ']';
} : test.toString;

},{"../internals/classof":121,"../internals/well-known-symbol":200}],179:[function(require,module,exports){
var global = require('../internals/global');
var trim = require('../internals/string-trim').trim;
var whitespaces = require('../internals/whitespaces');

var nativeParseInt = global.parseInt;
var hex = /^[+-]?0[Xx]/;
var FORCED = nativeParseInt(whitespaces + '08') !== 8 || nativeParseInt(whitespaces + '0x16') !== 22;

// `parseInt` method
// https://tc39.github.io/ecma262/#sec-parseint-string-radix
module.exports = FORCED ? function parseInt(string, radix) {
  var S = trim(String(string));
  return nativeParseInt(S, (radix >>> 0) || (hex.test(S) ? 16 : 10));
} : nativeParseInt;

},{"../internals/global":143,"../internals/string-trim":192,"../internals/whitespaces":201}],180:[function(require,module,exports){
arguments[4][145][0].apply(exports,arguments)
},{"dup":145}],181:[function(require,module,exports){
var redefine = require('../internals/redefine');

module.exports = function (target, src, options) {
  for (var key in src) {
    if (options && options.unsafe && target[key]) target[key] = src[key];
    else redefine(target, key, src[key], options);
  } return target;
};

},{"../internals/redefine":182}],182:[function(require,module,exports){
var hide = require('../internals/hide');

module.exports = function (target, key, value, options) {
  if (options && options.enumerable) target[key] = value;
  else hide(target, key, value);
};

},{"../internals/hide":146}],183:[function(require,module,exports){
// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

},{}],184:[function(require,module,exports){
var global = require('../internals/global');
var hide = require('../internals/hide');

module.exports = function (key, value) {
  try {
    hide(global, key, value);
  } catch (error) {
    global[key] = value;
  } return value;
};

},{"../internals/global":143,"../internals/hide":146}],185:[function(require,module,exports){
'use strict';
var getBuiltIn = require('../internals/get-built-in');
var definePropertyModule = require('../internals/object-define-property');
var wellKnownSymbol = require('../internals/well-known-symbol');
var DESCRIPTORS = require('../internals/descriptors');

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = definePropertyModule.f;

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineProperty(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};

},{"../internals/descriptors":131,"../internals/get-built-in":140,"../internals/object-define-property":168,"../internals/well-known-symbol":200}],186:[function(require,module,exports){
var defineProperty = require('../internals/object-define-property').f;
var hide = require('../internals/hide');
var has = require('../internals/has');
var toString = require('../internals/object-to-string');
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var METHOD_REQUIRED = toString !== ({}).toString;

module.exports = function (it, TAG, STATIC, SET_METHOD) {
  if (it) {
    var target = STATIC ? it : it.prototype;
    if (!has(target, TO_STRING_TAG)) {
      defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
    }
    if (SET_METHOD && METHOD_REQUIRED) hide(target, 'toString', toString);
  }
};

},{"../internals/has":144,"../internals/hide":146,"../internals/object-define-property":168,"../internals/object-to-string":178,"../internals/well-known-symbol":200}],187:[function(require,module,exports){
var shared = require('../internals/shared');
var uid = require('../internals/uid');

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

},{"../internals/shared":188,"../internals/uid":199}],188:[function(require,module,exports){
var global = require('../internals/global');
var setGlobal = require('../internals/set-global');
var IS_PURE = require('../internals/is-pure');

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.1.3',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});

},{"../internals/global":143,"../internals/is-pure":158,"../internals/set-global":184}],189:[function(require,module,exports){
'use strict';
var fails = require('../internals/fails');

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !method || !fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal
    method.call(null, argument || function () { throw 1; }, 1);
  });
};

},{"../internals/fails":137}],190:[function(require,module,exports){
var toInteger = require('../internals/to-integer');
var requireObjectCoercible = require('../internals/require-object-coercible');

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};

},{"../internals/require-object-coercible":183,"../internals/to-integer":195}],191:[function(require,module,exports){
'use strict';
var toInteger = require('../internals/to-integer');
var requireObjectCoercible = require('../internals/require-object-coercible');

// `String.prototype.repeat` method implementation
// https://tc39.github.io/ecma262/#sec-string.prototype.repeat
module.exports = ''.repeat || function repeat(count) {
  var str = String(requireObjectCoercible(this));
  var result = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
  return result;
};

},{"../internals/require-object-coercible":183,"../internals/to-integer":195}],192:[function(require,module,exports){
var requireObjectCoercible = require('../internals/require-object-coercible');
var whitespaces = require('../internals/whitespaces');

var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod = function (TYPE) {
  return function ($this) {
    var string = String(requireObjectCoercible($this));
    if (TYPE & 1) string = string.replace(ltrim, '');
    if (TYPE & 2) string = string.replace(rtrim, '');
    return string;
  };
};

module.exports = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
  start: createMethod(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
  end: createMethod(2),
  // `String.prototype.trim` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
  trim: createMethod(3)
};

},{"../internals/require-object-coercible":183,"../internals/whitespaces":201}],193:[function(require,module,exports){
var toInteger = require('../internals/to-integer');

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(length, length).
module.exports = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};

},{"../internals/to-integer":195}],194:[function(require,module,exports){
// toObject with fallback for non-array-like ES3 strings
var IndexedObject = require('../internals/indexed-object');
var requireObjectCoercible = require('../internals/require-object-coercible');

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};

},{"../internals/indexed-object":149,"../internals/require-object-coercible":183}],195:[function(require,module,exports){
var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
module.exports = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

},{}],196:[function(require,module,exports){
var toInteger = require('../internals/to-integer');

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

},{"../internals/to-integer":195}],197:[function(require,module,exports){
var requireObjectCoercible = require('../internals/require-object-coercible');

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};

},{"../internals/require-object-coercible":183}],198:[function(require,module,exports){
var isObject = require('../internals/is-object');

// `ToPrimitive` abstract operation
// https://tc39.github.io/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"../internals/is-object":157}],199:[function(require,module,exports){
var id = 0;
var postfix = Math.random();

module.exports = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};

},{}],200:[function(require,module,exports){
var global = require('../internals/global');
var shared = require('../internals/shared');
var uid = require('../internals/uid');
var NATIVE_SYMBOL = require('../internals/native-symbol');

var Symbol = global.Symbol;
var store = shared('wks');

module.exports = function (name) {
  return store[name] || (store[name] = NATIVE_SYMBOL && Symbol[name]
    || (NATIVE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

},{"../internals/global":143,"../internals/native-symbol":163,"../internals/shared":188,"../internals/uid":199}],201:[function(require,module,exports){
// a string of all valid unicode whitespaces
// eslint-disable-next-line max-len
module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

},{}],202:[function(require,module,exports){
exports.f = require('../internals/well-known-symbol');

},{"../internals/well-known-symbol":200}],203:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var fails = require('../internals/fails');
var isArray = require('../internals/is-array');
var isObject = require('../internals/is-object');
var toObject = require('../internals/to-object');
var toLength = require('../internals/to-length');
var createProperty = require('../internals/create-property');
var arraySpeciesCreate = require('../internals/array-species-create');
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');
var wellKnownSymbol = require('../internals/well-known-symbol');

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

var IS_CONCAT_SPREADABLE_SUPPORT = !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.github.io/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$({ target: 'Array', proto: true, forced: FORCED }, {
  concat: function concat(arg) { // eslint-disable-line no-unused-vars
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});

},{"../internals/array-method-has-species-support":114,"../internals/array-species-create":116,"../internals/create-property":128,"../internals/export":136,"../internals/fails":137,"../internals/is-array":153,"../internals/is-object":157,"../internals/to-length":196,"../internals/to-object":197,"../internals/well-known-symbol":200}],204:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var $every = require('../internals/array-iteration').every;
var sloppyArrayMethod = require('../internals/sloppy-array-method');

// `Array.prototype.every` method
// https://tc39.github.io/ecma262/#sec-array.prototype.every
$({ target: 'Array', proto: true, forced: sloppyArrayMethod('every') }, {
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/array-iteration":113,"../internals/export":136,"../internals/sloppy-array-method":189}],205:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var $filter = require('../internals/array-iteration').filter;
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');

// `Array.prototype.filter` method
// https://tc39.github.io/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('filter') }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/array-iteration":113,"../internals/array-method-has-species-support":114,"../internals/export":136}],206:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var $find = require('../internals/array-iteration').find;
var addToUnscopables = require('../internals/add-to-unscopables');

var FIND = 'find';
var SKIPS_HOLES = true;

// Shouldn't skip holes
if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

// `Array.prototype.find` method
// https://tc39.github.io/ecma262/#sec-array.prototype.find
$({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND);

},{"../internals/add-to-unscopables":107,"../internals/array-iteration":113,"../internals/export":136}],207:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var forEach = require('../internals/array-for-each');

// `Array.prototype.forEach` method
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
$({ target: 'Array', proto: true, forced: [].forEach != forEach }, {
  forEach: forEach
});

},{"../internals/array-for-each":110,"../internals/export":136}],208:[function(require,module,exports){
var $ = require('../internals/export');
var from = require('../internals/array-from');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.github.io/ecma262/#sec-array.from
$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from
});

},{"../internals/array-from":111,"../internals/check-correctness-of-iteration":119,"../internals/export":136}],209:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var $includes = require('../internals/array-includes').includes;
var addToUnscopables = require('../internals/add-to-unscopables');

// `Array.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
$({ target: 'Array', proto: true }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');

},{"../internals/add-to-unscopables":107,"../internals/array-includes":112,"../internals/export":136}],210:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var $indexOf = require('../internals/array-includes').indexOf;
var sloppyArrayMethod = require('../internals/sloppy-array-method');

var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var SLOPPY_METHOD = sloppyArrayMethod('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
$({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || SLOPPY_METHOD }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/array-includes":112,"../internals/export":136,"../internals/sloppy-array-method":189}],211:[function(require,module,exports){
var $ = require('../internals/export');
var isArray = require('../internals/is-array');

// `Array.isArray` method
// https://tc39.github.io/ecma262/#sec-array.isarray
$({ target: 'Array', stat: true }, {
  isArray: isArray
});

},{"../internals/export":136,"../internals/is-array":153}],212:[function(require,module,exports){
'use strict';
var toIndexedObject = require('../internals/to-indexed-object');
var addToUnscopables = require('../internals/add-to-unscopables');
var Iterators = require('../internals/iterators');
var InternalStateModule = require('../internals/internal-state');
var defineIterator = require('../internals/define-iterator');

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.github.io/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.github.io/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.github.io/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.github.io/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
Iterators.Arguments = Iterators.Array;

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"../internals/add-to-unscopables":107,"../internals/define-iterator":129,"../internals/internal-state":151,"../internals/iterators":162,"../internals/to-indexed-object":194}],213:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var $map = require('../internals/array-iteration').map;
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');

// `Array.prototype.map` method
// https://tc39.github.io/ecma262/#sec-array.prototype.map
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('map') }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/array-iteration":113,"../internals/array-method-has-species-support":114,"../internals/export":136}],214:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var $reduce = require('../internals/array-reduce').left;
var sloppyArrayMethod = require('../internals/sloppy-array-method');

// `Array.prototype.reduce` method
// https://tc39.github.io/ecma262/#sec-array.prototype.reduce
$({ target: 'Array', proto: true, forced: sloppyArrayMethod('reduce') }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/array-reduce":115,"../internals/export":136,"../internals/sloppy-array-method":189}],215:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var isArray = require('../internals/is-array');

var nativeReverse = [].reverse;
var test = [1, 2];

// `Array.prototype.reverse` method
// https://tc39.github.io/ecma262/#sec-array.prototype.reverse
// fix for Safari 12.0 bug
// https://bugs.webkit.org/show_bug.cgi?id=188794
$({ target: 'Array', proto: true, forced: String(test) === String(test.reverse()) }, {
  reverse: function reverse() {
    if (isArray(this)) this.length = this.length;
    return nativeReverse.call(this);
  }
});

},{"../internals/export":136,"../internals/is-array":153}],216:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var isObject = require('../internals/is-object');
var isArray = require('../internals/is-array');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toLength = require('../internals/to-length');
var toIndexedObject = require('../internals/to-indexed-object');
var createProperty = require('../internals/create-property');
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');
var wellKnownSymbol = require('../internals/well-known-symbol');

var SPECIES = wellKnownSymbol('species');
var nativeSlice = [].slice;
var max = Math.max;

// `Array.prototype.slice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('slice') }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return nativeSlice.call(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});

},{"../internals/array-method-has-species-support":114,"../internals/create-property":128,"../internals/export":136,"../internals/is-array":153,"../internals/is-object":157,"../internals/to-absolute-index":193,"../internals/to-indexed-object":194,"../internals/to-length":196,"../internals/well-known-symbol":200}],217:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var aFunction = require('../internals/a-function');
var toObject = require('../internals/to-object');
var fails = require('../internals/fails');
var sloppyArrayMethod = require('../internals/sloppy-array-method');

var nativeSort = [].sort;
var test = [1, 2, 3];

// IE8-
var FAILS_ON_UNDEFINED = fails(function () {
  test.sort(undefined);
});
// V8 bug
var FAILS_ON_NULL = fails(function () {
  test.sort(null);
});
// Old WebKit
var SLOPPY_METHOD = sloppyArrayMethod('sort');

var FORCED = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || SLOPPY_METHOD;

// `Array.prototype.sort` method
// https://tc39.github.io/ecma262/#sec-array.prototype.sort
$({ target: 'Array', proto: true, forced: FORCED }, {
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? nativeSort.call(toObject(this))
      : nativeSort.call(toObject(this), aFunction(comparefn));
  }
});

},{"../internals/a-function":105,"../internals/export":136,"../internals/fails":137,"../internals/sloppy-array-method":189,"../internals/to-object":197}],218:[function(require,module,exports){
var global = require('../internals/global');
var setToStringTag = require('../internals/set-to-string-tag');

// JSON[@@toStringTag] property
// https://tc39.github.io/ecma262/#sec-json-@@tostringtag
setToStringTag(global.JSON, 'JSON', true);

},{"../internals/global":143,"../internals/set-to-string-tag":186}],219:[function(require,module,exports){
'use strict';
var collection = require('../internals/collection');
var collectionStrong = require('../internals/collection-strong');

// `Map` constructor
// https://tc39.github.io/ecma262/#sec-map-objects
module.exports = collection('Map', function (get) {
  return function Map() { return get(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong, true);

},{"../internals/collection":123,"../internals/collection-strong":122}],220:[function(require,module,exports){
var setToStringTag = require('../internals/set-to-string-tag');

// Math[@@toStringTag] property
// https://tc39.github.io/ecma262/#sec-math-@@tostringtag
setToStringTag(Math, 'Math', true);

},{"../internals/set-to-string-tag":186}],221:[function(require,module,exports){
var $ = require('../internals/export');
var isInteger = require('../internals/is-integer');

// `Number.isInteger` method
// https://tc39.github.io/ecma262/#sec-number.isinteger
$({ target: 'Number', stat: true }, {
  isInteger: isInteger
});

},{"../internals/export":136,"../internals/is-integer":155}],222:[function(require,module,exports){
var $ = require('../internals/export');
var parseInt = require('../internals/parse-int');

// `Number.parseInt` method
// https://tc39.github.io/ecma262/#sec-number.parseint
$({ target: 'Number', stat: true, forced: Number.parseInt != parseInt }, {
  parseInt: parseInt
});

},{"../internals/export":136,"../internals/parse-int":179}],223:[function(require,module,exports){
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var create = require('../internals/object-create');

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
$({ target: 'Object', stat: true, sham: !DESCRIPTORS }, {
  create: create
});

},{"../internals/descriptors":131,"../internals/export":136,"../internals/object-create":166}],224:[function(require,module,exports){
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var objectDefinePropertyModile = require('../internals/object-define-property');

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
$({ target: 'Object', stat: true, forced: !DESCRIPTORS, sham: !DESCRIPTORS }, {
  defineProperty: objectDefinePropertyModile.f
});

},{"../internals/descriptors":131,"../internals/export":136,"../internals/object-define-property":168}],225:[function(require,module,exports){
var $ = require('../internals/export');
var FREEZING = require('../internals/freezing');
var fails = require('../internals/fails');
var isObject = require('../internals/is-object');
var onFreeze = require('../internals/internal-metadata').onFreeze;

var nativeFreeze = Object.freeze;
var FAILS_ON_PRIMITIVES = fails(function () { nativeFreeze(1); });

// `Object.freeze` method
// https://tc39.github.io/ecma262/#sec-object.freeze
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !FREEZING }, {
  freeze: function freeze(it) {
    return nativeFreeze && isObject(it) ? nativeFreeze(onFreeze(it)) : it;
  }
});

},{"../internals/export":136,"../internals/fails":137,"../internals/freezing":138,"../internals/internal-metadata":150,"../internals/is-object":157}],226:[function(require,module,exports){
var $ = require('../internals/export');
var fails = require('../internals/fails');
var toObject = require('../internals/to-object');
var nativeGetPrototypeOf = require('../internals/object-get-prototype-of');
var CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter');

var FAILS_ON_PRIMITIVES = fails(function () { nativeGetPrototypeOf(1); });

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !CORRECT_PROTOTYPE_GETTER }, {
  getPrototypeOf: function getPrototypeOf(it) {
    return nativeGetPrototypeOf(toObject(it));
  }
});


},{"../internals/correct-prototype-getter":125,"../internals/export":136,"../internals/fails":137,"../internals/object-get-prototype-of":173,"../internals/to-object":197}],227:[function(require,module,exports){
var $ = require('../internals/export');
var setPrototypeOf = require('../internals/object-set-prototype-of');

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
$({ target: 'Object', stat: true }, {
  setPrototypeOf: setPrototypeOf
});

},{"../internals/export":136,"../internals/object-set-prototype-of":177}],228:[function(require,module,exports){
// empty

},{}],229:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var notARegExp = require('../internals/not-a-regexp');
var requireObjectCoercible = require('../internals/require-object-coercible');
var correctIsRegExpLogic = require('../internals/correct-is-regexp-logic');

// `String.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-string.prototype.includes
$({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~String(requireObjectCoercible(this))
      .indexOf(notARegExp(searchString), arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/correct-is-regexp-logic":124,"../internals/export":136,"../internals/not-a-regexp":165,"../internals/require-object-coercible":183}],230:[function(require,module,exports){
'use strict';
var charAt = require('../internals/string-multibyte').charAt;
var InternalStateModule = require('../internals/internal-state');
var defineIterator = require('../internals/define-iterator');

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});

},{"../internals/define-iterator":129,"../internals/internal-state":151,"../internals/string-multibyte":190}],231:[function(require,module,exports){
var $ = require('../internals/export');
var repeat = require('../internals/string-repeat');

// `String.prototype.repeat` method
// https://tc39.github.io/ecma262/#sec-string.prototype.repeat
$({ target: 'String', proto: true }, {
  repeat: repeat
});

},{"../internals/export":136,"../internals/string-repeat":191}],232:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var toLength = require('../internals/to-length');
var notARegExp = require('../internals/not-a-regexp');
var requireObjectCoercible = require('../internals/require-object-coercible');
var correctIsRegExpLogic = require('../internals/correct-is-regexp-logic');

var nativeStartsWith = ''.startsWith;
var min = Math.min;

// `String.prototype.startsWith` method
// https://tc39.github.io/ecma262/#sec-string.prototype.startswith
$({ target: 'String', proto: true, forced: !correctIsRegExpLogic('startsWith') }, {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = String(requireObjectCoercible(this));
    notARegExp(searchString);
    var index = toLength(min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return nativeStartsWith
      ? nativeStartsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

},{"../internals/correct-is-regexp-logic":124,"../internals/export":136,"../internals/not-a-regexp":165,"../internals/require-object-coercible":183,"../internals/to-length":196}],233:[function(require,module,exports){
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.asyncIterator` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.asynciterator
defineWellKnownSymbol('asyncIterator');

},{"../internals/define-well-known-symbol":130}],234:[function(require,module,exports){
arguments[4][228][0].apply(exports,arguments)
},{"dup":228}],235:[function(require,module,exports){
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.hasInstance` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.hasinstance
defineWellKnownSymbol('hasInstance');

},{"../internals/define-well-known-symbol":130}],236:[function(require,module,exports){
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.isConcatSpreadable` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.isconcatspreadable
defineWellKnownSymbol('isConcatSpreadable');

},{"../internals/define-well-known-symbol":130}],237:[function(require,module,exports){
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.iterator` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');

},{"../internals/define-well-known-symbol":130}],238:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var IS_PURE = require('../internals/is-pure');
var DESCRIPTORS = require('../internals/descriptors');
var NATIVE_SYMBOL = require('../internals/native-symbol');
var fails = require('../internals/fails');
var has = require('../internals/has');
var isArray = require('../internals/is-array');
var isObject = require('../internals/is-object');
var anObject = require('../internals/an-object');
var toObject = require('../internals/to-object');
var toIndexedObject = require('../internals/to-indexed-object');
var toPrimitive = require('../internals/to-primitive');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var nativeObjectCreate = require('../internals/object-create');
var objectKeys = require('../internals/object-keys');
var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names');
var getOwnPropertyNamesExternal = require('../internals/object-get-own-property-names-external');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var definePropertyModule = require('../internals/object-define-property');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var hide = require('../internals/hide');
var redefine = require('../internals/redefine');
var shared = require('../internals/shared');
var sharedKey = require('../internals/shared-key');
var hiddenKeys = require('../internals/hidden-keys');
var uid = require('../internals/uid');
var wellKnownSymbol = require('../internals/well-known-symbol');
var wrappedWellKnownSymbolModule = require('../internals/wrapped-well-known-symbol');
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');
var setToStringTag = require('../internals/set-to-string-tag');
var InternalStateModule = require('../internals/internal-state');
var $forEach = require('../internals/array-iteration').forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE = 'prototype';
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);
var ObjectPrototype = Object[PROTOTYPE];
var $Symbol = global.Symbol;
var JSON = global.JSON;
var nativeJSONStringify = JSON && JSON.stringify;
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');
var WellKnownSymbolsStore = shared('wks');
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate($Symbol[PROTOTYPE]);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};

var isSymbol = NATIVE_SYMBOL && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return Object(it) instanceof $Symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPrimitive(P, true);
  anObject(Attributes);
  if (has(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!has(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!DESCRIPTORS || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPrimitive(V, true);
  var enumerable = nativePropertyIsEnumerable.call(this, P);
  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPrimitive(P, true);
  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
  });
  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
      result.push(AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.github.io/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return getInternalState(this).tag;
  });

  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

  if (DESCRIPTORS) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty($Symbol[PROTOTYPE], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }

  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };
}

$({ global: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});

$({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
  // `Symbol.for` method
  // https://tc39.github.io/ecma262/#sec-symbol.for
  'for': function (key) {
    var string = String(key);
    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = $Symbol(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  },
  // `Symbol.keyFor` method
  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  },
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames,
  // `Object.getOwnPropertySymbols` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
$({ target: 'Object', stat: true, forced: fails(function () { getOwnPropertySymbolsModule.f(1); }) }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return getOwnPropertySymbolsModule.f(toObject(it));
  }
});

// `JSON.stringify` method behavior with symbols
// https://tc39.github.io/ecma262/#sec-json.stringify
JSON && $({ target: 'JSON', stat: true, forced: !NATIVE_SYMBOL || fails(function () {
  var symbol = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  return nativeJSONStringify([symbol]) != '[null]'
    // WebKit converts symbol values to JSON as null
    || nativeJSONStringify({ a: symbol }) != '{}'
    // V8 throws on boxed symbols
    || nativeJSONStringify(Object(symbol)) != '{}';
}) }, {
  stringify: function stringify(it) {
    var args = [it];
    var index = 1;
    var replacer, $replacer;
    while (arguments.length > index) args.push(arguments[index++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return nativeJSONStringify.apply(JSON, args);
  }
});

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
if (!$Symbol[PROTOTYPE][TO_PRIMITIVE]) hide($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;

},{"../internals/an-object":109,"../internals/array-iteration":113,"../internals/create-property-descriptor":127,"../internals/define-well-known-symbol":130,"../internals/descriptors":131,"../internals/export":136,"../internals/fails":137,"../internals/global":143,"../internals/has":144,"../internals/hidden-keys":145,"../internals/hide":146,"../internals/internal-state":151,"../internals/is-array":153,"../internals/is-object":157,"../internals/is-pure":158,"../internals/native-symbol":163,"../internals/object-create":166,"../internals/object-define-property":168,"../internals/object-get-own-property-descriptor":169,"../internals/object-get-own-property-names":171,"../internals/object-get-own-property-names-external":170,"../internals/object-get-own-property-symbols":172,"../internals/object-keys":175,"../internals/object-property-is-enumerable":176,"../internals/redefine":182,"../internals/set-to-string-tag":186,"../internals/shared":188,"../internals/shared-key":187,"../internals/to-indexed-object":194,"../internals/to-object":197,"../internals/to-primitive":198,"../internals/uid":199,"../internals/well-known-symbol":200,"../internals/wrapped-well-known-symbol":202}],239:[function(require,module,exports){
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.matchAll` well-known symbol
defineWellKnownSymbol('matchAll');

},{"../internals/define-well-known-symbol":130}],240:[function(require,module,exports){
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.match` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.match
defineWellKnownSymbol('match');

},{"../internals/define-well-known-symbol":130}],241:[function(require,module,exports){
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.replace` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.replace
defineWellKnownSymbol('replace');

},{"../internals/define-well-known-symbol":130}],242:[function(require,module,exports){
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.search` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.search
defineWellKnownSymbol('search');

},{"../internals/define-well-known-symbol":130}],243:[function(require,module,exports){
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.species` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.species
defineWellKnownSymbol('species');

},{"../internals/define-well-known-symbol":130}],244:[function(require,module,exports){
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.split` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.split
defineWellKnownSymbol('split');

},{"../internals/define-well-known-symbol":130}],245:[function(require,module,exports){
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.toPrimitive` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.toprimitive
defineWellKnownSymbol('toPrimitive');

},{"../internals/define-well-known-symbol":130}],246:[function(require,module,exports){
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.toStringTag` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.tostringtag
defineWellKnownSymbol('toStringTag');

},{"../internals/define-well-known-symbol":130}],247:[function(require,module,exports){
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.unscopables` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.unscopables
defineWellKnownSymbol('unscopables');

},{"../internals/define-well-known-symbol":130}],248:[function(require,module,exports){
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.patternMatch` well-known symbol
// https://github.com/tc39/proposal-using-statement
defineWellKnownSymbol('dispose');

},{"../internals/define-well-known-symbol":130}],249:[function(require,module,exports){
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.observable` well-known symbol
// https://github.com/tc39/proposal-observable
defineWellKnownSymbol('observable');

},{"../internals/define-well-known-symbol":130}],250:[function(require,module,exports){
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.patternMatch` well-known symbol
// https://github.com/tc39/proposal-pattern-matching
defineWellKnownSymbol('patternMatch');

},{"../internals/define-well-known-symbol":130}],251:[function(require,module,exports){
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.replaceAll` well-known symbol
// https://tc39.github.io/proposal-string-replaceall/
defineWellKnownSymbol('replaceAll');

},{"../internals/define-well-known-symbol":130}],252:[function(require,module,exports){
require('./es.array.iterator');
var DOMIterables = require('../internals/dom-iterables');
var global = require('../internals/global');
var hide = require('../internals/hide');
var Iterators = require('../internals/iterators');
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype && !CollectionPrototype[TO_STRING_TAG]) {
    hide(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
  }
  Iterators[COLLECTION_NAME] = Iterators.Array;
}

},{"../internals/dom-iterables":133,"../internals/global":143,"../internals/hide":146,"../internals/iterators":162,"../internals/well-known-symbol":200,"./es.array.iterator":212}],253:[function(require,module,exports){
arguments[4][96][0].apply(exports,arguments)
},{"../../es/array/is-array":56,"dup":96}],254:[function(require,module,exports){
module.exports = require('../../../es/array/virtual/for-each');

},{"../../../es/array/virtual/for-each":61}],255:[function(require,module,exports){
module.exports = require('../../es/instance/concat');

},{"../../es/instance/concat":69}],256:[function(require,module,exports){
module.exports = require('../../es/instance/every');

},{"../../es/instance/every":70}],257:[function(require,module,exports){
module.exports = require('../../es/instance/filter');

},{"../../es/instance/filter":71}],258:[function(require,module,exports){
module.exports = require('../../es/instance/find');

},{"../../es/instance/find":72}],259:[function(require,module,exports){
require('../../modules/web.dom-collections.iterator');
var forEach = require('../array/virtual/for-each');
var classof = require('../../internals/classof');
var ArrayPrototype = Array.prototype;

var DOMIterables = {
  DOMTokenList: true,
  NodeList: true
};

module.exports = function (it) {
  var own = it.forEach;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.forEach)
    // eslint-disable-next-line no-prototype-builtins
    || DOMIterables.hasOwnProperty(classof(it)) ? forEach : own;
};

},{"../../internals/classof":121,"../../modules/web.dom-collections.iterator":252,"../array/virtual/for-each":254}],260:[function(require,module,exports){
module.exports = require('../../es/instance/includes');

},{"../../es/instance/includes":73}],261:[function(require,module,exports){
module.exports = require('../../es/instance/index-of');

},{"../../es/instance/index-of":74}],262:[function(require,module,exports){
module.exports = require('../../es/instance/map');

},{"../../es/instance/map":75}],263:[function(require,module,exports){
module.exports = require('../../es/instance/reduce');

},{"../../es/instance/reduce":76}],264:[function(require,module,exports){
module.exports = require('../../es/instance/repeat');

},{"../../es/instance/repeat":77}],265:[function(require,module,exports){
module.exports = require('../../es/instance/reverse');

},{"../../es/instance/reverse":78}],266:[function(require,module,exports){
module.exports = require('../../es/instance/slice');

},{"../../es/instance/slice":79}],267:[function(require,module,exports){
module.exports = require('../../es/instance/sort');

},{"../../es/instance/sort":80}],268:[function(require,module,exports){
module.exports = require('../../es/instance/starts-with');

},{"../../es/instance/starts-with":81}],269:[function(require,module,exports){
module.exports = require('../../es/map');

},{"../../es/map":82}],270:[function(require,module,exports){
module.exports = require('../../es/number/is-integer');

},{"../../es/number/is-integer":83}],271:[function(require,module,exports){
module.exports = require('../../es/number/parse-int');

},{"../../es/number/parse-int":84}],272:[function(require,module,exports){
module.exports = require('../../es/object/freeze');

},{"../../es/object/freeze":87}],273:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

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
  exports.wrap = wrap;

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

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
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
  exports.awrap = function(arg) {
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
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
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
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
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
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
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

  exports.keys = function(object) {
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
  exports.values = values;

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

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}]},{},[1])(1)
});
