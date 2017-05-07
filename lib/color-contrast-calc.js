"use strict";

class ColorContrastCalc {
  constructor(rgb, name = null) {
    const ownClass = this.constructor;
    this.rgb = ownClass.isString(rgb) ? ownClass.hexNotationToDecimal(rgb) : rgb;
    this.relativeLuminance = ownClass.relativeLuminance(this.rgb);
    this.name = name === null ? ownClass.decimalToHexNotation(this.rgb) : name;
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
    let h = hexString.startsWith("#") ? hexString.replace("#", "") : hexString;
    return [0, 2, 4].map(s => h.substr(s, 2))
      .map(primaryColor => Number.parseInt(primaryColor, 16));
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

  contrastRatioAgainst(color) {
    if (!(color instanceof ColorContrastCalc)) {
      return this.constructor.contrastRatio(this.rgb, color);
    }

    const [l1, l2] = [this.relativeLuminance, color.relativeLuminance]
          .sort((s, o) => o - s);
    return (l1 + 0.05) / (l2 + 0.05);
  }
}

module.exports.ColorContrastCalc = ColorContrastCalc;
