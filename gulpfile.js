const {src, dest, watch, parallel} = require('gulp');

//CSS SASS
const sass = require('gulp-sass')(require('sass')); 
const plumber = require('gulp-plumber'); 
const autoprefixer = require('autoprefixer'); 
const cssnano = require('cssnano'); 
const postcss = require('gulp-postcss'); 
const sourcemaps = require('gulp-sourcemaps'); 

//Imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin'); 
const webp = require('gulp-webp'); 
const avif = require('gulp-avif'); 

function css(done){

    // 1. Identificar archivo SASS
    // 2. Compilar archivo SASS
    // 3. Almacenar archivo

    src('src/scss/**/*.scss') // Indicamos la ruta del archivo
        .pipe(sourcemaps.init())
        .pipe( plumber()) // Ejecutamos plumber
        .pipe( sass() ) // Compilamos el archivo SASS
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe( dest('build/css') ); // Almacenamos el archivo en la carpeta build/css

    done(); // Callback que indica que la tarea ha terminado
}

function imagenes(done){
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'));
    
    done();
}

function versionWebp(done){

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}') // Indicamos la ruta del archivo
        .pipe(webp(opciones))
        .pipe(dest('build/img'));

    done();
}

function versionAvif(done){

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}') // Indicamos la ruta del archivo
        .pipe(avif(opciones))
        .pipe(dest('build/img'));

    done();
}

function dev(done){
    watch("src/scss/**/*.scss", css) // Indicamos la ruta del archivo a observar y la tarea a ejecutar
    done();
}

exports.css = css;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, dev);