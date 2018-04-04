const ColorContrastCalc = require("color-contrast-calc").ColorContrastCalc;

const yellow = ColorContrastCalc.colorFrom("yellow");
const orange = ColorContrastCalc.colorFrom("orange");

// Find brightness adjusted colors.
let aOrange = yellow.findBrightnessThreshold(orange, "A");
let aContrastRatio = yellow.contrastRatioAgainst(aOrange);
let aaOrange = yellow.findBrightnessThreshold(orange, "AA");
let aaContrastRatio = yellow.contrastRatioAgainst(aaOrange);

console.log("# Brightness adjusted colors");
console.log(`aOrange: ${aOrange.hexCode}`);
console.log(`contrast ratio between yellow and aOrange: ${aContrastRatio}`);
console.log(`aaOrange: ${aaOrange.hexCode}`);
console.log(`contrast ratio between yellow and aaOrange: ${aaContrastRatio}`);

// Find lightness adjusted colors.
aOrange = yellow.findLightnessThreshold(orange, "A");
aContrastRatio = yellow.contrastRatioAgainst(aOrange);
aaOrange = yellow.findLightnessThreshold(orange, "AA");
aaContrastRatio = yellow.contrastRatioAgainst(aaOrange);

console.log("# Lightness adjusted colors");
console.log(`aOrange: ${aOrange.hexCode}`);
console.log(`contrast ratio between yellow and aOrange: ${aContrastRatio}`);
console.log(`aaOrange: ${aaOrange.hexCode}`);
console.log(`contrast ratio between yellow and aaOrange: ${aaContrastRatio}`);
