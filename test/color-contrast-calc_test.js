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

    describe("decimalToHexNotation", function() {
      it("expects to return #fff00 when [255, 255, 0] is passed", function() {
        expect(ColorContrastCalc.decimalToHexNotation([255, 255, 0])).to.equal("#ffff00");
      });
    });

    describe("NAMED_COLORS", function() {
      it("expects to contain predefined instances of ColorContrastCalc", function() {
        expect(ColorContrastCalc.NAMED_COLORS[0]).to.be.instanceof(ColorContrastCalc);
        expect(ColorContrastCalc.NAMED_COLORS[0].name).to.equal("aliceblue");
        expect(ColorContrastCalc.NAMED_COLORS[0].rgb).to.deep.equal([240, 248, 255]);
        expect(ColorContrastCalc.NAMED_COLORS[0].hexNotation).to.deep.equal("#f0f8ff");
        expect(ColorContrastCalc.NAMED_COLORS.slice(-1)[0].name).to.equal("yellowgreen");
        expect(ColorContrastCalc.NAMED_COLORS.slice(-1)[0].rgb).to.deep.equal([154, 205, 50]);
        expect(ColorContrastCalc.NAMED_COLORS.slice(-1)[0].hexNotation).to.deep.equal("#9acd32");
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
  });

  describe("new", function() {
    const rgb_yellow = [255, 255, 0];

    it("expects to generate an instance with rgb and name properties", function() {
      const yellow = new ColorContrastCalc(rgb_yellow, "yellow");
      expect(yellow.rgb).to.deep.equal(rgb_yellow);
      expect(yellow.relativeLuminance).to.be.closeTo(0.9278, 0.01);
      expect(yellow.name).to.equal("yellow");
      expect(yellow.hexNotation).to.equal("#ffff00");
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

    it("expects to return hexNotation when base is 16", function() {
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
  });
});

