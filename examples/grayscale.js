const ColorContrastCalc = require("color-contrast-calc").ColorContrastCalc;

const yellow = ColorContrastCalc.colorFrom("yellow");
const orange = ColorContrastCalc.colorFrom("orange");
const yellowGrayscale = yellow.withGrayscale();
const orangeGrayscale = orange.withGrayscale();

console.log(`The grayscale of ${yellow.hexCode} is ${yellowGrayscale.hexCode}`);
console.log(`The grayscale of ${orange.hexCode} is ${orangeGrayscale.hexCode}`);
