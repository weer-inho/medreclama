const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");

// Styles

const styles = () => {
  return gulp.src("root/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(sourcemap.write("."))
    .pipe(rename("style.css"))
    .pipe(gulp.dest("root/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// clean build

const clean = () => {
  return del("build");
};

exports.clean = clean;

// copy into build

const copy = () => {
  return gulp.src([
    "root/fonts/**/*.{woff, woff2}",
    "root/js/**",
    "root/css/**",
    "root/img/**",
    "root/*.ico"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
};

exports.copy = copy;

// Images

const images = () => {
  return gulp.src("root/img/**/*.{jpg, png, svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"))
};

exports.images = images;

// images to webp

const createWebp = () => {
  return gulp.src("root/img/**/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;

// svg sprite

const sprite = () => {
  return gulp.src("root/img/**/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
}

exports.sprite = sprite;

const html = () => {
  return gulp.src("root/*.html")
    .pipe(gulp.dest("build"))
    .pipe(sync.stream());
};

exports.html = html;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'root'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// build

const build = gulp.series(
  clean,
  gulp.parallel(
  copy,
  html,
  images,
  )
);

exports.build = build;

// Watcher

const watcher = () => {
  gulp.watch("root/less/**/*.less", gulp.series("styles"));
  gulp.watch("root/js/**.js");
  gulp.watch("root/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  styles, server, watcher
);
