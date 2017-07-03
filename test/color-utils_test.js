"use strict";

const expect = require("chai").expect;
const ColorUtils = require("../lib/color-utils").ColorUtils;

describe("ColorUtils", function() {
  describe("decimalRound", function() {
    it("expects to return 3.14 when 3.14159 and 2 are passed", function() {
      expect(ColorUtils.decimalRound(3.14159, 2)).to.equal(3.14);
    });

    it("expects to return 3.1416 when 3.14159 and 4 are passed", function() {
      expect(ColorUtils.decimalRound(3.14159, 4)).to.equal(3.1416);
    });
  });
});
