"use strict";

const expect = require("chai").expect;
const ColorUtils = require("../lib/color-utils").ColorUtils;

describe("ColorUtils", function() {
  describe("normalizeHexCode", function() {
    it("expects to return 'ffa500' when '#ffa500' is passed", function() {
      expect(ColorUtils.normalizeHexCode("#ffa500")).to.equal("ffa500");
    });

    it("expects to return 'FFA500' when '#FFA500' is passed", function() {
      expect(ColorUtils.normalizeHexCode("#FFA500")).to.equal("FFA500");
    });

    it("expects to return 'ffaa00' when '#fa0' is passed", function() {
      expect(ColorUtils.normalizeHexCode("#fa0")).to.equal("ffaa00");
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
