"use strict";

const process = require("process");
const fs = require("fs");
const dust = require("dustjs-linkedin");
const ColorContrastCalc = require("../lib/color-contrast-calc").ColorContrastCalc;

const baseColorName = process.argv[2];

if (! baseColorName) {
  console.log("Please give a color name at the command line.");
  process.exit();
}

console.log(baseColorName);

dust.config.whitespace = true;

const baseColor = ColorContrastCalc.getByName(baseColorName);
const criteria =   ["A", "AA", "AAA"];

const templateSrc = fs.readFileSync("samples/views/sufficient-contrast.dust", "utf8");
const templateCssSrc = fs.readFileSync("samples/views/sufficient-contrast_css.dust", "utf8");
const compiled = dust.compile(templateSrc, "list");
const compiledCss = dust.compile(templateCssSrc, "css");

dust.loadSource(compiled);
dust.loadSource(compiledCss);


const colors = ColorContrastCalc.NAMED_COLORS.map(otherColor => {
  const values = {};
  criteria.forEach(c => {
    const newColor = baseColor.findBrightnessThreshold(otherColor, c);
    values["name"] = otherColor.name;
    values["hex"] = otherColor.hexCode;
    values["contrast"] = Math.round(baseColor.contrastRatioAgainst(otherColor) * 10000) / 10000;
    values["level"] = baseColor.contrastLevel(otherColor);
    values[c] = newColor.hexCode;
    values[`${c}_contrast`] = Math.round(baseColor.contrastRatioAgainst(newColor) * 10000) / 10000;
    values[`${c}_satisfied`] = baseColor.hasSufficientContrast(newColor, c) ? "yes" : "no";
    values[`${c}_grayscale`] = newColor.newGrayscaleColor(100).hexCode;
  });
  return values;
});

const data = { "title": baseColorName, "baseGrayscale": baseColor.newGrayscaleColor(100).hexCode, "colors": colors };

dust.render("list", data, function(err, out) {
  //process.stdout.write(out);
  fs.writeFileSync(`samples/sufficient-contrast_${data["title"]}.html`, out, "utf8");
});

dust.render("css", data, function(err, out) {
  //process.stdout.write(out);
  fs.writeFileSync(`samples/sufficient-contrast_${data["title"]}.css`, out, "utf8");
});

//process.stdout.write(JSON.stringify(colors));

//sufficient-contrast_{title}.css
