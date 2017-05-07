"use strict";

class ColorContrastCalc {
  static tristimulusValue(primaryColor, base = 255) {
    const s = primaryColor / base;
    if (s <= 0.03928) {
      return s / 12.92;
    } else {
      return Math.pow((s + 0.055) / 1.055, 2.4);
    }
  }

  static relativeLuminance(rgb = [255, 255, 255]) {
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
}

module.exports.ColorContrastCalc = ColorContrastCalc;
