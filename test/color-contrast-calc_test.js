"use strict";

const expect = require("chai").expect;
const ColorContrastCalc = require("../lib/color-contrast-calc").ColorContrastCalc;
const Color = require("../lib/color-contrast-calc").Color;

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

    describe("NAMED_COLORS", function() {
      it("expects to contain predefined instances of ColorContrastCalc", function() {
        expect(ColorContrastCalc.NAMED_COLORS[0]).to.be.instanceof(Color);
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
      it("expects to return a corresponding instance for a passed hex code", function() {
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
      it("expects to return yellow when '#ffff00' is passed", function() {
        expect(ColorContrastCalc.getByHexCode("#ffff00").name).to.equal("yellow");
      });

      it("expect to return yellow even when the hex code is given in shorthand form", function() {
        expect(ColorContrastCalc.getByHexCode("#ff0").name).to.equal("yellow");
      });

      it("expect to return yellow even when the hex code is written in uppercase letters", function() {
        expect(ColorContrastCalc.getByHexCode("#FFFF00").name).to.equal("yellow");
      });

      it("expects to return a new instance if a given hex code is not registered", function() {
        expect(ColorContrastCalc.getByHexCode("#f3f2f1").name).to.equal("#f3f2f1");
      });
    });

    describe("sort", function() {
      const expectations = function() {
        context("when colorOrder is 'rgb'", function() {
          it("expects to return [black, orange, yellow] when [black, yellow, orange] is passed", function() {
            expect(ColorContrastCalc.sort([this.black, this.yellow, this.orange])).to.deep.equal([this.black, this.orange, this.yellow]);
          });

          it("expects to return [black, springgreen, orange, yellow] when [black, yellow, orange, springgreen] is passed", function() {
            expect(ColorContrastCalc.sort([this.black, this.yellow, this.orange, this.springgreen])).to.deep.equal([this.black, this.springgreen, this.orange, this.yellow]);
          });

          it("expects to return [black, orange, yellow] when [yellow, black, orange] is passed", function() {
            expect(ColorContrastCalc.sort([this.yellow, this.black, this.orange])).to.deep.equal([this.black, this.orange, this.yellow]);
          });

          it("expects to return [black, gray, orange, yellow] when [yellow, black, orange, gray] is passed", function() {
            expect(ColorContrastCalc.sort([this.yellow, this.black, this.orange, this.gray])).to.deep.equal([this.black, this.gray, this.orange, this.yellow]);
          });

          it("expects to return [black, blue, orange, yellow] when [yellow, black, orange, blue] is passed", function() {
            expect(ColorContrastCalc.sort([this.yellow, this.black, this.orange, this.blue])).to.deep.equal([this.black, this.blue, this.orange, this.yellow]);
          });
        });

        context("when colorOrder is 'grb'", function() {
          const colorOrder = "grb";

          it("expects to return [black, orange, yellow] when [black, yellow, orange] is passed", function() {
            expect(ColorContrastCalc.sort([this.black, this.yellow, this.orange], colorOrder)).to.deep.equal([this.black, this.orange, this.yellow]);
          });

          it("expects to return [black, orange, springgreen, yellow] when [black, yellow, orange, springgreen] is passed", function() {
            expect(ColorContrastCalc.sort([this.black, this.yellow, this.orange, this.springgreen], colorOrder)).to.deep.equal([this.black, this.orange, this.springgreen, this.yellow]);
          });

          it("expects to return [black, orange, yellow] when [yellow, black, orange] is passed", function() {
            expect(ColorContrastCalc.sort([this.yellow, this.black, this.orange], colorOrder)).to.deep.equal([this.black, this.orange, this.yellow]);
          });

          it("expects to return [black, gray, orange, yellow] when [yellow, black, orange, gray] is passed", function() {
            expect(ColorContrastCalc.sort([this.yellow, this.black, this.orange, this.gray], colorOrder)).to.deep.equal([this.black, this.gray, this.orange, this.yellow]);
          });

          it("expects to return [black, blue, orange, yellow] when [yellow, black, orange, blue] is passed", function() {
            expect(ColorContrastCalc.sort([this.yellow, this.black, this.orange, this.blue], colorOrder)).to.deep.equal([this.black, this.blue, this.orange, this.yellow]);
          });
        });

        context("when colorOrder is 'brg'", function() {
          const colorOrder = "brg";

          it("expects to return [black, orange, yellow] when [black, yellow, orange] is passed", function() {
            expect(ColorContrastCalc.sort([this.black, this.yellow, this.orange], colorOrder)).to.deep.equal([this.black, this.orange, this.yellow]);
          });

          it("expects to return [black, orange, yellow, springgreen] when [black, yellow, orange, springgreen] is passed", function() {
            expect(ColorContrastCalc.sort([this.black, this.yellow, this.orange, this.springgreen], colorOrder)).to.deep.equal([this.black, this.orange, this.yellow, this.springgreen]);
          });

          it("expects to return [black, orange, yellow] when [yellow, black, orange] is passed", function() {
            expect(ColorContrastCalc.sort([this.yellow, this.black, this.orange], colorOrder)).to.deep.equal([this.black, this.orange, this.yellow]);
          });

          it("expects to return [black, orange, yellow, gray] when [yellow, black, orange, gray] is passed", function() {
            expect(ColorContrastCalc.sort([this.yellow, this.black, this.orange, this.gray], colorOrder)).to.deep.equal([this.black, this.orange, this.yellow, this.gray]);
          });

          it("expects to return [black, orange, yellow, blue] when [yellow, black, orange, blue] is passed", function() {
            expect(ColorContrastCalc.sort([this.yellow, this.black, this.orange, this.blue], colorOrder)).to.deep.equal([this.black, this.orange, this.yellow, this.blue]);
          });
        });

        context("when colorOrder is 'Rgb'", function() {
          const colorOrder = "Rgb";

          it("expects to return [orange, yellow, black] when [black, yellow, orange] is passed", function() {
            expect(ColorContrastCalc.sort([this.black, this.yellow, this.orange], colorOrder)).to.deep.equal([this.orange, this.yellow, this.black]);
          });

          it("expects to return [orange, yellow, black, springgreen] when [black, yellow, orange, springgreen] is passed", function() {
            expect(ColorContrastCalc.sort([this.black, this.yellow, this.orange, this.springgreen], colorOrder)).to.deep.equal([this.orange, this.yellow, this.black, this.springgreen]);
          });

          it("expects to return [orange, yellow, black] when [yellow, black, orange] is passed", function() {
            expect(ColorContrastCalc.sort([this.yellow, this.black, this.orange], colorOrder)).to.deep.equal([this.orange, this.yellow, this.black]);
          });

          it("expects to return [orange, yellow, gray, black] when [yellow, black, orange, gray] is passed", function() {
            expect(ColorContrastCalc.sort([this.yellow, this.black, this.orange, this.gray], colorOrder)).to.deep.equal([this.orange, this.yellow, this.gray, this.black]);
          });

          it("expects to return [orange, yellow, black, blue] when [yellow, black, orange, blue] is passed", function() {
            expect(ColorContrastCalc.sort([this.yellow, this.black, this.orange, this.blue], colorOrder)).to.deep.equal([this.orange, this.yellow, this.black, this.blue]);
          });
        });
      };

      context("When an array of ColorContrastCalc instances is passed", function() {
        before(function() {
          this.black = new Color("#000000");
          this.gray = new Color("#808080");
          this.blue = new Color("#0000ff");
          this.yellow = new Color("#ffff00");
          this.orange = new Color("#ffa500");
          this.springgreen = new Color("#00ff7f");
        });

        expectations();
      });

      context("When an array of hex codes is passed", function() {
        before(function() {
          this.black = "#000000";
          this.gray = "#808080";
          this.blue = "#0000ff";
          this.yellow = "#ffff00";
          this.orange = "#ffa500";
          this.springgreen = "#00ff7f";
        });

        expectations();
      });

      context("When keys for sorting are in the second column of a two dimensional array", function() {
        const black = ["black", "#000000"];
        const gray = ["gray", "#808080"];
        const blue = ["blue", "#0000ff"];
        const yellow = ["yellow", "#ffff00"];
        const orange = ["orange", "#ffa500"];
        const springgreen = ["springgreen", "#00ff7f"];
        const keyMapper = function(color) { return color[1]; };

        context("when colorOrder is 'Rgb'", function() {
          const colorOrder = "Rgb";

          it("expects to return [orange, yellow, black] when [black, yellow, orange] is passed", function() {
            expect(ColorContrastCalc.sort([black, yellow, orange], colorOrder, keyMapper)).to.deep.equal([orange, yellow, black]);
          });

          it("expects to return [orange, yellow, black, springgreen] when [black, yellow, orange, springgreen] is passed", function() {
            expect(ColorContrastCalc.sort([black, yellow, orange, springgreen], colorOrder, keyMapper)).to.deep.equal([orange, yellow, black, springgreen]);
          });

          it("expects to return [orange, yellow, black] when [yellow, black, orange] is passed", function() {
            expect(ColorContrastCalc.sort([yellow, black, orange], colorOrder, keyMapper)).to.deep.equal([orange, yellow, black]);
          });

          it("expects to return [orange, yellow, gray, black] when [yellow, black, orange, gray] is passed", function() {
            expect(ColorContrastCalc.sort([yellow, black, orange, gray], colorOrder, keyMapper)).to.deep.equal([orange, yellow, gray, black]);
          });

          it("expects to return [orange, yellow, black, blue] when [yellow, black, orange, blue] is passed", function() {
            expect(ColorContrastCalc.sort([yellow, black, orange, blue], colorOrder, keyMapper)).to.deep.equal([orange, yellow, black, blue]);
          });
        });
      });

      describe("when colorOrder is 'hLS'", function() {
        context("When colors are given as hex codes", function() {
          const  [white, red, yellow, lime, blue]= ["#ffffff", "#ff0000", "#ffff00", "#00ff00", "#0000ff"];
          const colors = [blue, yellow, white, red, lime];

          it("expects to return [white, red, yellow, lime, blue] when [blue, yellow, white, red, lime] is passed", function() {
            expect(ColorContrastCalc.sort(colors, "hLS")).to.deep.equal([white, red, yellow, lime, blue]);
          });
        });

        context("When colors are given as instances of ColorContrastCalc", function() {
          const  [white, red, yellow, lime, blue]= ["#ffffff", "#ff0000", "#ffff00", "#00ff00", "#0000ff"].map(hex => {
            return ColorContrastCalc.getByHexCode(hex);
          });
          const colors = [blue, yellow, white, red, lime];

          it("expects to return [white, red, yellow, lime, blue] when [blue, yellow, white, red, lime] is passed", function() {
            expect(ColorContrastCalc.sort(colors, "hLS")).to.deep.equal([white, red, yellow, lime, blue]);
          });
        });

        context("When colors are given as HSL values'", function() {
          const  [white, red, yellow, lime, blue]= [[0, 100, 100], [0, 100, 50], [60, 100, 50], [120, 100, 50], [240, 100, 50]];
          const colors = [blue, yellow, white, red, lime];

          it("expects to return [white, red, yellow, lime, blue] when [blue, yellow, white, red, lime] is passed", function() {
            expect(ColorContrastCalc.sort(colors, "hLS")).to.deep.equal([white, red, yellow, lime, blue]);
          });
        });
      });
    });

    describe("compare", function() {
      const expectations = function(yellow, orange, deepskyblue, springgreen, keyType) {
        context("when colorOrder is 'rgb'", function() {
          const compare = ColorContrastCalc.compareFunction("rgb", keyType);

          it("expects to return a positive number when yellow and orange are passed", function() {
            expect(compare(yellow, orange)).to.be.greaterThan(0);
          });

          it("expects to return a negative number when orange and yellow are passed", function() {
            expect(compare(orange, yellow)).to.be.lessThan(0);
          });

          it("expects to return zero when two arguments are same", function() {
            expect(compare(orange, orange)).to.equal(0);
          });

          it("expects to return a positive number when orange and deepskyblue are passed", function() {
            expect(compare(orange, deepskyblue)).to.be.greaterThan(0);
          });

          it("expects to return a negative number when deepskyblue and springgreen are passed", function() {
            expect(compare(deepskyblue, springgreen)).to.be.lessThan(0);
          });
        });

        context("when colorOrder is 'RGB'", function() {
          const compare = ColorContrastCalc.compareFunction("RGB", keyType);

          it("expects to return a negative number when yellow and orange are passed", function() {
            expect(compare(yellow, orange)).to.be.lessThan(0);
          });

          it("expects to return a positive number when orange and yellow are passed", function() {
            expect(compare(orange, yellow)).to.be.greaterThan(0);
          });

          it("expects to return zero when two arguments are same", function() {
            expect(compare(orange, orange)).to.equal(0);
          });

          it("expects to return a negative number when orange and deepskyblue are passed", function() {
            expect(compare(orange, deepskyblue)).to.be.lessThan(0);
          });

          it("expects to return a positive number when deepskyblue and springgreen are passed", function() {
            expect(compare(deepskyblue, springgreen)).to.be.greaterThan(0);
          });
        });

        context("when colorOrder is 'grb'", function() {
          const compare = ColorContrastCalc.compareFunction("grb", keyType);

          it("expects to return a positive number when yellow and orange are passed", function() {
            expect(compare(yellow, orange)).to.be.greaterThan(0);
          });

          it("expects to return a negative number when orange and yellow are passed", function() {
            expect(compare(orange, yellow)).to.be.lessThan(0);
          });

          it("expects to return zero when two arguments are same", function() {
            expect(compare(orange, orange)).to.equal(0);
          });

          it("expects to return a negative number when orange and deepskyblue are passed", function() {
            expect(compare(orange, deepskyblue)).to.be.lessThan(0);
          });

          it("expects to return a negative number when deepskyblue and springgreen are passed", function() {
            expect(compare(deepskyblue, springgreen)).to.be.lessThan(0);
          });
        });

        context("when colorOrder is 'brg'", function() {
          const compare = ColorContrastCalc.compareFunction("brg", keyType);

          it("expects to return a positive number when yellow and orange are passed", function() {
            expect(compare(yellow, orange)).to.be.greaterThan(0);
          });

          it("expects to return a negative number when orange and yellow are passed", function() {
            expect(compare(orange, yellow)).to.be.lessThan(0);
          });

          it("expects to return zero when two arguments are same", function() {
            expect(compare(orange, orange)).to.equal(0);
          });

          it("expects to return a negative number when orange and deepskyblue are passed", function() {
            expect(compare(orange, deepskyblue)).to.be.lessThan(0);
          });

          it("expects to return a positive number when deepskyblue and springgreen are passed", function() {
            expect(compare(deepskyblue, springgreen)).to.be.greaterThan(0);
          });
        });
      };

      context("When colors are given as ColorContrastCalc instances", function() {
        const yellow = new Color("#ffff00");
        const orange = new Color("#ffa500");
        const deepskyblue = new Color("#00bfff");
        const springgreen = new Color("#00ff7f");
        const keyType = "color";

        context("when colorOrder is the default value of 'rgb'", function() {
          const compare = ColorContrastCalc.compareFunction();

          it("expects to return a positive number when yellow and orange are passed", function() {
            expect(compare(yellow, orange)).to.be.greaterThan(0);
          });

          it("expects to return a negative number when orange and yellow are passed", function() {
            expect(compare(orange, yellow)).to.be.lessThan(0);
          });

          it("expects to return zero when two arguments are same", function() {
            expect(compare(orange, orange)).to.equal(0);
          });

          it("expects to return a positive number when orange and deepskyblue are passed", function() {
            expect(compare(orange, deepskyblue)).to.be.greaterThan(0);
          });

          it("expects to return a negative number when deepskyblue and springgreen are passed", function() {
            expect(compare(deepskyblue, springgreen)).to.be.lessThan(0);
          });
        });

        expectations(yellow, orange, deepskyblue, springgreen, keyType);
      });

      context("When colors are given as hex codes", function() {
        const yellow = "#ffff00";
        const orange = "#ffa500";
        const deepskyblue = "#00bfff";
        const springgreen = "#00ff7f";
        const keyType = "hex";

        expectations(yellow, orange, deepskyblue, springgreen, keyType);
      });

      context("When colors are given as rgb values", function() {
        const yellow = [255, 255, 0];
        const orange = [255, 165, 0];
        const deepskyblue = [0, 191, 255];
        const springgreen = [0, 255, 127];
        const keyType = "rgb";

        expectations(yellow, orange, deepskyblue, springgreen, keyType);
      });
    });

    describe("compareHexFunc", function() {
      const yellow = "#ffff00";
      const orange = "#ffa500";
      const deepskyblue = "#00bfff";
      const springgreen = "#00ff7f";

      context("when colorOrder is 'rgb'", function() {
        const compare = ColorContrastCalc.Sorter.compareHexFunction("rgb");

        it("expects to return a positive number when yellow and orange are passed", function() {
          expect(compare(yellow, orange)).to.be.greaterThan(0);
        });

        it("expects to return a negative number when orange and yellow are passed", function() {
          expect(compare(orange, yellow)).to.be.lessThan(0);
        });

        it("expects to return zero when two arguments are same", function() {
          expect(compare(orange, orange)).to.equal(0);
        });

        it("expects to return a positive number when orange and deepskyblue are passed", function() {
          expect(compare(orange, deepskyblue)).to.be.greaterThan(0);
        });

        it("expects to return a negative number when deepskyblue and springgreen are passed", function() {
          expect(compare(deepskyblue, springgreen)).to.be.lessThan(0);
        });
      });

      context("when colorOrder is 'RGB'", function() {
        const compare = ColorContrastCalc.Sorter.compareHexFunction("RGB");

        it("expects to return a negative number when yellow and orange are passed", function() {
          expect(compare(yellow, orange)).to.be.lessThan(0);
        });

        it("expects to return a positive number when orange and yellow are passed", function() {
          expect(compare(orange, yellow)).to.be.greaterThan(0);
        });

        it("expects to return zero when two arguments are same", function() {
          expect(compare(orange, orange)).to.equal(0);
        });

        it("expects to return a negative number when orange and deepskyblue are passed", function() {
          expect(compare(orange, deepskyblue)).to.be.lessThan(0);
        });

        it("expects to return a positive number when deepskyblue and springgreen are passed", function() {
          expect(compare(deepskyblue, springgreen)).to.be.greaterThan(0);
        });
      });

      context("when colorOrder is 'grb'", function() {
        const compare = ColorContrastCalc.Sorter.compareHexFunction("grb");

        it("expects to return a positive number when yellow and orange are passed", function() {
          expect(compare(yellow, orange)).to.be.greaterThan(0);
        });

        it("expects to return a negative number when orange and yellow are passed", function() {
          expect(compare(orange, yellow)).to.be.lessThan(0);
        });

        it("expects to return zero when two arguments are same", function() {
          expect(compare(orange, orange)).to.equal(0);
        });

        it("expects to return a negative number when orange and deepskyblue are passed", function() {
          expect(compare(orange, deepskyblue)).to.be.lessThan(0);
        });

        it("expects to return a negative number when deepskyblue and springgreen are passed", function() {
          expect(compare(deepskyblue, springgreen)).to.be.lessThan(0);
        });
      });

      context("when colorOrder is 'brg'", function() {
        const compare = ColorContrastCalc.Sorter.compareHexFunction("brg");

        it("expects to return a positive number when yellow and orange are passed", function() {
          expect(compare(yellow, orange)).to.be.greaterThan(0);
        });

        it("expects to return a negative number when orange and yellow are passed", function() {
          expect(compare(orange, yellow)).to.be.lessThan(0);
        });

        it("expects to return zero when two arguments are same", function() {
          expect(compare(orange, orange)).to.equal(0);
        });

        it("expects to return a negative number when orange and deepskyblue are passed", function() {
          expect(compare(orange, deepskyblue)).to.be.lessThan(0);
        });

        it("expects to return a positive number when deepskyblue and springgreen are passed", function() {
          expect(compare(deepskyblue, springgreen)).to.be.greaterThan(0);
        });
      });

      context("when colorOrder is 'hsl'", function() {
        const compare = ColorContrastCalc.Sorter.compareHexFunction("hsl");

        it("expects to return a positive number when yellow and orange are passed", function() {
          expect(compare(yellow, orange)).to.be.greaterThan(0);
        });

        it("expects to return a positive number when yellow and orange are passed", function() {
          expect(compare(deepskyblue, orange)).to.be.greaterThan(0);
        });
      });

      context("when colorOrder is 'Hsl'", function() {
        const compare = ColorContrastCalc.Sorter.compareHexFunction("Hsl");

        it("expects to return a positive number when yellow and orange are passed", function() {
          expect(compare(yellow, orange)).to.be.lessThan(0);
        });

        it("expects to return a positive number when yellow and orange are passed", function() {
          expect(compare(deepskyblue, orange)).to.be.lessThan(0);
        });
      });
    });

    describe("Sorter.hslComponentPos", function() {
      const sorter = ColorContrastCalc.Sorter;

      it("expects to return [0, 1, 2] when 'hsl' is passed", function() {
        expect(sorter.hslComponentPos("hsl")).to.deep.equal([0, 1, 2]);
      });

      it("expects to return [0, 2, 1] when 'hLs' is passed", function() {
        expect(sorter.hslComponentPos("hLs")).to.deep.equal([0, 2, 1]);
      });
    });

    describe("Sorter.chooseHslCompFunc", function() {
      const sorter = ColorContrastCalc.Sorter;
      const ascendComp = sorter.ascendComp;
      const descendComp = sorter.descendComp;

      it("expects to return [ascendComp, ascendComp, ascendComp] when 'hsl' is passed", function() {
        expect(sorter.chooseHslCompFunc("hsl")).to.deep.equal([ascendComp, ascendComp, ascendComp]);
      });

      it("expects to return [ascendComp, ascendComp, descendComp] when 'hLs' is passed", function() {
        expect(sorter.chooseHslCompFunc("hLs")).to.deep.equal([ascendComp, ascendComp, descendComp]);
      });
    });

    describe("Sorter.caseInsensitiveComp", function() {
      const caseInsensitiveComp = ColorContrastCalc.Sorter.caseInsensitiveComp;

      it("expects to return a positive number when 'r'and 'g' is passed", function() {
        expect(caseInsensitiveComp("r", "g")).to.be.greaterThan(0);
      });

      it("expects to return a negative number when 'g'and 'r' is passed", function() {
        expect(caseInsensitiveComp("g", "r")).to.be.lessThan(0);
      });

      it("expects to return 0 when 'r'and 'r' is passed", function() {
        expect(caseInsensitiveComp("r", "r")).to.equal(0);
      });

      it("expects to return a positive number when 'R'and 'g' is passed", function() {
        expect(caseInsensitiveComp("R", "g")).to.be.greaterThan(0);
      });

      it("expects to return a negative number when 'g'and 'R' is passed", function() {
        expect(caseInsensitiveComp("g", "R")).to.be.lessThan(0);
      });

      it("expects to return 0 when 'r'and 'R' is passed", function() {
        expect(caseInsensitiveComp("r", "R")).to.equal(0);
      });
    });

    describe("binarySearchRange", function() {
      it("expects to return a smaller value for each iteration", function() {
        let ds = [];
        for (let d of ColorContrastCalc.binarySearchWidth(100, 1)) {
          ds.push(d);
        }

        expect(ds).to.deep.equal([50, 25, 12.5, 6.25, 3.125, 1.5625]);
      });
    });
  });

  describe("toString", function() {
    const yellow = new Color("#ffff00", "yellow");

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
    const white = new Color(RGB_WHITE, "white");
    const black = new Color(RGB_BLACK, "black");

    it("expects to return an array of colors that satisfy level AA of WCAG 2.0 by default", function() {
      expect(ColorContrastCalc.colorsWithSufficientContrast(white).length).to.equal(31);
      expect(ColorContrastCalc.colorsWithSufficientContrast(black).length).to.equal(116);
    });

    it("expects to return an array of colors that satisfy level A of WCAG 2.0 if its argument is 'A' or 1", function() {
      expect(ColorContrastCalc.colorsWithSufficientContrast(white, "A").length).to.equal(57);
      expect(ColorContrastCalc.colorsWithSufficientContrast(black, "A").length).to.equal(130);
      expect(ColorContrastCalc.colorsWithSufficientContrast(white, 1).length).to.equal(57);
      expect(ColorContrastCalc.colorsWithSufficientContrast(black, 1).length).to.equal(130);
    });

    it("expects to return an array of colors that satisfy level AAA of WCAG 2.0 if its argument is 'AAA' or 3", function() {
      expect(ColorContrastCalc.colorsWithSufficientContrast(white, "AAA").length).to.equal(17);
      expect(ColorContrastCalc.colorsWithSufficientContrast(black, "AAA").length).to.equal(90);
      expect(ColorContrastCalc.colorsWithSufficientContrast(white, 3).length).to.equal(17);
      expect(ColorContrastCalc.colorsWithSufficientContrast(black, 3).length).to.equal(90);
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
    it("expects to return 155 for orange", function() {
      const orange = ColorContrastCalc.NAME_TO_COLOR.get("orange");
      expect(orange.calcUpperRatioLimit()).to.equal(155);
    });

    it("expects to return 594 for blueviolet", function() {
      const blueviolet = ColorContrastCalc.NAME_TO_COLOR.get("blueviolet");
      expect(blueviolet.calcUpperRatioLimit()).to.equal(594);
    });

    it("expects to return 100 for black", function() {
      const black = ColorContrastCalc.NAME_TO_COLOR.get("black");
      expect(black.calcUpperRatioLimit()).to.equal(100);
    });
  });
});

