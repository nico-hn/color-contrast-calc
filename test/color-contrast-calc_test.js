"use strict";

const expect = require("chai").expect;
const ColorContrastCalc = require("../lib/color-contrast-calc").ColorContrastCalc;

describe("ColorContrastCalc", () => {
  const MIN_CONTRAST = 1.0;
  const MAX_CONTRAST = 21.0;
  const RGB_BLACK = [0, 0, 0];
  const RGB_WHITE = [255, 255, 255];

  it("canary test", function() {
    expect(ColorContrastCalc).to.be.an("function");
  });

  describe("static methods", function() {
    describe("contrastRatio", () => {
      it("expects to return MAX_CONTRAST when white and black are passed", function() {
        expect(ColorContrastCalc.contrastRatio(RGB_BLACK, RGB_WHITE)).to.equal(MAX_CONTRAST);
      });

      it("expects to return MIN_CONTRAST when white and white are passed", function() {
        expect(ColorContrastCalc.contrastRatio(RGB_WHITE, RGB_WHITE)).to.equal(MIN_CONTRAST);

      });

      it("expects to return 4.23 when white and [127, 127, 32] are passed", function() {
        expect(ColorContrastCalc.contrastRatio(RGB_WHITE, [127, 127, 32])).to.be.closeTo(4.23, 0.01);
      });

      it("expects to return 4.23 when #ffffff and #7f7f20 are passed", function() {
        expect(ColorContrastCalc.contrastRatio("#ffffff", "#7f7f20")).to.be.closeTo(4.23, 0.01);
      });
    });

    describe("hexNotationToDecimal", function() {
      it("expects to return [255, 255, 255] when #ffffff is passed", function() {
        expect(ColorContrastCalc.hexNotationToDecimal("#ffffff")).to.deep.equal(RGB_WHITE);
      });

      it("expects to return [0, 0, 0] when #000000 is passed", function() {
        expect(ColorContrastCalc.hexNotationToDecimal("#000000")).to.deep.equal(RGB_BLACK);
      });

      it("expects to return [255, 255, 0] when #ffff00 is passed", function() {
        expect(ColorContrastCalc.hexNotationToDecimal("#ffff00")).to.deep.equal([255, 255, 0]);
      });

      it("expects to return [255, 255, 0] when #FFFF00 is passed", function() {
        expect(ColorContrastCalc.hexNotationToDecimal("#FFFF00")).to.deep.equal([255, 255, 0]);
      });

      it("expects to return [255, 255, 0] when #ff0 is passed", function() {
        expect(ColorContrastCalc.hexNotationToDecimal("#ff0")).to.deep.equal([255, 255, 0]);
      });
    });

    describe("decimalToHexCode", function() {
      it("expects to return #fff00 when [255, 255, 0] is passed", function() {
        expect(ColorContrastCalc.decimalToHexCode([255, 255, 0])).to.equal("#ffff00");
      });
    });

    describe("isValidRgb", function() {
      it("expects to return true for [255, 165, 0]", function() {
        expect(ColorContrastCalc.isValidRgb([255, 165, 0])).to.be.true;
      });

      it("expects to return false for [256, 165, 0]", function() {
        expect(ColorContrastCalc.isValidRgb([256, 165, 0])).to.be.false;
      });

      it("expects to return false for [255, 165, -1]", function() {
        expect(ColorContrastCalc.isValidRgb([256, 165, 0])).to.be.false;
      });

      it("expects to return false for [255, 165]", function() {
        expect(ColorContrastCalc.isValidRgb([255, 165])).to.be.false;
      });

      it("expects to return false for [255, 165.5, 0]", function() {
        expect(ColorContrastCalc.isValidRgb([255, 165.5, 0])).to.be.false;
      });
    });

    describe("isValidHexCode", function() {
      it("expects to return true for '#ffa500'", function() {
        expect(ColorContrastCalc.isValidHexCode("#ffa500")).to.be.true;
      });

      it("expects to return true for '#FFA500'", function() {
        expect(ColorContrastCalc.isValidHexCode("#FFA500")).to.be.true;
      });

      it("expects to return true for 'ffa500'", function() {
        expect(ColorContrastCalc.isValidHexCode("ffa500")).to.be.true;
      });

      it("expects to return true for 'ffa500'", function() {
        expect(ColorContrastCalc.isValidHexCode("#999999")).to.be.true;
      });

      it("expects to return true for '#ff0'", function() {
        expect(ColorContrastCalc.isValidHexCode("#ff0")).to.be.true;
      });

      it("expects to return true for '#ff0'", function() {
        expect(ColorContrastCalc.isValidHexCode("ff0")).to.be.true;
      });

      it("expects to return true for '#101a500'", function() {
        expect(ColorContrastCalc.isValidHexCode("#101a500")).to.be.false;
      });

      it("expects to return true for '#fga500'", function() {
        expect(ColorContrastCalc.isValidHexCode("#fga500")).to.be.false;
      });
    });

    describe("NAMED_COLORS", function() {
      it("expects to contain predefined instances of ColorContrastCalc", function() {
        expect(ColorContrastCalc.NAMED_COLORS[0]).to.be.instanceof(ColorContrastCalc);
        expect(ColorContrastCalc.NAMED_COLORS[0].name).to.equal("aliceblue");
        expect(ColorContrastCalc.NAMED_COLORS[0].rgb).to.deep.equal([240, 248, 255]);
        expect(ColorContrastCalc.NAMED_COLORS[0].hexCode).to.deep.equal("#f0f8ff");
        expect(ColorContrastCalc.NAMED_COLORS.slice(-1)[0].name).to.equal("yellowgreen");
        expect(ColorContrastCalc.NAMED_COLORS.slice(-1)[0].rgb).to.deep.equal([154, 205, 50]);
        expect(ColorContrastCalc.NAMED_COLORS.slice(-1)[0].hexCode).to.deep.equal("#9acd32");
      });
    });

    describe("NAME_TO_COLOR", function() {
      it("expects to return a corresponding instance for a passed color name", function() {
        const black = ColorContrastCalc.NAME_TO_COLOR.get("black");
        const white = ColorContrastCalc.NAME_TO_COLOR.get("white");
        expect(black.name).to.equal("black");
        expect(white.name).to.equal("white");
      });
    });

    describe("HEX_TO_COLOR", function() {
      it("expects to return a corresponding instance for a passed hex color", function() {
        const black = ColorContrastCalc.HEX_TO_COLOR.get("#000000");
        const white = ColorContrastCalc.HEX_TO_COLOR.get("#ffffff");
        expect(black.name).to.equal("black");
        expect(white.name).to.equal("white");
      });
    });

    describe("WEB_SAFE_COLORS", function() {
      it("expects to contain 216 items", function() {
        expect(ColorContrastCalc.WEB_SAFE_COLORS.length).to.equal(216);
      });

      it("expects to be an array whose first element is black", function() {
        expect(ColorContrastCalc.WEB_SAFE_COLORS[0].hexCode).to.equal("#000000");
        expect(ColorContrastCalc.WEB_SAFE_COLORS[0].name).to.equal("black");
      });

      it("expects to be an array whose last element is white", function() {
        const webSafeColors = ColorContrastCalc.WEB_SAFE_COLORS;
        expect(webSafeColors.length).to.equal(216);
        expect(webSafeColors[webSafeColors.length - 1].hexCode).to.equal("#ffffff");
        expect(webSafeColors[webSafeColors.length - 1].name).to.equal("white");
      });
    });

    describe("BLACK", function() {
      it("expects to return an instance corresponding to black", function() {
        expect(ColorContrastCalc.BLACK.name).to.equal("black");
      });
    });

    describe("WHITE", function() {
      it("expects to return an instance corresponding to white", function() {
        expect(ColorContrastCalc.WHITE.name).to.equal("white");
      });
    });

    describe("GRAY", function() {
      it("expects to return an instance corresponding to #808080", function() {
        expect(ColorContrastCalc.GRAY.hexCode).to.equal("#808080");
      });
    });

    describe("getByName", function() {
      it("expects to return yellow", function() {
        expect(ColorContrastCalc.getByName("yellow").rgb).to.deep.equal([255, 255, 0]);
      });
    });

    describe("getByHexCode", function() {
      it("expects to return yellow", function() {
        expect(ColorContrastCalc.getByHexCode("#ffff00").name).to.equal("yellow");
      });

      it("expects to return a new instance if a given hex code is not registered", function() {
        expect(ColorContrastCalc.getByHexCode("#f3f2f1").name).to.equal("#f3f2f1");
      });
    });

    describe("binarySearchRange", function() {
      it("expects to return a smaller value for each iteration", function() {
        let ds = [];
        for (let d of ColorContrastCalc.binarySearchWidth(100, 1)) {
          ds.push(d);
        }

        expect(ds).to.deep.equal([100, 50, 25, 12.5, 6.25, 3.125, 1.5625]);
      });
    });
  });

  describe("Matrix", function() {
    const m1 = new ColorContrastCalc.Matrix([[1, 2, 3],
                                             [2, 3, 4],
                                             [3, 4, 5]]);

    describe("add", function() {
      it("expects to add two matrices", function() {
        const m2 = new ColorContrastCalc.Matrix([[3, 2, 1],
                                                 [4, 3, 2],
                                                 [5, 4, 3]]);
        const r = new ColorContrastCalc.Matrix([[4, 4, 4],
                                                [6, 6, 6],
                                                [8, 8, 8]]);

        expect(m1.add(m2).matrix).to.deep.equal(r.matrix);
      });
    });

    describe("multiplyByScalar", function() {
      it("expects to multiply each element of a matrix a given argument", function() {
        const r = new ColorContrastCalc.Matrix([[2, 4, 6],
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
        const r = new ColorContrastCalc.Matrix([[2, 4, 6],
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
        const half_pi = ColorContrastCalc.HueRotateCalc.degToRad(90);
        expect(half_pi).to.be.closeTo(1.57079, 0.001);
        expect(Math.sin(half_pi)).to.be.closeTo(1, 0.00001);
        expect(Math.cos(half_pi)).to.be.closeTo(0, 0.00001);
      });

      it("expects to return PI if 180 is passed", function() {
        const pi = ColorContrastCalc.HueRotateCalc.degToRad(180);
        expect(pi).to.be.closeTo(3.14159, 0.001);
        expect(Math.sin(pi)).to.be.closeTo(0, 0.00001);
        expect(Math.cos(pi)).to.be.closeTo(-1, 0.00001);
      });

      it("expects to return PI * 2 if 360 is passed", function() {
        const pi2 = ColorContrastCalc.HueRotateCalc.degToRad(360);
        expect(pi2).to.be.closeTo(6.283185, 0.00001);
        expect(Math.sin(pi2)).to.be.closeTo(0, 0.00001);
        expect(Math.cos(pi2)).to.be.closeTo(1, 0.00001);
      });
    });
  });

  describe("new", function() {
    const rgb_yellow = [255, 255, 0];

    it("expects to generate an instance with rgb and name properties", function() {
      const yellow = new ColorContrastCalc(rgb_yellow, "yellow");
      expect(yellow.rgb).to.deep.equal(rgb_yellow);
      expect(yellow.relativeLuminance).to.be.closeTo(0.9278, 0.01);
      expect(yellow.name).to.equal("yellow");
      expect(yellow.hexCode).to.equal("#ffff00");
    });

    it("expects to generate an instance with rgb in hex notation and name properties", function() {
      const yellow = new ColorContrastCalc("#ffff00", "yellow");
      expect(yellow.rgb).to.deep.equal(rgb_yellow);
      expect(yellow.relativeLuminance).to.be.closeTo(0.9278, 0.01);
      expect(yellow.name).to.equal("yellow");
    });

    it("expects to assign the hex notation of rgb to its name property if no name is specified", function() {
      const yellow = new ColorContrastCalc(rgb_yellow);
      expect(yellow.rgb).to.deep.equal(rgb_yellow);
      expect(yellow.name).to.equal("#ffff00");
    });

    it("properties of a returned object are frozen", function() {
      const yellow = new ColorContrastCalc(rgb_yellow);
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
      const color = new ColorContrastCalc(rgb);
      expect(color.contrastRatioAgainst(RGB_WHITE)).to.be.closeTo(contrast, 0.01);
    });

    it("expects to return 4.23 when own color is [127, 127, 32] and the other color is #ffffff", function() {
      const color = new ColorContrastCalc(rgb);
      expect(color.contrastRatioAgainst("#ffffff")).to.be.closeTo(contrast, 0.01);
    });

    it("expects to return 4.23 when own color is [127, 127, 32] and the other is an instance of ColorContrastCalc which represents white", function() {
      const color = new ColorContrastCalc(rgb);
      const white = new ColorContrastCalc([255, 255, 255]);
      expect(color.contrastRatioAgainst(white)).to.be.closeTo(contrast, 0.01);
      expect(white.contrastRatioAgainst(color)).to.be.closeTo(contrast, 0.01);
    });
  });

  describe("toString", function() {
    const yellow = new ColorContrastCalc("#ffff00", "yellow");

    it("expects to return hexCode when base is 16", function() {
      expect(yellow.toString(16)).to.equal("#ffff00");
    });

    it("expects to return rgb(255,255,0) when base is 10", function() {
      expect(yellow.toString(10)).to.equal("rgb(255,255,0)");
    });

    it("expects to return 'yellow' when base is null", function() {
      expect(yellow.toString(null)).to.equal("yellow");
    });
  });

  describe("colorsWithSufficientContrast", function() {
    const white = new ColorContrastCalc(RGB_WHITE, "white");
    const black = new ColorContrastCalc(RGB_BLACK, "black");

    it("expects to return an array of colors that satisfy level AA of WCAG 2.0 by default", function() {
      expect(white.colorsWithSufficientContrast().length).to.equal(31);
      expect(black.colorsWithSufficientContrast().length).to.equal(116);
    });

    it("expects to return an array of colors that satisfy level A of WCAG 2.0 if its argument is 'A' or 1", function() {
      expect(white.colorsWithSufficientContrast("A").length).to.equal(57);
      expect(black.colorsWithSufficientContrast("A").length).to.equal(130);
      expect(white.colorsWithSufficientContrast(1).length).to.equal(57);
      expect(black.colorsWithSufficientContrast(1).length).to.equal(130);
    });

    it("expects to return an array of colors that satisfy level AAA of WCAG 2.0 if its argument is 'AAA' or 3", function() {
      expect(white.colorsWithSufficientContrast("AAA").length).to.equal(17);
      expect(black.colorsWithSufficientContrast("AAA").length).to.equal(90);
      expect(white.colorsWithSufficientContrast(3).length).to.equal(17);
      expect(black.colorsWithSufficientContrast(3).length).to.equal(90);
    });
  });

  describe("newContrastColor", function() {
    const yellow = new ColorContrastCalc([255, 255, 0], "yellow");
    const yellow2 = new ColorContrastCalc([254, 254, 0], "yellow2");
    const orange = new ColorContrastCalc([255, 165, 0], "orange");

    it("expects to return the same rgb as the original if a given ratio is 100", function() {
      const hundred = yellow.newContrastColor(100, "yellow100");
      const hundred2 = yellow2.newContrastColor(100, "yellow100_2");
      const orange100 = yellow2.newContrastColor(100, "orange100");
      expect(hundred.rgb).to.deep.equal([255, 255, 0]);
      expect(hundred.name).to.equal("yellow100");
      expect(hundred2.rgb).to.deep.equal([254, 254, 0]);
      expect(hundred2.name).to.equal("yellow100_2");
      expect(orange100.rgb).to.deep.equal([254, 254, 0]);
      expect(orange100.name).to.equal("orange100");
    });

    it("expects to return a grey color if a given ratio is 0", function() {
      const zero = yellow.newContrastColor(0, "yellow0");
      const zero2 = yellow2.newContrastColor(0, "yellow0_2");
      const orange0 = orange.newContrastColor(0, "orange0");
      expect(zero.rgb).to.deep.equal([128, 128, 128]);
      expect(zero.name).to.equal("yellow0");
      expect(zero2.rgb).to.deep.equal([128, 128, 128]);
      expect(zero2.name).to.equal("yellow0_2");
      expect(orange0.rgb).to.deep.equal([128, 128, 128]);
      expect(orange0.name).to.equal("orange0");
    });

    it("expects to return a lower contrast color if a given ratio is less than 100", function() {
      const orange60 = orange.newContrastColor(60, "orange60");
      expect(orange60.rgb).to.deep.equal([204, 150, 51]);
      expect(orange60.name).to.equal("orange60");
    });

    it("expects to return a higher contrast color if a given ratio is greater than 100", function() {
      const orange120 = orange.newContrastColor(120, "orange120");
      expect(orange120.rgb).to.deep.equal([255, 173, 0]);
      expect(orange120.name).to.equal("orange120");
    });
  });

  describe("newBrightnessColor", function() {
    const white = new ColorContrastCalc([255, 255, 255], "white");
    const yellow = new ColorContrastCalc([255, 255, 0], "yellow");
    const yellow2 = new ColorContrastCalc([254, 254, 0], "yellow2");
    const orange = new ColorContrastCalc([255, 165, 0], "orange");

    it("expects to return the same rgb as the original if a given ratio is 100", function() {
      const hundred = yellow.newBrightnessColor(100, "yellow100");
      const hundred2 = yellow2.newBrightnessColor(100, "yellow100_2");
      const orange100 = yellow2.newBrightnessColor(100, "orange100");
      expect(hundred.rgb).to.deep.equal([255, 255, 0]);
      expect(hundred.name).to.equal("yellow100");
      expect(hundred2.rgb).to.deep.equal([254, 254, 0]);
      expect(hundred2.name).to.equal("yellow100_2");
      expect(orange100.rgb).to.deep.equal([254, 254, 0]);
      expect(orange100.name).to.equal("orange100");
    });

    it("expects to return the black color if a given ratio is 0", function() {
      const zero = yellow.newBrightnessColor(0, "yellow0");
      const zero2 = yellow2.newBrightnessColor(0, "yellow0_2");
      const orange0 = orange.newBrightnessColor(0, "orange0");
      expect(zero.rgb).to.deep.equal([0, 0, 0]);
      expect(zero.name).to.equal("yellow0");
      expect(zero2.rgb).to.deep.equal([0, 0, 0]);
      expect(zero2.name).to.equal("yellow0_2");
      expect(orange0.rgb).to.deep.equal([0, 0, 0]);
      expect(orange0.name).to.equal("orange0");
    });

    it("expects to return a darker color if a given ratio is less than 100", function() {
      const orange60 = orange.newBrightnessColor(60, "orange60");
      expect(orange60.rgb).to.deep.equal([153, 99, 0]);
      expect(orange60.name).to.equal("orange60");
    });

    it("expects to return a lighter color if a given ratio is greater than 100", function() {
      const orange120 = orange.newBrightnessColor(120, "orange120");
      expect(orange120.rgb).to.deep.equal([255, 198, 0]);
      expect(orange120.name).to.equal("orange120");
    });

    it("expects to return white if white is combined with a ratio greater than 100", function() {
      const white120 = white.newBrightnessColor(120, "white120");
      expect(white120.hexCode).to.equal("#ffffff");
    });

    it("expects to return yellow if yellow is combined with a ratio greater than 100", function() {
      const yellow120 = yellow.newBrightnessColor(120, "yellow120");
      expect(yellow120.hexCode).to.equal("#ffff00");
    });
  });

  describe("newInvertColor", function() {
    const yellow = new ColorContrastCalc([255, 255, 0], "yellow");
    const blue = new ColorContrastCalc([0, 0, 255], "yellow");

    it("expects to return yellow if 0 is passed to yellow", function() {
      const newColor = yellow.newInvertColor(0);
      expect(newColor.isSameColor(yellow)).to.be.true;
    });

    it("expects to return blue if 100 is passed to yellow", function() {
      const newColor = yellow.newInvertColor(100);
      expect(newColor.isSameColor(blue)).to.be.true;
    });

    it("expects to return a gray color if 50 is passed to yellow", function() {
      const newColor = yellow.newInvertColor(50);
      expect(newColor.hexCode).to.equal("#808080");
    });
  });

  describe("newHueRotateColor", function() {
    const yellow = new ColorContrastCalc([255, 255, 0], "yellow");
    const blue = new ColorContrastCalc([0, 0, 255], "blue");
    const orange = new ColorContrastCalc([255, 165, 0], "orange");

    it("expects to return unchanged colors when 0 is passed", function() {
      expect(yellow.newHueRotateColor(0).rgb).to.deep.equal([255, 255, 0]);
      expect(blue.newHueRotateColor(0).rgb).to.deep.equal([0, 0, 255]);
      expect(orange.newHueRotateColor(0).rgb).to.deep.equal([255, 165, 0]);
    });

    it("expects to return unchanged colors when 360 is passed", function() {
      expect(yellow.newHueRotateColor(360).rgb).to.deep.equal([255, 255, 0]);
      expect(blue.newHueRotateColor(360).rgb).to.deep.equal([0, 0, 255]);
      expect(orange.newHueRotateColor(360).rgb).to.deep.equal([255, 165, 0]);
    });

    it("expects to return new colors when 180 is passed", function() {
      expect(Math.sin(Math.PI * 2.0)).to.be.closeTo(0, 0.001);
      expect(yellow.newHueRotateColor(180).rgb).to.deep.equal([218, 218, 255]);
      expect(yellow.newHueRotateColor(180).hexCode).to.equal("#dadaff");
      expect(blue.newHueRotateColor(180).rgb).to.deep.equal([37, 37, 0]);
      expect(blue.newHueRotateColor(180).hexCode).to.equal("#252500");
      expect(orange.newHueRotateColor(180).rgb).to.deep.equal([90, 180, 255]);
      expect(orange.newHueRotateColor(180).hexCode).to.equal("#5ab4ff");
    });

    it("expects to return new colors when 90 is passed", function() {
      expect(yellow.newHueRotateColor(90).rgb).to.deep.equal([0, 255, 218]);
      expect(yellow.newHueRotateColor(90).hexCode).to.equal("#00ffda");
      expect(blue.newHueRotateColor(90).rgb).to.deep.equal([255, 0, 37]);
      expect(blue.newHueRotateColor(90).hexCode).to.equal("#ff0025");
      expect(orange.newHueRotateColor(90).rgb).to.deep.equal([0, 232, 90]);
      expect(orange.newHueRotateColor(90).hexCode).to.equal("#00e85a");
    });
  });

  describe("newSaturateColor", function() {
    const orange = new ColorContrastCalc([255, 165, 0], "orange");

    it("expects to return orange if 100 is passed", function() {
      expect(orange.newSaturateColor(100).rgb).to.deep.equal([255, 165, 0]);
    });

    it("expects to return a gray color if 0 is passed", function() {
      expect(orange.newSaturateColor(0).rgb).to.deep.equal([172, 172, 172]);
      expect(orange.newSaturateColor(0).hexCode).to.deep.equal("#acacac");
    });

    it("expects to return red if 2357 is passed", function() {
      expect(orange.newSaturateColor(2357).rgb).to.deep.equal([255, 0, 0]);
      expect(orange.newSaturateColor(2357).hexCode).to.deep.equal("#ff0000");
    });

    it("expects to return red if 3000 is passed", function() {
      expect(orange.newSaturateColor(3000).rgb).to.deep.equal([255, 0, 0]);
      expect(orange.newSaturateColor(3000).hexCode).to.deep.equal("#ff0000");
    });
  });

  describe("newGrayscaleColor", function() {
    const orange = new ColorContrastCalc([255, 165, 0], "orange");

    it("expects to the original color if 0 is passed", function() {
      expect(orange.newGrayscaleColor(0).isSameColor(orange)).to.be.true;
    });

    it("expects to a gray color if 100 is passed", function() {
      expect(orange.newGrayscaleColor(100).hexCode).to.equal("#acacac");
    });

    it("expects to return a graysh orange if 50 is passed", function() {
      expect(orange.newGrayscaleColor(50).hexCode).to.equal("#d6a956");
    });
  });

  describe("BLACK", function() {
    it("expects to return an instance corresponding to black", function() {
      const yellow = new ColorContrastCalc("#ffff00", "yellow");
      expect(yellow.BLACK.name).to.equal("black");
    });
  });

  describe("WHITE", function() {
    it("expects to return an instance corresponding to white", function() {
      const yellow = new ColorContrastCalc("#ffff00", "yellow");
      expect(yellow.WHITE.name).to.equal("white");
    });
  });

  describe("GRAY", function() {
    it("expects to return an instance corresponding to #808080", function() {
      const yellow = new ColorContrastCalc("#ffff00", "yellow");
      expect(yellow.GRAY.name).to.equal("gray");
    });
  });

  describe("findBrightnessThreshold", function() {
    const orange = ColorContrastCalc.NAME_TO_COLOR.get("orange");
    const blueviolet = ColorContrastCalc.NAME_TO_COLOR.get("blueviolet");
    const blue = ColorContrastCalc.NAME_TO_COLOR.get("blue");
    const white = ColorContrastCalc.WHITE;
    const darkgreen = ColorContrastCalc.NAME_TO_COLOR.get("darkgreen");
    const green = ColorContrastCalc.NAME_TO_COLOR.get("green");

    it("expects to return a darker orange if orange is passed", function() {
      const threshold = orange.findBrightnessThreshold(orange);
      expect(orange.contrastRatioAgainst(orange)).to.be.below(4.5);
      expect(orange.contrastRatioAgainst(threshold)).to.be.closeTo(4.5, 0.5);
      expect(orange.contrastRatioAgainst(threshold)).to.be.above(4.5);
      expect(threshold.hexCode).to.equal("#674200");
    });

    it("expects to return a more darker color if a passed color is darker", function() {
      const threshold = orange.findBrightnessThreshold(blueviolet);
      expect(orange.contrastRatioAgainst(blueviolet)).to.be.below(4.5);
      expect(orange.contrastRatioAgainst(threshold)).to.be.closeTo(4.5, 0.5);
      expect(orange.contrastRatioAgainst(threshold)).to.be.above(4.5);
      expect(threshold.hexCode).to.equal("#6720a9");
    });

    it("expects to return a brighter orange if blue is combined with orange", function() {
      const threshold = blue.findBrightnessThreshold(orange);
      expect(blue.contrastRatioAgainst(threshold)).to.be.closeTo(4.5, 0.5);
      expect(blue.contrastRatioAgainst(threshold)).to.be.above(4.5);
      expect(threshold.hexCode).to.equal("#ffaa00");
    });

    it("expects to return a brighter orange if blueviolet is combined with orange", function() {
      const threshold = blueviolet.findBrightnessThreshold(orange);
      expect(blueviolet.contrastRatioAgainst(threshold)).to.be.closeTo(4.5, 0.5);
      expect(blueviolet.contrastRatioAgainst(threshold)).to.be.above(4.5);
      expect(threshold.hexCode).to.equal("#ffe000");
    });

    it("expects to return a brigher color if brown is passed to brown", function() {
      const brown = ColorContrastCalc.NAME_TO_COLOR.get("brown");
      const threshold = brown.findBrightnessThreshold(brown);
      expect(brown.hexCode).to.equal("#a52a2a");
      expect(brown.contrastRatioAgainst(threshold)).to.be.closeTo(4.5, 0.5);
      expect(brown.contrastRatioAgainst(threshold)).to.be.above(4.5);
      expect(threshold.hexCode).to.equal("#ffbebe");
    });

    it("expects to return a darker green if darkgreen is passed to white - AA", function() {
      const threshold = white.findBrightnessThreshold(darkgreen);
      expect(white.contrastRatioAgainst(threshold)).to.be.closeTo(4.5, 0.5);
      expect(white.contrastRatioAgainst(threshold)).to.be.above(4.5);
    });

    it("expects to return a darker green if darkgreen is passed to white - AAA", function() {
      const threshold = white.findBrightnessThreshold(darkgreen, "AAA");
      expect(white.contrastRatioAgainst(threshold)).to.be.closeTo(7.0, 0.5);
      expect(white.contrastRatioAgainst(threshold)).to.be.above(7);
    });

    it("expects to return black for AAA if blue is passed to green", function() {
      const newColor = green.findBrightnessThreshold(blue, "AAA");
      expect(newColor.isSameColor(ColorContrastCalc.BLACK)).to.be.true;
    });
  });

  describe("contrastLevel", function() {
    const white = ColorContrastCalc.WHITE;
    const black = ColorContrastCalc.BLACK;
    const orange = ColorContrastCalc.getByName("orange");
    const royalblue = ColorContrastCalc.getByName("royalblue");
    const steelblue = ColorContrastCalc.getByName("steelblue");

    it("expects to return 'AAA' when black is passed to white", function() {
      expect(white.contrastLevel(black)).to.equal("AAA");
    });

    it("expects to return 'AA' when white is passed to royalblue", function() {
      expect(royalblue.contrastLevel(white)).to.equal("AA");
    });

    it("expects to return 'A' when white is passed to steelblue", function() {
      expect(steelblue.contrastLevel(white)).to.equal("A");
    });

    it("expects to return '-' when white is passed to orange", function() {
      expect(orange.contrastLevel(white)).to.equal("-");
    });
  });

  describe("hasSufficientContrast", function() {
    it("expects to return true for black and white", function() {
      const black = ColorContrastCalc.BLACK;
      const white = ColorContrastCalc.WHITE;
      expect(black.hasSufficientContrast(white)).to.be.true;
      expect(black.hasSufficientContrast(white, "A")).to.be.true;
      expect(black.hasSufficientContrast(white, "AAA")).to.be.true;
    });

    it("expects to return false for orange and white", function() {
      const orange = ColorContrastCalc.NAME_TO_COLOR.get("orange");
      const white = ColorContrastCalc.WHITE;
      expect(orange.hasSufficientContrast(white)).to.be.false;
      expect(orange.hasSufficientContrast(white, "A")).to.be.false;
      expect(orange.hasSufficientContrast(white, "AAA")).to.be.false;
    });

    it("expects to return false for orange and blueviolet when level is 'AA'", function() {
      const orange = ColorContrastCalc.NAME_TO_COLOR.get("orange");
      const blueviolet = ColorContrastCalc.NAME_TO_COLOR.get("blueviolet");
      expect(orange.hasSufficientContrast(blueviolet)).to.be.false;
    });

    it("expects to return false for orange and blueviolet when level is 'A'", function() {
      const orange = ColorContrastCalc.NAME_TO_COLOR.get("orange");
      const blueviolet = ColorContrastCalc.NAME_TO_COLOR.get("blueviolet");
      expect(orange.hasSufficientContrast(blueviolet, "A")).to.be.true;
    });

    it("expects to return false for orange and blueviolet when level is 'AAA'", function() {
      const orange = ColorContrastCalc.NAME_TO_COLOR.get("orange");
      const blueviolet = ColorContrastCalc.NAME_TO_COLOR.get("blueviolet");
      expect(orange.hasSufficientContrast(blueviolet, "AAA")).to.be.false;
    });
  });

  describe("isSameColor", function() {
    it("expects to return true if the values of hexCode are same", function() {
      const gray = ColorContrastCalc.NAME_TO_COLOR.get("gray");
      const grey = ColorContrastCalc.NAME_TO_COLOR.get("grey");
      expect(gray.isSameColor(grey)).to.be.true;
    });

    it("expects to return fale if the values of hexCode are not same", function() {
      const gray = ColorContrastCalc.NAME_TO_COLOR.get("gray");
      expect(gray.isSameColor(ColorContrastCalc.WHITE)).to.be.false;
    });
  });

  describe("isMaxContrast", function() {
    it("expects to return true for yellow", function() {
      const yellow = ColorContrastCalc.NAME_TO_COLOR.get("yellow");
      expect(yellow.isMaxContrast()).to.be.true;
    });

    it("expects to return false for orange", function() {
      const orange = ColorContrastCalc.NAME_TO_COLOR.get("orange");
      expect(orange.isMaxContrast()).to.be.false;
    });
  });

  describe("isMinContrast", function() {
    it("expects to return true for gray", function() {
      const gray = ColorContrastCalc.NAME_TO_COLOR.get("gray");
      expect(gray.isMinContrast()).to.be.true;
    });

    it("expects to return false for orange", function() {
      const orange = ColorContrastCalc.NAME_TO_COLOR.get("orange");
      expect(orange.isMinContrast()).to.be.false;
    });
  });

  describe("calcUpperRatioLimit", function() {
    it("expects to return 155 for ", function() {
      const orange = ColorContrastCalc.NAME_TO_COLOR.get("orange");
      expect(orange.calcUpperRatioLimit()).to.equal(155);
    });

    it("expects to return 594 for blueviolet", function() {
      const blueviolet = ColorContrastCalc.NAME_TO_COLOR.get("blueviolet");
      expect(blueviolet.calcUpperRatioLimit()).to.equal(594);
    });

    it("expects to return 100 for black", function() {
      const blueviolet = ColorContrastCalc.NAME_TO_COLOR.get("black");
      expect(blueviolet.calcUpperRatioLimit()).to.equal(100);
    });
  });
});

