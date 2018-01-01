# ColorContrastCalc

`ColorContrastCalc` is a Utility that helps you choose colors with
sufficient contrast, WCAG 2.0 in mind.

With this library, you can do following things:

* Check the contrast ratio between two colors
* Find (if exists) a color that has sufficient contrast to a given color
* Create a new color from a given color by adjusting properties of the latter
* Sort colors

## Installation

    $ npm install --save color-contrast-calc

## Usage

This library provides `ColorContrastCalc` class.

### Representing a color

To Represent a color, `Color` class is provided.
And most of the operations in this library use this class.

For example, if you want to create an instance of `Color` for red,
you may use a method `ColorContrastCalc.colorFrom()`.

Save the following code as `color-instance.js`:

```node
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
```

And execute the script:

```
$ node color-instance.js
true
red
#ff0000
[ 255, 0, 0 ]
[ 0, 100, 50 ]
```

### Example 1: Calculate the contrast ratio between two colors

If you want to calculate the contrast ratio between yellow and black, save the following code as `yellow-black-contrast.js`:

```node
const ColorContrastCalc = require("color-contrast-calc").ColorContrastCalc;

const yellow = ColorContrastCalc.colorFrom("yellow");
const black = ColorContrastCalc.colorFrom("black");

console.log(`contast ratio between yellow and black: ${yellow.contrastRatioAgainst(black)}`);
console.log(`contrast level: ${yellow.contrastLevel(black)}`);
```

And execute the script:

```
$ node yellow-black-contrast.js
contast ratio between yellow and black: 19.555999999999997
contrast level: AAA
```

### Example 2: Find colors that have enough contrast ratio with a given color

If you want to find a combination of colors with sufficient contrast
by changing the brightness/lightness of one of those colors, save the
following code as `yellow-orange-contrast.js`:

```node
const ColorContrastCalc = require("color-contrast-calc").ColorContrastCalc;

const yellow = ColorContrastCalc.colorFrom("yellow");
const orange = ColorContrastCalc.colorFrom("orange");

// Find brightness adjusted colors.
let aOrange = yellow.findBrightnessThreshold(orange, "A");
let aContrastRatio = yellow.contrastRatioAgainst(aOrange);
let aaOrange = yellow.findBrightnessThreshold(orange, "AA");
let aaContrastRatio = yellow.contrastRatioAgainst(aaOrange);

console.log("# Brightness adjusted colors")
console.log(`aOrange: ${aOrange.hexCode}`);
console.log(`contrast ratio between yellow and aOrange: ${aContrastRatio}`);
console.log(`aaOrange: ${aaOrange.hexCode}`);
console.log(`contrast ratio between yellow and aaOrange: ${aaContrastRatio}`);

// Find lightness adjusted colors.
aOrange = yellow.findLightnessThreshold(orange, "A");
aContrastRatio = yellow.contrastRatioAgainst(aOrange);
aaOrange = yellow.findLightnessThreshold(orange, "AA");
aaContrastRatio = yellow.contrastRatioAgainst(aaOrange);

console.log("# Lightness adjusted colors")
console.log(`aOrange: ${aOrange.hexCode}`);
console.log(`contrast ratio between yellow and aOrange: ${aContrastRatio}`);
console.log(`aaOrange: ${aaOrange.hexCode}`);
console.log(`contrast ratio between yellow and aaOrange: ${aaContrastRatio}`);
```

And execute the script:

```
$ node yellow-orange-contrast.js
# Brightness adjusted colors
aOrange: #c68000
contrast ratio between yellow and aOrange: 3.013798229247296
aaOrange: #9d6600
contrast ratio between yellow and aaOrange: 4.512053816540577
# Lightness adjusted colors
aOrange: #c78000
contrast ratio between yellow and aOrange: 3.0011856639235854
aaOrange: #9d6600
contrast ratio between yellow and aaOrange: 4.512053816540577
```
### Example 3: Grayscale of given colors

For getting grayscale, `ColorContrastCalc::Color` has an instance method
`newGrayscaleColor()`.
For example, save the following code as `grayscale.js`:

```node
const ColorContrastCalc = require("color-contrast-calc").ColorContrastCalc;

const yellow = ColorContrastCalc.colorFrom("yellow");
const orange = ColorContrastCalc.colorFrom("orange");
const yellowGrayscale = yellow.newGrayscaleColor();
const orangeGrayscale = orange.newGrayscaleColor();

console.log(`The grayscale of ${yellow.hexCode} is ${yellowGrayscale.hexCode}`);
console.log(`The grayscale of ${orange.hexCode} is ${orangeGrayscale.hexCode}`);
```

And execute the script:

```
$ node grayscale.js
The grayscale of #ffff00 is #ededed
The grayscale of #ffa500 is #acacac
```

And other than `newGrayscaleColor`, following instance methods
are available for `Color`:

* `newBrightnessColor`
* `newContrastColor`
* `newHueRotateColor`
* `newInvertColor`
* `newSaturateColor`

### Example 4: Sort colors

You can sort colors using a method `ColorContrastCalc.sort()'

And by passing the second argument to this method, you can also specify
the sort order.

For example, save the following code as `sort-colors.js`:

```node
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
```

And execute the script:

```
$ node sort-colors.js
Colors sorted in the order of hSL: red,yellow,lime,cyan,blue,fuchsia
Colors sorted in the order of RGB: yellow,fuchsia,red,cyan,lime,blue
Colors sorted in the order of GRB: yellow,cyan,lime,fuchsia,red,blue
Colors sorted in the order of hSL: #ff0000,#ff0,#00ff00,#0ff,#0000FF,#f0f
```

Please refer to the [documentation](http://htmlpreview.github.io/?https://github.com/nico-hn/color-contrast-calc/blob/develop/doc/class/lib/color-contrast-calc.js~ColorContrastCalc.html) for the details.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
