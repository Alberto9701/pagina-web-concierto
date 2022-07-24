//las funciones en gulp son tareas
//repetitivas y le tenemos que indicar 
//cuando haya terminado, y lo hacemos con
//un callback
// function tarea(done){
//     console.log("desde la primer tarea");
//     done();
// }
// function tarea2(done){
//     console.log("desde la segunda tarea");
//     done();
// }
//con exports, la funcion tarea estará, 
//disponible para la consola
// exports.tarea=tarea;
// exports.tarea2=tarea2;

/////////////////////////////////////////////////////////////////////////

//primer tarea

const {src,dest, watch, parallel}=require("gulp");//la appi de gulp retorna multiples funciones, por eso se colocan llaves

//estas de abajo son dependencias de CSS
const sass= require("gulp-sass")(require("sass")); //la appi de gulp sass returno una sola funcion
const plumber= require("gulp-plumber");
//estas siguen siendo  dependencias de css pero para autoprefixer cssnano y postcss que son para optimizar el codigo de css que se creo en app.css
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require ("gulp-postcss");
//esta dependencia es para los sourcemaps
const sourcemaps = require("gulp-sourcemaps");


//estas de abajo son dependencias de imagenes
const webp = require("gulp-webp");
//esta dependencia o api de abajo es para aligerar imagenes con gulp
const imagemin = require("gulp-imagemin");
//esta dependencia de abajo es para usar cache en conjunto con imagemin
const cache = require("gulp-cache");
//esta dependencia de abajo es para usar avif, la cual es un tercer formato de imagenes
//la cual en algunas ocasiones es mas ligera que webp, pero que no tiene un buen soporte pero de todos modos lo importamos
const avif = require("gulp-avif");


//estas son dependencias de JavaScript
const terser= require("gulp-terser-js");


function css(done){
    // console.log("compilando sass....");
    //src("src/scss/app.scss")//identificar el archivo .scss a compilar   // solo compilara ese archivo
    src("src/scss/**/*.scss") // esta identificar todos los archivos con terminacion scss
        .pipe( sourcemaps.init()) //inicialisamos los sourcemaps
        .pipe(plumber()) //plumber es para que la ejecucion de gulp no se vea interrumpida
        .pipe(sass()) //compilarlo
        .pipe( postcss([autoprefixer(), cssnano() ]))  //con esto se optimiza en codigo de css, esto se ejecutara al ejecutar en consola unicamente (gulp css) solo la funcion css, por que si llamamos a dev, no se activara por el watch que tiene
        .pipe(sourcemaps.write(".")) //aqui indicamos en donde se guardaran los sourcemaps, le ponemos un punto para indicar que los queremos en la misma carpeta que el css
        .pipe(dest("build/css")) //almacenarla en el disco duro
    
    done();
}

//funcion para aligerar imagenes
function imagenes(done){
    const opciones = {
        optimizationLevel: 3  //aligerara las imagenes en un nivel de 3
    }

    src("src/img/**/*.{png,jpg}")
        .pipe(cache(imagemin(opciones))) //importamos una nueva dependencia para usar cache la cual es (npm i --save-dev gulp-cache)
        .pipe(dest("build/img"))
    done();
}



//funcion que convetira todas nuestras imagenes a webp
function versionWebp(done){
    const opciones= {
        quality: 50 //las imagenes tendran una calidad de 50
    };

    src("src/img/**/*.{png,jpg}") // esta line indica que buscara todos los archivos que encuentre en la carpeta img, que terminen con extension png y jpg
        .pipe( webp(opciones) ) //importamos una dependencia la cual es (npm i --save-dev gulp-webp)
        .pipe( dest("build/img"))
    done();
}

//funcion que convertira todas nuestras imagenes a avif
function versionAvif(done){
    const opciones = {
        quality: 50
    }
    src("src/img/**/*.{jpg,png}")
        .pipe(avif(opciones))
        .pipe(dest("build/img"))
    done();
}

//funcion de javascript
function javascript(done){
    src("src/js/**/*.js")
        .pipe(sourcemaps.init()) //inicializamos los sourcemaps de javaScript
        .pipe(terser()) //para mejorar el codigo de javascript
        .pipe(sourcemaps.write(".")) //el punto es para guardar en la misma carpeta build/ja
        .pipe(dest("build/js"))
    done();
}

function dev( done ){
    //watch toma 2 parametros 1, a que archivo
    //le vamos a dar watch y su carpeta,
    // y 2 que funcion esta asociada
    //basicamente watch es para que los cambios
    //se apliquen automaticamente
    // watch("src/scss/app.scss",css);
    watch("src/scss/**/*.scss",css); //esta linea indica que se aplicara el watch a todos los archivos con
    //terminacion scss, es decir estara al pendiente de los cambios en cualquier archivo
    //ya que anteriormente teniamos que ir a app.scss y guardar cambios para ejecutar los cambios de los
    //demas archivos

    //este watch es para el archivo javascript
    watch("src/js/**/*.js",javascript);

    done();
}


exports.css=css;
//podemos indicar que queremos usar la funcion o....
exports.versionWebp=versionWebp;
// exports.dev=dev;
exports.imagenes= imagenes
exports.versionAvif = versionAvif
exports.js=javascript;

//usando la funcion parallel que nos brinda gulp
//podemos hacer una ejecucion en paralelo de distintas funciones
exports.dev = parallel(imagenes,versionWebp, versionAvif, javascript, dev);
//arriba, llamamos a la funcion versionWebp y despues a la funcion dev



