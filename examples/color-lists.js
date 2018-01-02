const ColorContrastCalc = require("color-contrast-calc").ColorContrastCalc;

// Named colors
const namedColors = ColorContrastCalc.NAMED_COLORS;

console.log(`The number of named colors: ${namedColors.length}`);
console.log(`The first of named colors: ${namedColors[0].name}`);
console.log(`The last of named colors: ${namedColors[namedColors.length-1].name}`);

// Web safe colors
const webSafeColors = ColorContrastCalc.WEB_SAFE_COLORS;

console.log(`The number of web safe colors: ${webSafeColors.length}`);
console.log(`The first of web safe colors: ${webSafeColors[0].name}`);
console.log(`The last of web safe colors: ${webSafeColors[webSafeColors.length-1].name}`);

// HSL colors
const hslColors = ColorContrastCalc.hslColors();

console.log(`The number of HSL colors: ${hslColors.length}`);
console.log(`The first of HSL colors: ${hslColors[0].name}`);
console.log(`The 60th of HSL colors: ${hslColors[60].name}`);
console.log(`The 120th of HSL colors: ${hslColors[120].name}`);
console.log(`The last of HSL colors: ${hslColors[hslColors.length-1].name}`);
