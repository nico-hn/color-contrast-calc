"use strict";

const expect = require("chai").expect;
const ColorContrastCalc = require("../lib/color-contrast-calc").ColorContrastCalc;
const Color = require("../lib/color-contrast-calc").Color;

describe("Color", () => {
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
});

