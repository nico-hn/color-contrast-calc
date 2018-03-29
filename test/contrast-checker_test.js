"use strict";

const expect = require("chai").expect;
const Checker = require("../lib/contrast-checker").ContrastChecker;


describe("ContrastChecker", () => {
  const MIN_CONTRAST = 1.0;
  const MAX_CONTRAST = 21.0;
  const RGB_BLACK = [0, 0, 0];
  const RGB_WHITE = [255, 255, 255];

  describe("static methods", function() {
    describe("contrastRatio", () => {
      it("expects to return MAX_CONTRAST when white and black are passed", function() {
        expect(Checker.contrastRatio(RGB_BLACK, RGB_WHITE)).to.equal(MAX_CONTRAST);
      });

      it("expects to return MIN_CONTRAST when white and white are passed", function() {
        expect(Checker.contrastRatio(RGB_WHITE, RGB_WHITE)).to.equal(MIN_CONTRAST);

      });

      it("expects to return 4.23 when white and [127, 127, 32] are passed", function() {
        expect(Checker.contrastRatio(RGB_WHITE, [127, 127, 32])).to.be.closeTo(4.23, 0.01);
      });

      it("expects to return 4.23 when #ffffff and #7f7f20 are passed", function() {
        expect(Checker.contrastRatio("#ffffff", "#7f7f20")).to.be.closeTo(4.23, 0.01);
      });
    });

    describe("isLightColor", function() {
      it("expects to return true when [118, 118, 118] is passed", function() {
        expect(Checker.isLightColor([118, 118, 118])).to.be.true;
      });

      it("expects to return true when [117, 117, 117] is passed", function() {
        expect(Checker.isLightColor([117, 117, 117])).to.be.false;
      });
    });
  });
});
