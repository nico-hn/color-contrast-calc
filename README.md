# ColorContrastCalc

Utility that supports you in choosing colors with sufficient contrast, WCAG 2.0 in mind

## Installation

    $ npm install --save color-contrast-calc

## Usage

This library provides `ColorContrastCalc` class.

For example, if you want to calculate the contrast ratio between yellow and black,
save the following code as `yellow-black-contrast.js`:

```node
const ColorContrastCalc = require("color-contrast-calc").ColorContrastCalc;

const yellow = ColorContrastCalc.getByName("yellow");
const black = ColorContrastCalc.getByName("black");

console.log(yellow.contrastRatioAgainst(black));
console.log(yellow.contrastLevel(black));
```

And execute the script:

```
    $ node yellow-black-contrast.js
    19.555999999999997
    AAA
```

Please refer to the [documentation](http://htmlpreview.github.io/?https://github.com/nico-hn/color-contrast-calc/blob/develop/doc/class/lib/color-contrast-calc.js~ColorContrastCalc.html) for the details.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
