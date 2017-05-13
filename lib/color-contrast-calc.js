"use strict";

class ColorContrastCalc {
  constructor(rgb, name = null) {
    const ownClass = this.constructor;
    this.rgb = ownClass.isString(rgb) ? ownClass.hexNotationToDecimal(rgb) : rgb;
    this.relativeLuminance = ownClass.relativeLuminance(this.rgb);
    this.name = name === null ? ownClass.decimalToHexNotation(this.rgb) : name;
    this.hexCode = ownClass.decimalToHexNotation(this.rgb);
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

  static getByName(name) {
    return this.NAME_TO_COLOR.get(name);
  }

  static getByHexCode(code) {
    const registeredCode = this.HEX_TO_COLOR.get(code);
    return registeredCode ? registeredCode : new ColorContrastCalc(code);
  }

  static loadColorKeywords(colorKeywordsJSON) {
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
    this.assignColorConstants();
    this.generateWebSafeColors();
  }

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

  static generateWebSafeColors() {
    this.WEB_SAFE_COLORS = [];

    for (let r = 0; r < 16; r += 3) {
      for (let g = 0; g < 16; g += 3) {
        for (let b = 0; b < 16; b += 3) {
          let safeRgb = [r, g, b].map(c => c * 17);
          this.WEB_SAFE_COLORS.push(new ColorContrastCalc(safeRgb));
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

  findBrightnessThreshold(otherColor, level = "AA") {
    const targetRatio = this.levelToContrastRatio(level);
    const criteria = this.brightnessThresholdCriteria(targetRatio, otherColor);
    const w = this.calcUpperRatioLimit() / 2;
    let r = w;

    for (let d of ColorContrastCalc.binarySearchWidth(w, 0.1)) {
      let newColor = otherColor.newBrightnessColor(r);
      let contrastRatio = newColor.contrastRatioAgainst(this);

      if (contrastRatio === targetRatio) { break; }
      r += criteria.incrementCondition(contrastRatio) ? d : -d;
    }

    return otherColor.newBrightnessColor(criteria.round(r));
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

  calcUpperRatioLimit() {
    const darkest = this.rgb
            .filter(c => c !== 0)
            .reduce((a, b) => Math.min(a, b));
    return Math.ceil((255 / darkest) * 100);
  }

  brightnessThresholdCriteria(targetRatio, otherColor) {
    const criteria = {};

    if (this.isBrighterThan(otherColor) ||
        this.hasSameLuminance(otherColor) && this.isLightColor()) {
      criteria.round = (r) => Math.floor(r);
      criteria.incrementCondition = (contrastRatio) => contrastRatio > targetRatio;
    } else {
      criteria.round = (r) => Math.ceil(r);
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

/* https://www.w3.org/TR/SVG/types.html#ColorKeywords */
ColorContrastCalc.loadColorKeywords(require("./color-keywords.json"));

module.exports.ColorContrastCalc = ColorContrastCalc;
