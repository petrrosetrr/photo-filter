const gulp = require("gulp");
const sync = require("browser-sync").create();

// Server
const server = (done) => {
  sync.init({
    server: {
      baseDir: "."
    },
    cors: true
  });
  done();
}
exports.server = server;

// Watcher
const watcher = () => {
  // gulp.watch("srcs/scss/**/*.scss", gulp.series(styles));
  gulp.watch("*.html").on("change", sync.reload);
  gulp.watch("*.js").on("change", sync.reload);
  gulp.watch("*.{jpg,png,svg}").on("change", sync.reload);
}

exports.default = gulp.series(
  server, watcher
);
