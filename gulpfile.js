var fs = require('fs');
var gulp = require('gulp');

var pkg = {
  name: 'angular-message-center',
  bower: 'bower_components/',
  dist: 'dist',
  build: 'build'
};

pkg.paths = {
  cssMaps: [
    pkg.bower + 'bootstrap/dist/css/bootstrap.css.map',
    pkg.bower + 'fontawesome/css/font-awesome.css.map'
  ],
  baseHtml: ['src/index.html'],
  baseSass: ['src/scss/app.scss'],
  bowerDirectory: 'bower_components',
  bowerFile: 'bower.json',
  dist: {
    css: pkg.dist + '/css',
    fonts: pkg.dist + '/fonts',
    js: pkg.dist + '/js',
    docs: pkg.dist + '/docs'
  },
  docs: {
    sources: 'user-docs-sources',
    pdfBuild: pkg.build + '/docs/pdf',
    appBuild: pkg.build + '/docs/app',
    products: [
      pkg.build + '/docs/app/**/*.png'
    ],
    pdfs: pkg.build + '/docs/app/**/*.pdf'
  },
  i18n: {
    strings: 'lang',
    stringsSrc: 'lang/*.strings',
    dictionary: pkg.build + '/i18n',
  },
  fonts: [
    pkg.bower + 'bootstrap/fonts/*',
    pkg.bower + 'fontawesome/fonts/*'
  ],
  js: [
    'src/**/*.js',
    pkg.build + '/docs/**/*.js',
    pkg.build + '/i18n/**/*.js'
  ],
  sass: [
    'src/scss/*.scss'
  ],
  templates: [
    'src/app/**/*.html',
    pkg.build + '/docs/**/*.html'
  ]
};

pkg.paths = require('./gulp/util/build-paths')(pkg.paths);

var tasks = fs.readdirSync('./gulp/tasks/');
tasks.forEach(function(task) {
  require('./gulp/tasks/' + task)(pkg);
});

// Build tasks
gulp.task('build-app', ['build-js', 'build-css', 'docs-app', 'i18n']);
gulp.task('build-vendor', ['build-vendor-js', 'build-vendor-css']);
gulp.task('build', ['build-app', 'build-vendor', 'copies', 'copy-doc-pdfs', 'docs']);
gulp.task('copies', ['copy-base-html', 'copy-doc-assets', 'copy-css-maps', 'copy-fonts']);
gulp.task('i18n', ['build-dictionary', 'process-dictionary']);

// Docs tasks
gulp.task('docs-app', ['build-client-docs', 'build-docs-indexes']);
gulp.task('docs', ['docs-app', 'generate-docs-pdfs']);

// Collect user-facing strings for i18n
gulp.task('gen-strings', ['scan-strings', 'write-source-dict']);

// Dev tasks
gulp.task('default', ['build', 'connect', 'watches']);
gulp.task('fast', ['build-app', 'connect', 'copies', 'watches']);
