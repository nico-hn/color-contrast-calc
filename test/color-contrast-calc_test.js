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
          this.black = new ColorContrastCalc("#000000");
          this.gray = new ColorContrastCalc("#808080");
          this.blue = new ColorContrastCalc("#0000ff");
          this.yellow = new ColorContrastCalc("#ffff00");
          this.orange = new ColorContrastCalc("#ffa500");
          this.springgreen = new ColorContrastCalc("#00ff7f");
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
        const yellow = new ColorContrastCalc("#ffff00");
        const orange = new ColorContrastCalc("#ffa500");
        const deepskyblue = new ColorContrastCalc("#00bfff");
        const springgreen = new ColorContrastCalc("#00ff7f");
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

    describe("newHslColor", function() {
      it("expects to return an instance with .hexCode '#ffff000' when [60, 100, 50]  is passed", function() {
        expect(ColorContrastCalc.newHslColor([60, 100, 50]).hexCode).to.equal("#ffff00");
      });

      it("expects to return an instance with .hexCode '#ff8000' when [30, 100, 50]  is passed", function() {
        expect(ColorContrastCalc.newHslColor([30, 100, 50]).hexCode).to.equal("#ff8000");
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
    const mintcream = ColorContrastCalc.NAME_TO_COLOR.get("mintcream");
    const yellow = ColorContrastCalc.NAME_TO_COLOR.get("yellow");
    const springgreen = ColorContrastCalc.NAME_TO_COLOR.get("springgreen");
    const fuchsia = ColorContrastCalc.NAME_TO_COLOR.get("fuchsia");
    const azure = ColorContrastCalc.NAME_TO_COLOR.get("azure");

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

    it("expects to return white when mintcream is passed to yellow", function() {
      const aColor = yellow.findBrightnessThreshold(mintcream, "A");
      const aaColor = yellow.findBrightnessThreshold(mintcream, "AA");
      const aaaColor = yellow.findBrightnessThreshold(mintcream, "AAA");
      const newColor = mintcream.newBrightnessColor(105);
      expect(mintcream.calcUpperRatioLimit()).to.equal(105);
      expect(mintcream.isBrighterThan(yellow)).to.be.true;
      expect(newColor.hexCode).to.equal("#ffffff");
      expect(aColor.hexCode).to.equal("#ffffff");
      expect(aaColor.hexCode).to.equal("#ffffff");
      expect(aaaColor.hexCode).to.equal("#ffffff");
    });

    it("expects to return darker green when springgreen is passed to green", function() {
      const aColor = green.findBrightnessThreshold(springgreen, "A");
      expect(green.contrastRatioAgainst(aColor)).to.be.closeTo(3.0, 0.5);
    });

    it("expects to return a darker color when azure is passed to fuchsia", function() {
      const threshold = fuchsia.findBrightnessThreshold(azure, "A");
      expect(azure.isBrighterThan(threshold)).to.be.true;
      expect(fuchsia.contrastRatioAgainst(threshold)).to.be.closeTo(3.0, 0.5);
    });
  });

  describe("findLightnessThreshold", function() {
    const orange = ColorContrastCalc.NAME_TO_COLOR.get("orange");
    const blueviolet = ColorContrastCalc.NAME_TO_COLOR.get("blueviolet");
    const blue = ColorContrastCalc.NAME_TO_COLOR.get("blue");
    const white = ColorContrastCalc.WHITE;
    const black = ColorContrastCalc.BLACK;
    const darkgreen = ColorContrastCalc.NAME_TO_COLOR.get("darkgreen");
    const springgreen = ColorContrastCalc.NAME_TO_COLOR.get("springgreen");
    const green = ColorContrastCalc.NAME_TO_COLOR.get("green");
    const mintcream = ColorContrastCalc.NAME_TO_COLOR.get("mintcream");
    const yellow = ColorContrastCalc.NAME_TO_COLOR.get("yellow");
    const fuchsia = ColorContrastCalc.NAME_TO_COLOR.get("fuchsia");
    const azure = ColorContrastCalc.NAME_TO_COLOR.get("azure");

    context("when the required level is 'A'", function() {
      it("expects to return a darker color when azure is passed to fuchsia", function() {
        const newColor = fuchsia.findLightnessThreshold(azure, "A");
        expect(azure.isBrighterThan(fuchsia)).to.be.true;
        expect(azure.isBrighterThan(newColor)).to.be.true;
        expect(newColor.hexCode).to.equal("#e9ffff");
        expect(newColor.contrastRatioAgainst(fuchsia)).to.be.greaterThan(3.0);
        expect(newColor.contrastRatioAgainst(fuchsia)).to.be.closeTo(3.0, 0.1);
      });

      it("expects to return a lighter green when darkgreen is passed to darkgreen", function() {
        const contrastAgainstWhite = darkgreen.contrastRatioAgainst(white);
        const contrastAgainstBlack = darkgreen.contrastRatioAgainst(black);
        const newColor = darkgreen.findLightnessThreshold(darkgreen, "A");

        expect(darkgreen.isLightColor()).to.be.false;
        expect(contrastAgainstWhite).to.be.greaterThan(contrastAgainstBlack);
        expect(newColor.hexCode).to.equal("#00c000");
        expect(newColor.relativeLuminance).to.be.greaterThan(darkgreen.relativeLuminance);
        expect(newColor.contrastRatioAgainst(darkgreen)).to.be.greaterThan(3.0);
        expect(newColor.contrastRatioAgainst(darkgreen)).to.be.closeTo(3.0, 0.1);
      });
    });

    context("when the required level is 'AA'", function() {
      it("expects to return a darker orange when orange is passed to white", function() {
        const newColor = white.findLightnessThreshold(orange);
        expect(newColor.hexCode).to.equal("#a56a00");
        expect(newColor.contrastRatioAgainst(white)).to.be.greaterThan(4.5);
        expect(newColor.contrastRatioAgainst(white)).to.be.closeTo(4.5, 0.1);
      });

      it("expects to return a darker gree when green is passed to white", function() {
        const newColor = white.findLightnessThreshold(green);
        expect(newColor.hexCode).to.equal("#008a00");
        expect(newColor.contrastRatioAgainst(white)).to.be.greaterThan(4.5);
        expect(newColor.contrastRatioAgainst(white)).to.be.closeTo(4.5, 0.1);
      });

      it("expects to return a lighter orange when orange is passed to blueviolet", function() {
        const newColor = blueviolet.findLightnessThreshold(orange);
        expect(newColor.hexCode).to.equal("#ffdc9a");
        expect(newColor.contrastRatioAgainst(blueviolet)).to.be.greaterThan(4.5);
        expect(newColor.contrastRatioAgainst(blueviolet)).to.be.closeTo(4.5, 0.1);
      });

      it("expects to return a lighter green when darkgreen is passed to darkgreen", function() {
        const contrastAgainstWhite = darkgreen.contrastRatioAgainst(white);
        const contrastAgainstBlack = darkgreen.contrastRatioAgainst(black);
        const newColor = darkgreen.findLightnessThreshold(darkgreen);

        expect(darkgreen.isLightColor()).to.be.false;
        expect(contrastAgainstWhite).to.be.greaterThan(contrastAgainstBlack);
        expect(newColor.relativeLuminance).to.be.greaterThan(darkgreen.relativeLuminance);
        expect(newColor.hexCode).to.equal("#00ea00");
        expect(newColor.contrastRatioAgainst(darkgreen)).to.be.greaterThan(4.5);
        expect(newColor.contrastRatioAgainst(darkgreen)).to.be.closeTo(4.5, 0.1);
      });

      it("expects to return a darker green when springgreen is passed to springgreen", function() {
        const contrastAgainstWhite = springgreen.contrastRatioAgainst(white);
        const contrastAgainstBlack = springgreen.contrastRatioAgainst(black);
        const newColor = springgreen.findLightnessThreshold(springgreen);

        expect(springgreen.isLightColor()).to.be.true;
        expect(contrastAgainstWhite).to.be.lessThan(contrastAgainstBlack);
        expect(newColor.relativeLuminance).to.be.lessThan(springgreen.relativeLuminance);
        expect(newColor.hexCode).to.equal("#007239");
        expect(newColor.contrastRatioAgainst(springgreen)).to.be.greaterThan(4.5);
        expect(newColor.contrastRatioAgainst(springgreen)).to.be.closeTo(4.5, 0.1);
      });

      it("expects to return white when yellow is passed to orange", function() {
        const newColor = orange.findLightnessThreshold(yellow);
        expect(newColor.hexCode).to.equal("#ffffff");
        expect(newColor.contrastRatioAgainst(orange)).to.be.lessThan(4.5);
      });

      it("expects to return white when mintcream is passed to yellow", function() {
        const newColor = yellow.findLightnessThreshold(mintcream);
        expect(newColor.hexCode).to.equal("#ffffff");
        expect(newColor.contrastRatioAgainst(yellow)).to.be.lessThan(4.5);
      });
    });

    context("when the required level is 'AAA'", function() {
      it("expects to return a darker orange when orange is passed to white", function() {
        const newColor = white.findLightnessThreshold(orange, "AAA");
        expect(newColor.hexCode).to.equal("#7b5000");
        expect(newColor.contrastRatioAgainst(white)).to.be.greaterThan(7.0);
        expect(newColor.contrastRatioAgainst(white)).to.be.closeTo(7.0, 0.1);
      });

      it("expects to return a darker gree when green is passed to white", function() {
        const newColor = white.findLightnessThreshold(green, "AAA");
        expect(newColor.hexCode).to.equal("#006800");
        expect(newColor.contrastRatioAgainst(white)).to.be.greaterThan(7.0);
        expect(newColor.contrastRatioAgainst(white)).to.be.closeTo(7.0, 0.1);
      });

      it("expects to return black when blue is passed to green", function() {
        const newColor = green.findLightnessThreshold(blue, "AAA");
        expect(newColor.hexCode).to.equal("#000000");
        expect(newColor.contrastRatioAgainst(green)).to.be.lessThan(7.0);
      });
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

    it("expects to be case insensitive", function() {
      const upperHexYellow = "#FFFF00";
      const lowerHexYellow = "#ffff00";
      const upperYellow = new ColorContrastCalc(upperHexYellow);
      const lowerYellow = new ColorContrastCalc(lowerHexYellow);
      expect(upperYellow.isSameColor(lowerYellow)).to.be.true;
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

