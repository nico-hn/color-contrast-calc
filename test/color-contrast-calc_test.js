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

    describe("HEX_TO_COLOR", function() {
      it("expects to return a corresponding instance for a passed hex color", function() {
        const black = ColorContrastCalc.HEX_TO_COLOR.get("#000000");
        const white = ColorContrastCalc.HEX_TO_COLOR.get("#ffffff");
        expect(black.name).to.equal("black");
        expect(white.name).to.equal("white");
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
        expect(ColorContrastCalc.GRAY.hexNotation).to.equal("#808080");
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
      expect(white120.hexNotation).to.equal("#ffffff");
    });

    it("expects to return yellow if yellow is combined with a ratio greater than 100", function() {
      const yellow120 = yellow.newBrightnessColor(120, "yellow120");
      expect(yellow120.hexNotation).to.equal("#ffff00");
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

    it("expects to return a darker orange if orange is passed", function() {
      const threshold = orange.findBrightnessThreshold(orange);
      expect(orange.contrastRatioAgainst(orange)).to.be.below(4.5);
      expect(orange.contrastRatioAgainst(threshold)).to.be.closeTo(4.5, 0.5);
      expect(orange.contrastRatioAgainst(threshold)).to.be.above(4.5);
      expect(threshold.hexNotation).to.equal("#664200");
    });

    it("expects to return a more darker color if a passed color is darker", function() {
      const threshold = orange.findBrightnessThreshold(blueviolet);
      expect(orange.contrastRatioAgainst(blueviolet)).to.be.below(4.5);
      expect(orange.contrastRatioAgainst(threshold)).to.be.closeTo(4.5, 0.5);
      expect(orange.contrastRatioAgainst(threshold)).to.be.above(4.5);
      expect(threshold.hexNotation).to.equal("#6620a7");
    });

    it("expects to return a brighter orange if blue is combined with orange", function() {
      const threshold = blue.findBrightnessThreshold(orange);
      expect(blue.contrastRatioAgainst(threshold)).to.be.closeTo(4.5, 0.5);
      expect(blue.contrastRatioAgainst(threshold)).to.be.above(4.5);
      expect(threshold.hexNotation).to.equal("#ffaa00");
    });

    it("expects to return a brighter orange if blueviolet is combined with orange", function() {
      const threshold = blueviolet.findBrightnessThreshold(orange);
      expect(blueviolet.contrastRatioAgainst(threshold)).to.be.closeTo(4.5, 0.5);
      expect(blueviolet.contrastRatioAgainst(threshold)).to.be.above(4.5);
      expect(threshold.hexNotation).to.equal("#ffe000");
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
    it("expects to return true if the values of hexNotation are same", function() {
      const gray = ColorContrastCalc.NAME_TO_COLOR.get("gray");
      const grey = ColorContrastCalc.NAME_TO_COLOR.get("grey");
      expect(gray.isSameColor(grey)).to.be.true;
    });

    it("expects to return fale if the values of hexNotation are not same", function() {
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

  describe("calcRatioLimit", function() {
    it("expects to return 155 when orange is passed", function() {
      const orange = ColorContrastCalc.NAME_TO_COLOR.get("orange");
      expect(ColorContrastCalc.GRAY.calcRatioLimit(orange)).to.equal(155);
    });

    it("expects to return 100 when blueviolet is passed to orange", function() {
      const orange = ColorContrastCalc.NAME_TO_COLOR.get("orange");
      const blueviolet = ColorContrastCalc.NAME_TO_COLOR.get("blueviolet");
      expect(orange.calcRatioLimit(blueviolet)).to.equal(594);
    });

    it("expects to return 100 when two colors have the same relative luminance and lighter than gray", function() {
      const orange = ColorContrastCalc.NAME_TO_COLOR.get("orange");
      expect(orange.calcRatioLimit(orange)).to.equal(155);
    });

    it("expects to return 594 when both colors are blueviolet", function() {
      const blueviolet = ColorContrastCalc.NAME_TO_COLOR.get("blueviolet");
      expect(blueviolet.calcRatioLimit(blueviolet)).to.equal(594);
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
  });
});

