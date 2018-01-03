const ContrastChecker = require("color-contrast-calc").ContrastChecker;

const [yellow, black] = ["#ff0", "#000000"];
const ratio = ContrastChecker.contrastRatio(yellow, black);

console.log(`contast ratio between yellow and black: ${ratio}`);
console.log(`contrast level: ${ContrastChecker.ratioToLevel(ratio)}`);
