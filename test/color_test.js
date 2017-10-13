"use strict";

const expect = require("chai").expect;
const ColorContrastCalc = require("../lib/color-contrast-calc").ColorContrastCalc;
const Color = require("../lib/color-contrast-calc").Color;

describe("Color", () => {
  const RGB_WHITE = [255, 255, 255];

  describe("static methods", function() {
    describe("newHslColor", function() {
      it("expects to return an instance with .hexCode '#ffff00' when [60, 100, 50]  is passed", function() {
        expect(Color.newHslColor([60, 100, 50]).hexCode).to.equal("#ffff00");
      });

      it("expects to return an instance with .hexCode '#ff8000' when [30, 100, 50]  is passed", function() {
        expect(Color.newHslColor([30, 100, 50]).hexCode).to.equal("#ff8000");
      });
    });
  });

  describe("hsl", function() {
    it("expects to return [60, 100, 50] when the color is yellow", function() {
      const yellow = ColorContrastCalc.getByName("yellow");
      expect(yellow.hsl).to.deep.equal([60, 100, 50]);
      expect(yellow.hsl).to.deep.equal([60, 100, 50]);
    });

    it("expects to return [300, 100, 50] when the color is fuchsia", function() {
      const fuchsia = ColorContrastCalc.getByName("fuchsia");
      expect(fuchsia.hsl).to.deep.equal([300, 100, 50]);
      expect(fuchsia.hsl).to.deep.equal([300, 100, 50]);
    });

    it("expects to return [0, 100, 50] when the color is black", function() {
      const black = ColorContrastCalc.getByName("black");
      expect(black.hsl).to.deep.equal([0, 0, 0]);
    });

    it("expects to return [0, 0, 100] when the color is white", function() {
      const white = ColorContrastCalc.getByName("white");
      expect(white.hsl).to.deep.equal([0, 0, 100]);
    });
  });

  describe("new", function() {
    const rgb_yellow = [255, 255, 0];

    it("expects to generate an instance with rgb and name properties", function() {
      const yellow = new Color(rgb_yellow, "yellow");
      expect(yellow.rgb).to.deep.equal(rgb_yellow);
      expect(yellow.relativeLuminance).to.be.closeTo(0.9278, 0.01);
      expect(yellow.name).to.equal("yellow");
      expect(yellow.hexCode).to.equal("#ffff00");
    });

    it("expects to generate an instance with rgb in hex notation and name properties", function() {
      const yellow = new Color("#ffff00", "yellow");
      expect(yellow.rgb).to.deep.equal(rgb_yellow);
      expect(yellow.relativeLuminance).to.be.closeTo(0.9278, 0.01);
      expect(yellow.name).to.equal("yellow");
    });

    it("expects to assign the value of .hexCode to .name if no name is specified", function() {
      const yellow = new Color(rgb_yellow);
      expect(yellow.rgb).to.deep.equal(rgb_yellow);
      expect(yellow.name).to.equal("#ffff00");
    });

    it("properties of a returned object are frozen", function() {
      const yellow = new Color(rgb_yellow);
      expect(Object.isFrozen(yellow.rgb)).to.be.true;
      expect(Object.isFrozen(yellow.relativeLuminance)).to.be.true;
      expect(Object.isFrozen(yellow.name)).to.be.true;
      expect(Object.isFrozen(yellow.hexCode)).to.be.true;
    });
  });

  describe("contrastRatioAgainst", function() {
    const rgb = [127, 127, 32];
    const contrast = 4.23;

    it("expects to return 4.23 when own color is [127, 127, 32] and the other color is white", function() {
      const color = new Color(rgb);
      expect(color.contrastRatioAgainst(RGB_WHITE)).to.be.closeTo(contrast, 0.01);
    });

    it("expects to return 4.23 when own color is [127, 127, 32] and the other color is #ffffff", function() {
      const color = new Color(rgb);
      expect(color.contrastRatioAgainst("#ffffff")).to.be.closeTo(contrast, 0.01);
    });

    it("expects to return 4.23 when own color is [127, 127, 32] and the other is an instance of ColorContrastCalc which represents white", function() {
      const color = new Color(rgb);
      const white = new Color([255, 255, 255]);
      expect(color.contrastRatioAgainst(white)).to.be.closeTo(contrast, 0.01);
      expect(white.contrastRatioAgainst(color)).to.be.closeTo(contrast, 0.01);
    });
  });
});

