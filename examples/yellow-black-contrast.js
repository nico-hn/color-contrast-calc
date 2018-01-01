const ColorContrastCalc = require("color-contrast-calc").ColorContrastCalc;

const yellow = ColorContrastCalc.colorFrom("yellow");
const black = ColorContrastCalc.colorFrom("black");

console.log(`contast ratio between yellow and black: ${yellow.contrastRatioAgainst(black)}`);
console.log(`contrast level: ${yellow.contrastLevel(black)}`);
