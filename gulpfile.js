const gulp = require("gulp");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const babelify = require("babelify");

gulp.task("es5", () => browserify("./index.js",
                                  { standalone: "ColorContrastCalc" })
          .transform(babelify)
          .bundle()
          .pipe(source("color-contrast-calc-es5.js"))
          .pipe(gulp.dest("./dist/")));

gulp.task("es6", () => browserify("./index.js",
                                  { standalone: "ColorContrastCalc" })
          .bundle()
          .pipe(source("color-contrast-calc-es6.js"))
          .pipe(gulp.dest("./dist/")));


gulp.task("default", gulp.parallel("es5", "es6"));
