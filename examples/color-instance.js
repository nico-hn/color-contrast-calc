const ColorContrastCalc = require("color-contrast-calc").ColorContrastCalc;
const Color = require("color-contrast-calc").Color;

// Create an instance of Color from a hex code
// (You can pass 'red' or [255, 0, 0] instead of "#ff0000")
const red = ColorContrastCalc.colorFrom("#ff0000");
console.log(red instanceof Color);
console.log(red.name);
console.log(red.hexCode);
console.log(red.rgb);
console.log(red.hsl);
