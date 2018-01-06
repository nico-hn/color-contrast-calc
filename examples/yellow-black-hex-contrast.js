const ContrastChecker = require("color-contrast-calc").ContrastChecker;

const [yellow, black] = ["#ff0", "#000000"];
// or
// [yellow, black] = [[255, 255, 0], [0, 0, 0]];
const ratio = ContrastChecker.contrastRatio(yellow, black);

console.log(`Contrast ratio between yellow and black: ${ratio}`);
console.log(`Contrast level: ${ContrastChecker.ratioToLevel(ratio)}`);
