const {src, dest, series, watch} = require('gulp')
const Sass = require('gulp-sass')(require('sass'))
const Pug = require('gulp-pug')
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const sync = require('browser-sync').create()


function pug() {
    return src('src/index.pug')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(Pug())
    .pipe(dest('dist'))
}


function html() {
    return src('src/**.html')
      .pipe(include({
        prefix: '@@'
      }))
      .pipe(htmlmin({
        collapseWhitespace: true
      }))
      .pipe(dest('dist'))
  }  

async function sass() {
    return await setTimeout(() => {
        src('src/sass/**.sass')
      .pipe(Sass())
      .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions']
      }))
      .pipe(csso())
      .pipe(concat('index.css'))
      .pipe(dest('dist'))
    }, 0)
  } 
  
  function clear() {
    return del('dist')
  }
  
  function serve() {
    sync.init({
      server: './dist'
    })
  
    watch('src/**.pug', series(pug)).on('change', sync.reload)
    watch('src/**.html', series(html)).on('change', sync.reload)
    watch('src/sass/**.sass', series(sass)).on('change', sync.reload)
  }

  exports.pug = pug
  exports.sass = sass
  exports.html = html
  exports.build = series(clear, sass, pug, html)
  exports.serve = series(clear, sass, pug, html, serve)
  exports.clear = clear
  