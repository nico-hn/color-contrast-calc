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
    const targetRatio = Checker.levelToRatio(level);

    if (this.shouldScanDarkerSide(fixedRgb, otherRgb)) {
      return new ToDarkerSide(targetRatio, fixedRgb);
    } else {
      return new ToBrighterSide(targetRatio, fixedRgb);
    }
  }

  constructor(targetRatio, fixedRgb) {
    this.targetRatio = targetRatio;
    this.fixedLuminance = Checker.relativeLuminance(fixedRgb);
  }

  hasSufficientContrast(rgb) {
    return this.contrastRatio(rgb) >= this.targetRatio;
  }

  contrastRatio(rgb) {
    const luminance = Checker.relativeLuminance(rgb);
    return Checker.luminanceToContrastRatio(this.fixedLuminance,
                                            luminance);
  }
}

/** @private */
class ToDarkerSide extends SearchCriteria {
  round(r) {
    return Math.floor(r * 10 ) / 10;
  }

  incrementCondition(contrastRatio) {
    return contrastRatio > this.targetRatio;
  }
}

/** @private */
class ToBrighterSide extends SearchCriteria {
  round(r) {
    return Math.ceil(r * 10) / 10;
  }

  incrementCondition(contrastRatio) {
    return this.targetRatio > contrastRatio;
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
    let lastSufficientRatio = null;

    for (let d of this.binarySearchWidth(initWidth, 0.01)) {
      const newRgb = this.rgbWithRatio(otherColor, r);
      const newRatio = criteria.contrastRatio(newRgb);

      if (criteria.hasSufficientContrast(newRgb)) { lastSufficientRatio = r; }
      if (newRatio === criteria.targetRatio) { break; }
      r += criteria.incrementCondition(newRatio) ? d : -d;
    }

    return [r, lastSufficientRatio];
  }

  /**
   * @private
   */
  static rgbWithBetterRatio(color, criteria, r, lastSufficientRatio) {
    const nearestRgb = this.rgbWithRatio(color, r);

    if (lastSufficientRatio && ! criteria.hasSufficientContrast(nearestRgb)) {
      return this.rgbWithRatio(color, lastSufficientRatio);
    }

    return nearestRgb;
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

    const [r, lastSufficientRatio] = this.findRatio(otherHsl, criteria,
                                                    (max + min) / 2, max - min);

    return this.rgbWithBetterRatio(otherHsl, criteria, r, lastSufficientRatio);
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
  static hasSufficientContrast(fixedLuminance, rgb, criteria) {
    const luminance = Checker.relativeLuminance(rgb);
    const ratio = Checker.luminanceToContrastRatio(fixedLuminance, luminance);
    return ratio >= criteria.targetRatio;
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