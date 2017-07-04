"use strict";

const expect = require("chai").expect;
const ColorUtils = require("../lib/color-utils").ColorUtils;

describe("ColorUtils", function() {
  describe("hexCodeToDecimal", function() {
    const RGB_BLACK = [0, 0, 0];
    const RGB_WHITE = [255, 255, 255];

    it("expects to return [255, 255, 255] when #ffffff is passed", function() {
      expect(ColorUtils.hexCodeToDecimal("#ffffff")).to.deep.equal(RGB_WHITE);
    });

    it("expects to return [0, 0, 0] when #000000 is passed", function() {
      expect(ColorUtils.hexCodeToDecimal("#000000")).to.deep.equal(RGB_BLACK);
    });

    it("expects to return [255, 255, 0] when #ffff00 is passed", function() {
      expect(ColorUtils.hexCodeToDecimal("#ffff00")).to.deep.equal([255, 255, 0]);
    });

    it("expects to return [255, 255, 0] when #FFFF00 is passed", function() {
      expect(ColorUtils.hexCodeToDecimal("#FFFF00")).to.deep.equal([255, 255, 0]);
    });

    it("expects to return [255, 255, 0] when #ff0 is passed", function() {
      expect(ColorUtils.hexCodeToDecimal("#ff0")).to.deep.equal([255, 255, 0]);
    });
  });

  describe("normalizeHexCode", function() {
    it("expects to return 'ffa500' when '#ffa500' is passed", function() {
      expect(ColorUtils.normalizeHexCode("#ffa500")).to.equal("ffa500");
    });

    it("expects to return 'FFA500' when '#FFA500' is passed", function() {
      expect(ColorUtils.normalizeHexCode("#FFA500")).to.equal("ffa500");
    });

    it("expects to return 'ffaa00' when '#fa0' is passed", function() {
      expect(ColorUtils.normalizeHexCode("#fa0")).to.equal("ffaa00");
    });
  });

  describe("decimalToHexCode", function() {
    it("expects to return #fff00 when [255, 255, 0] is passed", function() {
      expect(ColorUtils.decimalToHexCode([255, 255, 0])).to.equal("#ffff00");
    });
  });

  describe("decimalRound", function() {
    it("expects to return 3.14 when 3.14159 and 2 are passed", function() {
      expect(ColorUtils.decimalRound(3.14159, 2)).to.equal(3.14);
    });

    it("expects to return 3.1416 when 3.14159 and 4 are passed", function() {
      expect(ColorUtils.decimalRound(3.14159, 4)).to.equal(3.1416);
    });
  });

  describe("isValidRgb", function() {
    it("expects to return true for [255, 165, 0]", function() {
      expect(ColorUtils.isValidRgb([255, 165, 0])).to.be.true;
    });

    it("expects to return false for [256, 165, 0]", function() {
      expect(ColorUtils.isValidRgb([256, 165, 0])).to.be.false;
    });

    it("expects to return false for [255, 165, -1]", function() {
      expect(ColorUtils.isValidRgb([256, 165, 0])).to.be.false;
    });

    it("expects to return false for [255, 165]", function() {
      expect(ColorUtils.isValidRgb([255, 165])).to.be.false;
    });

    it("expects to return false for [255, 165.5, 0]", function() {
      expect(ColorUtils.isValidRgb([255, 165.5, 0])).to.be.false;
    });
  });

  describe("isValidHexCode", function() {
    it("expects to return true for '#ffa500'", function() {
      expect(ColorUtils.isValidHexCode("#ffa500")).to.be.true;
    });

    it("expects to return true for '#FFA500'", function() {
      expect(ColorUtils.isValidHexCode("#FFA500")).to.be.true;
    });

    it("expects to return true for 'ffa500'", function() {
      expect(ColorUtils.isValidHexCode("ffa500")).to.be.true;
    });

    it("expects to return true for 'ffa500'", function() {
      expect(ColorUtils.isValidHexCode("#999999")).to.be.true;
    });

    it("expects to return true for '#ff0'", function() {
      expect(ColorUtils.isValidHexCode("#ff0")).to.be.true;
    });

    it("expects to return true for '#ff0'", function() {
      expect(ColorUtils.isValidHexCode("ff0")).to.be.true;
    });

    it("expects to return true for '#101a500'", function() {
      expect(ColorUtils.isValidHexCode("#101a500")).to.be.false;
    });

    it("expects to return true for '#fga500'", function() {
      expect(ColorUtils.isValidHexCode("#fga500")).to.be.false;
    });
  });

  describe("isSameHexColor", function() {
    const upperYellow = "#FFFF00";
    const lowerYellow = "#ffff00";
    const shortYellow = "#ff0";
    const red = "#ff0000";

    it("expects to return true if the only difference of two colors are their letter case", function() {
      expect(ColorUtils.isSameHexColor(upperYellow, lowerYellow)).to.be.true;
    });

    it("expects to return true if one of given colors is a shorthand form of the other", function() {
      expect(ColorUtils.isSameHexColor(lowerYellow, shortYellow)).to.be.true;
    });

    it("expects to return false if given two colors are different", function() {
      expect(ColorUtils.isSameHexColor(lowerYellow, red)).to.be.false;
    });
  });

  describe("isSameRgbColor", function() {
    const yellow1 = [255, 255, 0];
    const yellow2 = [255, 255, 0];
    const red = [255, 0, 0];
    const lime = [0, 255, 0];
    const blue = [0, 0, 255];

    it("expects to return true RGB values represent a same color", function() {
      expect(ColorUtils.isSameRgbColor(yellow1, yellow2)).to.be.true;
    });

    it("expects to return true the two arguments are the same RGB value", function() {
      expect(ColorUtils.isSameRgbColor(yellow1, yellow1)).to.be.true;
    });

    it("expects to return false when yellow1 and red are passed", function() {
      expect(ColorUtils.isSameRgbColor(yellow1, red)).to.be.false;
    });

    it("expects to return false when yellow1 and lime are passed", function() {
      expect(ColorUtils.isSameRgbColor(yellow1, lime)).to.be.false;
    });

    it("expects to return false when yellow1 and blue are passed", function() {
      expect(ColorUtils.isSameRgbColor(yellow1, blue)).to.be.false;
    });
  });

  describe("isString", function() {
    it("expects to return true when 'string' is passed", function() {
      expect(ColorUtils.isString("string")).to.be.true;
    });

    it("expects to return false when 123 is passed", function() {
      expect(ColorUtils.isString(123)).to.be.false;
    });

    it("expects to return false when ['string'] is passed", function() {
      expect(ColorUtils.isString(["string"])).to.be.false;
    });
  });

  describe("isUpperCase", function() {
    it("expects to return true when 'U' is passed", function() {
      expect(ColorUtils.isUpperCase("U")).to.be.true;
    });

    it("expects to return false when 'u' is passed", function() {
      expect(ColorUtils.isUpperCase("u")).to.be.false;
    });
  });
});
