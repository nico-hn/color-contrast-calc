# ColorContrastCalc

Utility that supports you in choosing colors with sufficient contrast, WCAG 2.0 in mind

## Installation

    $ npm install --save color-contrast-calc

## Usage

This library provides `ColorContrastCalc` class.

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

Please refer to the [documentation](http://htmlpreview.github.io/?https://github.com/nico-hn/color-contrast-calc/blob/develop/doc/class/lib/color-contrast-calc.js~ColorContrastCalc.html) for the details.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
