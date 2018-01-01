const ColorContrastCalc = require("color-contrast-calc").ColorContrastCalc;

const colorNames = ["red", "yellow", "lime", "cyan", "fuchsia", "blue"];
const colors = colorNames.map(name => ColorContrastCalc.colorFrom(name));

// Sort by hSL order.  An uppercase for a component of color means
// that component should be sorted in descending order.

const hslOrdered = ColorContrastCalc.sort(colors, "hSL").map(color => color.name);
console.log(`Colors sorted in the order of hSL: ${hslOrdered}`);

// Sort by RGB order.

const rgbOrdered = ColorContrastCalc.sort(colors, "RGB").map(color => color.name);
console.log(`Colors sorted in the order of RGB: ${rgbOrdered}`);

// You can also change the precedence of components.

const grbOrdered = ColorContrastCalc.sort(colors, "GRB").map(color => color.name);
console.log(`Colors sorted in the order of GRB: ${grbOrdered}`);

// And you can directly sort hex color codes.

//// Hex color codes that correspond to the color_names given above.
const hexCodes = ["#ff0000", "#ff0", "#00ff00", "#0ff", "#f0f", "#0000FF"];

hslOrderedHexCodes = ColorContrastCalc.sort(hexCodes, "hSL");
console.log(`Colors sorted in the order of hSL: ${hslOrderedHexCodes}`);
