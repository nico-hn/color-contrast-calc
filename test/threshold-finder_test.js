"use strict";

const expect = require("chai").expect;
const BrightnessFinder = require("../lib/threshold-finder").BrightnessFinder;
const Checker = require("../lib/contrast-checker").ContrastChecker;
const Calc = require("../lib/color-contrast-calc").ColorContrastCalc;

describe("BrightnessFinder", function() {
  const orange = Calc.colorFrom("orange").rgb;
  const blueviolet = Calc.colorFrom("blueviolet").rgb;
  const blue = Calc.colorFrom("blue").rgb;
  const brown = Calc.colorFrom("brown").rgb;
  const black = Calc.colorFrom("black").rgb;
  const white = Calc.colorFrom("white").rgb;
  const darkgreen = Calc.colorFrom("darkgreen").rgb;
  const green = Calc.colorFrom("green").rgb;
  const mintcream = Calc.colorFrom("mintcream").rgb;
  const yellow = Calc.colorFrom("yellow").rgb;
  const springgreen = Calc.colorFrom("springgreen").rgb;
  const fuchsia = Calc.colorFrom("fuchsia").rgb;
  const azure = Calc.colorFrom("azure").rgb;

  describe("find", function() {
    it("expects to return a darker orange if orange is passed", function() {
      const threshold = BrightnessFinder.find(orange, orange);
      const ratio = Checker.contrastRatio(orange, threshold);

      expect(Checker.contrastRatio(orange, orange)).to.be.below(4.5);
      expect(ratio).to.be.above(4.5);
      expect(ratio).to.be.closeTo(4.5, 0.5);
      expect(threshold).to.deep.equal([103, 66, 0]);
    });

    it("expects to return a more darker color when a darker color is passed", function() {
      const threshold = BrightnessFinder.find(orange, blueviolet);
      const ratio = Checker.contrastRatio(orange, threshold);

      expect(Checker.contrastRatio(orange, blueviolet)).to.be.below(4.5);
      expect(ratio).to.be.above(4.5);
      expect(ratio).to.be.closeTo(4.5, 0.5);
      expect(threshold).to.deep.equal([103, 32, 169]);
    });

    it("expects to return a brighter orange if blueviolet is combined with orange", function() {
      const threshold = BrightnessFinder.find(blueviolet, orange);
      const ratio = Checker.contrastRatio(blueviolet, threshold);

      expect(Checker.contrastRatio(blueviolet, orange)).to.be.below(4.5);
      expect(ratio).to.be.above(4.5);
      expect(ratio).to.be.closeTo(4.5, 0.5);
      expect(threshold).to.deep.equal([255, 224, 0]);
    });

    it("expects to return a brigher color if brown is passed to brown", function() {
      const threshold = BrightnessFinder.find(brown, brown);
      const ratio = Checker.contrastRatio(brown, threshold);

      expect(Checker.contrastRatio(brown, black)).to.be.below(4.5);
      expect(ratio).to.be.above(4.5);
      expect(ratio).to.be.closeTo(4.5, 0.5);
      expect(threshold).to.deep.equal([255, 190, 190]);
    });

    it("expects to return a darker green if darkgreen is passed to white - AA", function() {
      const threshold = BrightnessFinder.find(white, darkgreen);
      const ratio = Checker.contrastRatio(white, threshold);

      expect(ratio).to.be.above(4.5);
      expect(ratio).to.be.closeTo(4.5, 0.5);
    });

    it("expects to return a darker green if darkgreen is passed to white - AA", function() {
      const threshold = BrightnessFinder.find(white, darkgreen, "AAA");
      const ratio = Checker.contrastRatio(white, threshold);

      expect(ratio).to.be.above(7.0);
      expect(ratio).to.be.closeTo(7.0, 0.5);
    });

    it("expects to return black for AAA if blue is passed to green", function() {
      const newColor = BrightnessFinder.find(green, blue, "AAA");

      expect(Checker.contrastRatio(newColor, black)).to.be.below(7.0);
      expect(newColor).to.deep.equal(black);
    });

    it("expects to return white when mintcream is passed to yellow", function() {
      const a = BrightnessFinder.find(yellow, mintcream, "A");
      const aa = BrightnessFinder.find(yellow, mintcream, "AA");
      const aaa = BrightnessFinder.find(yellow, mintcream, "AAA");

      expect(BrightnessFinder.calcUpperRatioLimit(mintcream)).to.equal(105);
      expect(a).to.deep.equal(white);
      expect(aa).to.deep.equal(white);
      expect(aaa).to.deep.equal(white);
    });

    it("expects to return darker green when springgreen is passed to green", function() {
      const newColor = BrightnessFinder.find(green, springgreen, "A");
      const springgreenLum = Checker.relativeLuminance(springgreen);
      const newLum = Checker.relativeLuminance(newColor);
      const ratio = Checker.contrastRatio(green, newColor);

      expect(springgreenLum).to.be.greaterThan(newLum);
      expect(ratio).to.be.above(3.0);
      expect(ratio).to.be.closeTo(3.0, 0.5);
    });

    it("expects to return a darker color when azure is passed to fuchsia", function() {
      const threshold = BrightnessFinder.find(fuchsia, azure, "A");
      const azureLum = Checker.relativeLuminance(azure);
      const newLum = Checker.relativeLuminance(threshold);
      const ratio = Checker.contrastRatio(fuchsia, threshold);

      expect(azureLum).to.be.greaterThan(newLum);
      expect(ratio).to.be.above(3.0);
      expect(ratio).to.be.closeTo(3.0, 0.5);
    });
  });

  describe("calcUpperRatioLimit", function() {
    it("expects to return 155 for orange", function() {
      expect(BrightnessFinder.calcUpperRatioLimit(orange)).to.equal(155);
    });

    it("expects to return 594 for blueviolet", function() {
      expect(BrightnessFinder.calcUpperRatioLimit(blueviolet)).to.equal(594);
    });

    it("expects to return 100 for black", function() {
      expect(BrightnessFinder.calcUpperRatioLimit(black)).to.equal(100);
    });
  });
});
