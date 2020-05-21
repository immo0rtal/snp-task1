let project_folder = "dist";
let source_folder = "src";

let path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    img: project_folder + "/images/",
    fonts: project_folder + "/fonts/",
  },
  src: {
    html: source_folder + "/*.html",
    css: source_folder + "/scss/style.scss",
    img: source_folder + "/images/**/*.{jpg, png, svg, gif, ico, webp}",
    fonts: source_folder + "/fonts/*.ttf",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss",
    img: source_folder + "/images/**/*.{jpg, png, svg, gif, ico, webp}",
  },
  clean: "./" + project_folder + "/",
};

let { src, dest } = require("gulp"),
  gulp = require("gulp"),
  del = require("del"),
  scss = require("gulp-sass"),
  clean_css = require("gulp-clean-css"),
  autoprefixer = require("gulp-autoprefixer"),
  group_media = require("gulp-group-css-media-queries"),
  rename = require("gulp-rename"),
  browsersync = require("browser-sync").create();

function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/",
    },
    port: 3000,
    notify: false,
  });
}

function html() {
  return src(path.src.html)
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded",
      })
    )
    .pipe(group_media())
    .pipe(
      autoprefixer({
        overrideBrowserlist: ["last 5 versions"],
        cascade: true,
      })
    )
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function watchFiles(params) {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
}

function clear(params) {
  return del(path.clean);
}

let build = gulp.series(clear, gulp.parallel(css, html));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
