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

  describe("newContrastColor", function() {
    const yellow = new Color([255, 255, 0], "yellow");
    const yellow2 = new Color([254, 254, 0], "yellow2");
    const orange = new Color([255, 165, 0], "orange");

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
    const white = new Color([255, 255, 255], "white");
    const yellow = new Color([255, 255, 0], "yellow");
    const yellow2 = new Color([254, 254, 0], "yellow2");
    const orange = new Color([255, 165, 0], "orange");

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
    const yellow = new Color([255, 255, 0], "yellow");
    const blue = new Color([0, 0, 255], "blue");

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
    const yellow = new Color([255, 255, 0], "yellow");
    const blue = new Color([0, 0, 255], "blue");
    const orange = new Color([255, 165, 0], "orange");

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
    const orange = new Color([255, 165, 0], "orange");

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
});

