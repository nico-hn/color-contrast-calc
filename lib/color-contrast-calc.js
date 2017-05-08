"use strict";

class ColorContrastCalc {
  constructor(rgb, name = null) {
    const ownClass = this.constructor;
    this.rgb = ownClass.isString(rgb) ? ownClass.hexNotationToDecimal(rgb) : rgb;
    this.relativeLuminance = ownClass.relativeLuminance(this.rgb);
    this.name = name === null ? ownClass.decimalToHexNotation(this.rgb) : name;
    this.hexNotation = ownClass.decimalToHexNotation(this.rgb);
  }

  static tristimulusValue(primaryColor, base = 255) {
    const s = primaryColor / base;
    if (s <= 0.03928) {
      return s / 12.92;
    } else {
      return Math.pow((s + 0.055) / 1.055, 2.4);
    }
  }

  static relativeLuminance(rgb = [255, 255, 255]) {
    if (this.isString(rgb)) { rgb = this.hexNotationToDecimal(rgb); }

    const [r, g, b] = rgb.map(c => this.tristimulusValue(c));
    return r * 0.2126 + g * 0.7152 + b * 0.0722;
  }

  static contrastRatio(foreground, background) {
    const [l1, l2] = [foreground, background]
          .map(c => this.relativeLuminance(c))
          .sort((f, b) => b - f);
    return (l1 + 0.05) / (l2 + 0.05);
  }

  static hexNotationToDecimal(hexString) {
    const h = this.normalizeHexNotation(hexString);
    return [0, 2, 4].map(s => h.substr(s, 2))
      .map(primaryColor => Number.parseInt(primaryColor, 16));
  }

  static normalizeHexNotation(hexString) {
    const h = hexString.startsWith("#") ? hexString.replace("#", "") : hexString;
    if (h.length === 3) {
      return [0, 1, 2].map(s => h.substr(s, 1).repeat(2)).join("");
    } else {
      return h;
    }
  }

  static decimalToHexNotation(rgb) {
    return "#" + rgb.map(d => {
      const h = d.toString(16);
      return h.length === 1 ? "0" + h : h;
    }).join("");
  }

  static isString(str) {
    return typeof str === "string" || str instanceof String;
  }

  static loadColorKeywords() {
    /* https://www.w3.org/TR/SVG/types.html#ColorKeywords */
    require("./color-keywords.json").forEach(color => {
      const [name, hex] = color;
      const calc = new ColorContrastCalc(hex, name);
      this.NAMED_COLORS.push(calc);
      this.NAME_TO_COLOR.set(name, calc);
      this.HEX_TO_COLOR.set(hex, calc);
    });

    Object.freeze(this.NAMED_COLORS);
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

  toString(base = 16) {
    switch (base) {
    case 16:
      return this.hexNotation;
    case 10:
      return `rgb(${this.rgb.join(",")})`;
    default:
      return this.name || this.hexNotation;
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
    if (newColor > 255) {
      return 255;
    } else if (newColor < 0) {
      return 0;
    } else {
      return newColor;
    }
  }

  calcNewBrightness(origColor, ratio = 100) {
    /*
       https://www.w3.org/TR/filter-effects/#funcdef-brightness
       https://www.w3.org/TR/SVG/filters.html#TransferFunctionElementAttributes
    */
    return Math.min(255, Math.round(origColor * ratio / 100));
  }
}

ColorContrastCalc.NAMED_COLORS = [];
ColorContrastCalc.NAME_TO_COLOR = new Map();
ColorContrastCalc.HEX_TO_COLOR = new Map();
ColorContrastCalc.loadColorKeywords();

module.exports.ColorContrastCalc = ColorContrastCalc;
