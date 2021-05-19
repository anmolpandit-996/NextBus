const gulp = require("gulp");
const { src, dest, parallel } = require("gulp");
const concat = require("gulp-concat");
const htmlReplace = require("gulp-html-replace");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");

function html() {
  return src("src/*.html")
    .pipe(
      htmlReplace({
        css: "styles/all-styles.css",
        js: "scripts/bundle.js",
      })
    )
    .pipe(dest("dist"));
}

function styles() {
  return src("src/styles/*.css")
    .pipe(sourcemaps.init())
    .pipe(concat("all-styles.css"))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(dest("dist/styles/"));
}

function scripts() {
  return src(["src/scripts/app.js"])
    .pipe(sourcemaps.init())
    .pipe(concat("bundle.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(dest("dist/scripts/"));
}

function images() {
  return src("src/images/*").pipe(imagemin()).pipe(dest("dist/images"));
}

exports.default = parallel(html, styles, scripts, images);
