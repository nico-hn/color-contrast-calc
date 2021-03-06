"use strict";

const expect = require("chai").expect;
const ColorUtils = require("../lib/color-utils").ColorUtils;

describe("ColorUtils", function() {
  describe("hexCodeToRgb", function() {
    const RGB_BLACK = [0, 0, 0];
    const RGB_WHITE = [255, 255, 255];

    it("expects to return [255, 255, 255] when #ffffff is passed", function() {
      expect(ColorUtils.hexCodeToRgb("#ffffff")).to.deep.equal(RGB_WHITE);
    });

    it("expects to return [0, 0, 0] when #000000 is passed", function() {
      expect(ColorUtils.hexCodeToRgb("#000000")).to.deep.equal(RGB_BLACK);
    });

    it("expects to return [255, 255, 0] when #ffff00 is passed", function() {
      expect(ColorUtils.hexCodeToRgb("#ffff00")).to.deep.equal([255, 255, 0]);
    });

    it("expects to return [255, 255, 0] when #FFFF00 is passed", function() {
      expect(ColorUtils.hexCodeToRgb("#FFFF00")).to.deep.equal([255, 255, 0]);
    });

    it("expects to return [255, 255, 0] when #ff0 is passed", function() {
      expect(ColorUtils.hexCodeToRgb("#ff0")).to.deep.equal([255, 255, 0]);
    });
  });

  describe("normalizeHexCode", function() {
    context("When prefix is true", function() {
      it("expects to return '#ffa500' when '#ffa500' is passed", function() {
        expect(ColorUtils.normalizeHexCode("#ffa500")).to.equal("#ffa500");
      });

      it("expects to return '#ffa500' when '#FFA500' is passed", function() {
        expect(ColorUtils.normalizeHexCode("#FFA500")).to.equal("#ffa500");
      });

      it("expects to return '#ffaa00' when '#fa0' is passed", function() {
        expect(ColorUtils.normalizeHexCode("#fa0")).to.equal("#ffaa00");
      });
    });

    context("When prefix is false", function() {
      it("expects to return 'ffa500' when '#ffa500' is passed", function() {
        expect(ColorUtils.normalizeHexCode("#ffa500", false)).to.equal("ffa500");
      });

      it("expects to return 'ffa500' when '#FFA500' is passed", function() {
        expect(ColorUtils.normalizeHexCode("#FFA500", false)).to.equal("ffa500");
      });

      it("expects to return 'ffaa00' when '#fa0' is passed", function() {
        expect(ColorUtils.normalizeHexCode("#fa0", false)).to.equal("ffaa00");
      });
    });
  });

  describe("rgbToHexCode", function() {
    it("expects to return #fff00 when [255, 255, 0] is passed", function() {
      expect(ColorUtils.rgbToHexCode([255, 255, 0])).to.equal("#ffff00");
    });
  });

  describe("hslToRgb", function() {
    it("expects to return [255, 0, 0] when [0, 100, 50] is passed", function() {
      expect(ColorUtils.hslToRgb([0, 100, 50])).to.deep.equal([255, 0, 0]);
    });

    it("expects to return [255, 128, 0] when [30, 100, 50] is passed", function() {
      expect(ColorUtils.hslToRgb([30, 100, 50])).to.deep.equal([255, 128, 0]);
    });

    it("expects to return [255, 255, 0] when [60, 100, 50] is passed", function() {
      expect(ColorUtils.hslToRgb([60, 100, 50])).to.deep.equal([255, 255, 0]);
    });

    it("expects to return [0, 255, 0] when [120, 100, 50] is passed", function() {
      expect(ColorUtils.hslToRgb([120, 100, 50])).to.deep.equal([0, 255, 0]);
    });

    it("expects to return [0, 0, 255] when [240, 100, 50] is passed", function() {
      expect(ColorUtils.hslToRgb([240, 100, 50])).to.deep.equal([0, 0, 255]);
    });
  });

  describe("hslToHexCode", function() {
    it("expects to return '#ff0000' when [0, 100, 50] is passed", function() {
      expect(ColorUtils.hslToHexCode([0, 100, 50])).to.deep.equal("#ff0000");
    });

    it("expects to return '#ff8000' when [30, 100, 50] is passed", function() {
      expect(ColorUtils.hslToHexCode([30, 100, 50])).to.deep.equal("#ff8000");
    });

    it("expects to return '#ffff00' when [60, 100, 50] is passed", function() {
      expect(ColorUtils.hslToHexCode([60, 100, 50])).to.deep.equal("#ffff00");
    });

    it("expects to return '#00ff00' when [120, 100, 50] is passed", function() {
      expect(ColorUtils.hslToHexCode([120, 100, 50])).to.deep.equal("#00ff00");
    });

    it("expects to return '#0000ff' when [240, 100, 50] is passed", function() {
      expect(ColorUtils.hslToHexCode([240, 100, 50])).to.deep.equal("#0000ff");
    });

    it("expects to return '#adff2f' when [83.653, 100, 59.215] is passed", function() {
      expect(ColorUtils.hslToHexCode([83.653, 100, 59.215])).to.deep.equal("#adff2f");
    });

    it("expects to return '#cd5c5c' when [0, 53, 58.2352] is passed", function() {
      expect(ColorUtils.hslToHexCode([0, 53, 58.2352])).to.deep.equal("#cd5c5c");
    });
  });

  describe("rgbToHsl", function() {
    it("expects to return [0, 100, 50] when [255, 0, 0] is passed", function() {
      expect(ColorUtils.rgbToHsl([255, 0, 0])).to.deep.equal([0, 100, 50]);
    });

    it("expects to return [60, 100, 50] when [255, 255, 0] is passed", function() {
      expect(ColorUtils.rgbToHsl([255, 255, 0])).to.deep.equal([60, 100, 50]);
    });

    it("expects to return [120, 100, 50] when [0, 255, 0] is passed", function() {
      expect(ColorUtils.rgbToHsl([0, 255, 0])).to.deep.equal([120, 100, 50]);
    });

    it("expects to return [120, 100, 25] when [0, 128, 0] is passed", function() {
      const hsl = ColorUtils.rgbToHsl([0, 128, 0]);

      expect(hsl[0]).to.equal(120);
      expect(hsl[1]).to.equal(100);
      expect(hsl[2]).to.is.closeTo(25, 0.1);
    });

    it("expects to return [180, 100, 50] when [0, 255, 255] is passed", function() {
      expect(ColorUtils.rgbToHsl([0, 255, 255])).to.deep.equal([180, 100, 50]);
    });

    it("expects to return [180, 100, 25] when [0, 128, 128] is passed", function() {
      const hsl = ColorUtils.rgbToHsl([0, 128, 128]);

      expect(hsl[0]).to.equal(180);
      expect(hsl[1]).to.equal(100);
      expect(hsl[2]).to.is.closeTo(25, 0.1);
    });

    it("expects to return [240, 100, 50] when [0, 0, 255] is passed", function() {
      expect(ColorUtils.rgbToHsl([0, 0, 255])).to.deep.equal([240, 100, 50]);
    });

    it("expects to return [0, 0, 0] when [0, 0, 0] is passed", function() {
      expect(ColorUtils.rgbToHsl([0, 0, 0])).to.deep.equal([0, 0, 0]);
    });

    it("expects to return [0, 0, 100] when [255, 255, 255] is passed", function() {
      expect(ColorUtils.rgbToHsl([255, 255, 255])).to.deep.equal([0, 0, 100]);
    });
  });

  describe("rgbToHue", function() {
    it("expects to return 0 when [255, 0, 0] is passed", function() {
      expect(ColorUtils.rgbToHue([255, 0, 0])).to.equal(0);
    });

    it("expects to return 60 when [255, 255, 0] is passed", function() {
      expect(ColorUtils.rgbToHue([255, 255, 0])).to.equal(60);
    });

    it("expects to return 120 when [0, 255, 0] is passed", function() {
      expect(ColorUtils.rgbToHue([0, 255, 0])).to.equal(120);
    });

    it("expects to return 120 when [0, 128, 0] is passed", function() {
      expect(ColorUtils.rgbToHue([0, 128, 0])).to.equal(120);
    });

    it("expects to return 180 when [0, 255, 255] is passed", function() {
      expect(ColorUtils.rgbToHue([0, 255, 255])).to.equal(180);
    });

    it("expects to return 240 when [0, 0, 255] is passed", function() {
      expect(ColorUtils.rgbToHue([0, 0, 255])).to.equal(240);
    });
  });

  describe("hexCodeToHsl", function() {
    it("expects to return [0, 100, 50] when '#ff0000' is passed", function() {
      expect(ColorUtils.hexCodeToHsl("#ff0000")).to.deep.equal([0, 100, 50]);
    });

    ["#ffffff", "#808080", "#d2691e", "#cd5c5c", "#adff2f"].forEach(function(origColor) {
      it(`expects to return a value which can be converted again to the original value ${origColor}`, function() {
        const hsl = ColorUtils.hexCodeToHsl(origColor);

        expect(ColorUtils.hslToHexCode(hsl)).to.equal(origColor);
      });
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
      expect(ColorUtils.isValidRgb([256, 165, -1])).to.be.false;
    });

    it("expects to return false for [255, 165]", function() {
      expect(ColorUtils.isValidRgb([255, 165])).to.be.false;
    });

    it("expects to return false for [255, 165.5, 0]", function() {
      expect(ColorUtils.isValidRgb([255, 165.5, 0])).to.be.false;
    });
  });

  describe("isValidHsl", function() {
    it("expects to return true for [0, 0, 0]", function() {
      expect(ColorUtils.isValidHsl([0, 0, 0])).to.be.true;
    });

    it("expects to return true for [60, 100, 50]", function() {
      expect(ColorUtils.isValidHsl([60, 100, 50])).to.be.true;
    });

    it("expects to return true for [0, 0, 100]", function() {
      expect(ColorUtils.isValidHsl([0, 0, 100])).to.be.true;
    });

    it("expects to return false for [-1, 100, 50]", function() {
      expect(ColorUtils.isValidHsl([-1, 100, 50])).to.be.false;
    });

    it("expects to return false for [361, 100, 50]", function() {
      expect(ColorUtils.isValidHsl([361, 100, 50])).to.be.false;
    });

    it("expects to return false for [60, -1, 50]", function() {
      expect(ColorUtils.isValidHsl([60, -1, 50])).to.be.false;
    });

    it("expects to return false for [60, 101, 50]", function() {
      expect(ColorUtils.isValidHsl([60, 101, 50])).to.be.false;
    });

    it("expects to return false for [60, 100, -1]", function() {
      expect(ColorUtils.isValidHsl([60, 100, -1])).to.be.false;
    });

    it("expects to return false for [60, 100, 101]", function() {
      expect(ColorUtils.isValidHsl([60, 100, 101])).to.be.false;
    });

    it("expects to return false for ['60', 100, 50]", function() {
      expect(ColorUtils.isValidHsl(["60", 100, 50])).to.be.false;
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

    it("expects to return true for '#999999'", function() {
      expect(ColorUtils.isValidHexCode("#999999")).to.be.true;
    });

    it("expects to return true for '#ff0'", function() {
      expect(ColorUtils.isValidHexCode("#ff0")).to.be.true;
    });

    it("expects to return true for 'ff0'", function() {
      expect(ColorUtils.isValidHexCode("ff0")).to.be.true;
    });

    it("expects to return false for '#101a500'", function() {
      expect(ColorUtils.isValidHexCode("#101a500")).to.be.false;
    });

    it("expects to return false for '#fga500'", function() {
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

  describe("Matrix", function() {
    const m1 = new ColorUtils.Matrix([[1, 2, 3],
                                      [2, 3, 4],
                                      [3, 4, 5]]);

    describe("add", function() {
      it("expects to add two matrices", function() {
        const m2 = new ColorUtils.Matrix([[3, 2, 1],
                                          [4, 3, 2],
                                          [5, 4, 3]]);
        const r = new ColorUtils.Matrix([[4, 4, 4],
                                         [6, 6, 6],
                                         [8, 8, 8]]);

        expect(m1.add(m2).matrix).to.deep.equal(r.matrix);
      });
    });

    describe("multiplyByScalar", function() {
      it("expects to multiply each element of a matrix a given argument", function() {
        const r = new ColorUtils.Matrix([[2, 4, 6],
                                         [4, 6, 8],
                                         [6, 8, 10]]);

        expect(m1.multiplyByScalar(2).matrix).to.deep.equal(r.matrix);
      });
    });

    describe("productByVector", function() {
      it("expects to return a vector", function() {
        const v = [2, 3, 4];
        expect(m1.productByVector(v)).to.deep.equal([20, 29, 38]);
      });
    });

    describe("multiply", function() {
      it("expects to be a shorthand method that can be used in place of .multiplyByScalar/.productByScalar", function() {
        const r = new ColorUtils.Matrix([[2, 4, 6],
                                         [4, 6, 8],
                                         [6, 8, 10]]);
        const v = [2, 3, 4];

        expect(m1.multiply(2).matrix).to.deep.equal(r.matrix);
        expect(m1.productByVector(v)).to.deep.equal([20, 29, 38]);
      });
    });
  });

  describe("HueRotateCalc", function() {
    describe("degToRad", function() {
      it("expects to return PI / 2 if 90 is passed", function() {
        const half_pi = ColorUtils.HueRotateCalc.degToRad(90);
        expect(half_pi).to.be.closeTo(1.57079, 0.001);
        expect(Math.sin(half_pi)).to.be.closeTo(1, 0.00001);
        expect(Math.cos(half_pi)).to.be.closeTo(0, 0.00001);
      });

      it("expects to return PI if 180 is passed", function() {
        const pi = ColorUtils.HueRotateCalc.degToRad(180);
        expect(pi).to.be.closeTo(3.14159, 0.001);
        expect(Math.sin(pi)).to.be.closeTo(0, 0.00001);
        expect(Math.cos(pi)).to.be.closeTo(-1, 0.00001);
      });

      it("expects to return PI * 2 if 360 is passed", function() {
        const pi2 = ColorUtils.HueRotateCalc.degToRad(360);
        expect(pi2).to.be.closeTo(6.283185, 0.00001);
        expect(Math.sin(pi2)).to.be.closeTo(0, 0.00001);
        expect(Math.cos(pi2)).to.be.closeTo(1, 0.00001);
      });
    });
  });
});
