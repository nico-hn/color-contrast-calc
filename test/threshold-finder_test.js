"use strict";

const expect = require("chai").expect;
const LightnessFinder = require("../lib/threshold-finder").LightnessFinder;
const BrightnessFinder = require("../lib/threshold-finder").BrightnessFinder;
const Checker = require("../lib/contrast-checker").ContrastChecker;
const Calc = require("../lib/color-contrast-calc").ColorContrastCalc;

const higherLuminanceThan = (mainRgb, otherRgb) => {
  const mainLum = Checker.relativeLuminance(mainRgb);
  const otherLum = Checker.relativeLuminance(otherRgb);
  return mainLum > otherLum;
};

describe("LightnessFinder", function() {
  const orange = Calc.colorFrom("orange").rgb;
  const blueviolet = Calc.colorFrom("blueviolet").rgb;
  const blue = Calc.colorFrom("blue").rgb;
  const black = Calc.colorFrom("black").rgb;
  const white = Calc.colorFrom("white").rgb;
  const darkgreen = Calc.colorFrom("darkgreen").rgb;
  const green = Calc.colorFrom("green").rgb;
  const springgreen = Calc.colorFrom("springgreen").rgb;
  const mintcream = Calc.colorFrom("mintcream").rgb;
  const yellow = Calc.colorFrom("yellow").rgb;
  const fuchsia = Calc.colorFrom("fuchsia").rgb;
  const azure = Calc.colorFrom("azure").rgb;


  describe("binarySearchWidth", function() {
    it("expects to return a smaller value for each iteration", function() {
      let ds = [];
      for (let d of LightnessFinder.binarySearchWidth(100, 1)) {
        ds.push(d);
      }

      expect(ds).to.deep.equal([50, 25, 12.5, 6.25, 3.125, 1.5625]);
    });
  });

  describe("find", function() {
    context("when the required level is A", function() {
      it("expects to return a darker color when azure is passed to fuchsia", function() {
        const newRgb = LightnessFinder.find(fuchsia, azure, "A");
        const ratio = Checker.contrastRatio(fuchsia, newRgb);

        expect(higherLuminanceThan(azure, fuchsia)).to.be.true;
        expect(higherLuminanceThan(azure, newRgb)).to.be.true;
        expect(ratio).to.be.above(3.0);
        expect(ratio).to.be.closeTo(3.0, 0.5);
        expect(newRgb).to.deep.equal([233, 255, 255]);
      });

      it("expects to return a lighter green when both colors are darkgreen", function() {
        const contrast_with_white = Checker.contrastRatio(darkgreen, white);
        const contrast_with_black = Checker.contrastRatio(darkgreen, black);
        const newRgb = LightnessFinder.find(darkgreen, darkgreen, "A");
        const ratio = Checker.contrastRatio(darkgreen, newRgb);

        expect(Checker.isLightColor(darkgreen)).to.be.false;
        expect(contrast_with_white).to.be.greaterThan(contrast_with_black);
        expect(higherLuminanceThan(newRgb, darkgreen)).to.be.true;
        expect(ratio).to.be.above(3.0);
        expect(ratio).to.be.closeTo(3.0, 0.1);
        expect(newRgb).to.deep.equal([0, 192, 0]);
      });
    });

    context("when the required level is AA", function() {
      it("expects to return a darker orange when orange is passed to white", function() {
        const newRgb = LightnessFinder.find(white, orange, "AA");
        const ratio = Checker.contrastRatio(white, newRgb);

        expect(ratio).to.be.above(4.5);
        expect(ratio).to.be.closeTo(4.5, 0.1);
        expect(newRgb).to.deep.equal([165, 106, 0]);
      });

      it("expects to return a darker green when green is passed to white", function() {
        const newRgb = LightnessFinder.find(white, green, "AA");
        const ratio = Checker.contrastRatio(white, newRgb);

        expect(ratio).to.be.above(4.5);
        expect(ratio).to.be.closeTo(4.5, 0.1);
        expect(newRgb).to.deep.equal([0, 138, 0]);
      });

      it("expects to return a lighter orange when orange is passed to blueviolet", function() {
        const newRgb = LightnessFinder.find(blueviolet, orange, "AA");
        const ratio = Checker.contrastRatio(blueviolet, newRgb);

        expect(ratio).to.be.above(4.5);
        expect(ratio).to.be.closeTo(4.5, 0.1);
        expect(newRgb).to.deep.equal([255, 220, 154]);
      });

      it("expects to return a darker green when both colors are springgreen", function() {
        const contrast_with_white = Checker.contrastRatio(springgreen, white);
        const contrast_with_black = Checker.contrastRatio(springgreen, black);
        const newRgb = LightnessFinder.find(springgreen, springgreen, "AA");
        const ratio = Checker.contrastRatio(springgreen, newRgb);

        expect(Checker.isLightColor(springgreen)).to.be.true;
        expect(contrast_with_white).to.be.lessThan(contrast_with_black);
        expect(higherLuminanceThan(newRgb, springgreen)).to.be.false;
        expect(ratio).to.be.above(4.5);
        expect(ratio).to.be.closeTo(4.5, 0.1);
        expect(newRgb).to.deep.equal([0, 114, 57]);
      });

      it("expects to return white when yellow is passed to orange", function() {
        const newRgb = LightnessFinder.find(orange, yellow, "AA");
        const ratio = Checker.contrastRatio(orange, newRgb);

        expect(ratio).to.be.lessThan(4.5);
        expect(newRgb).to.deep.equal(white);
      });

      it("expects to return white when mintcream is passed to yellow", function() {
        const newRgb = LightnessFinder.find(yellow, mintcream, "AA");
        const ratio = Checker.contrastRatio(yellow, newRgb);

        expect(ratio).to.be.lessThan(4.5);
        expect(newRgb).to.deep.equal(white);
      });
    });

    context("when the required level is AAA", function() {
      it("expects to return a darker orange when orange is passed to white", function() {
        const newRgb = LightnessFinder.find(white, green, "AAA");
        const ratio = Checker.contrastRatio(white, newRgb);

        expect(ratio).to.be.above(7.0);
        expect(ratio).to.be.closeTo(7.0, 0.1);
        expect(newRgb).to.deep.equal([0, 104, 0]);
      });

      it("expects to return a darker green when green is passed to white", function() {
        const newRgb = LightnessFinder.find(white, orange, "AAA");
        const ratio = Checker.contrastRatio(white, newRgb);

        expect(ratio).to.be.above(7.0);
        expect(ratio).to.be.closeTo(7.0, 0.1);
        expect(newRgb).to.deep.equal([123, 80, 0]);
      });

      it("expects to return black when blue is passed to green", function() {
        const newRgb = LightnessFinder.find(green, blue, "AA");
        const ratio = Checker.contrastRatio(green, newRgb);

        expect(ratio).to.be.lessThan(7.0);
        expect(newRgb).to.deep.equal(black);
      });
    });

    context("when the required level is specified by a ratio", function() {
      it("expects to return a darker orange when orange is passed to white", function() {
        const newRgb = LightnessFinder.find(white, orange, 6.5);
        const ratio = Checker.contrastRatio(white, newRgb);

        expect(ratio).to.be.above(6.5);
        expect(ratio).to.be.closeTo(6.5, 0.1);
        expect(newRgb).to.deep.equal([130, 84, 0]);
      });

      it("expects to return a darker green when green is passed to white", function() {
        const newRgb = LightnessFinder.find(white, green, 6.5);
        const ratio = Checker.contrastRatio(white, newRgb);

        expect(ratio).to.be.above(6.5);
        expect(ratio).to.be.closeTo(6.5, 0.1);
        expect(newRgb).to.deep.equal([0, 110, 0]);
      });

      it("expects to return black when blue is passed to green", function() {
        const newRgb = LightnessFinder.find(green, blue, 6.5);
        const ratio = Checker.contrastRatio(green, newRgb);

        expect(ratio).to.be.lessThan(6.5);
        expect(newRgb).to.deep.equal(black);
      });
    });
  });
});

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
