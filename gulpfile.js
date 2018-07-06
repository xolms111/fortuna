var gulp 		 = require('gulp'),
    concat		 = require('gulp-concat'),
    browserSync  = require('browser-sync'),
    uglify   	 = require('gulp-uglify'),
    sass 		 = require('gulp-sass'),
    sourcemaps   = require('gulp-sourcemaps'),
    imagemin     = require('gulp-imagemin'),
    babel        = require('gulp-babel'),
    jadeGlobbing = require('gulp-jade-globbing'),
    pngquant     = require('imagemin-pngquant'),
    autoprefixer = require('gulp-autoprefixer'),
    jade		 = require('gulp-jade'),
    spritesmith	 = require('gulp.spritesmith'),
    clean		 = require('gulp-rimraf'),
    cleanCSS     = require('gulp-clean-css'),
    sassGlob     = require('gulp-sass-glob'),
    plumber	 	 = require('gulp-plumber');


/* --------- paths --------- */
var paths = {
    sass: {
        src: 'dev/sass/**/*.sass',
        location: 'dev/sass/styles.sass',
        components: 'dev/components/**/*.sass',
        destination: 'build/css'
    },

    js: {
        src: 'dev/js/**/*.js',
        component: 'dev/js',
        plugins: 'dev/plugins/install/*.js',
        components: 'dev/components/**/*.js',
        destination: 'build/js'
    },

    jade: {
        src: 'dev/jade/**/*.jade',
        location: 'dev/jade/*.jade',
        components: 'dev/components/**/*.jade',
        destination: 'build'
    },
    fonts: {
        src: 'dev/fonts/**/*.*',
        destination: 'build/fonts'
    },
    images: {
        src: 'dev/images/**/*.*',
        destination: 'build/images'
    },
    sprites: {
        src: 'dev/sprites/**/*.png',
        destination: 'build/images/',
        sass: 'dev/sass/'
    }
};

/* ----- jade ----- */
gulp.task('jade-compile', function () {
    gulp.src(paths.jade.location)
        .pipe(jadeGlobbing())
        .pipe(plumber())
        .pipe(jade({
            pretty: '\t'
        }))
        .pipe(gulp.dest(paths.jade.destination))
});

/* ------ less ------ */
gulp.task('sass-compile', function () {
    gulp.src(paths.sass.location)
        .pipe(sassGlob())
        .pipe(plumber())
        .pipe(sass())
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(concat("main.min.css"))
        .pipe(cleanCSS({
            inline: ['none']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.sass.destination));

});

/* -------- concat js custom -------- */
gulp.task('concat-js', function () {
    return gulp.src(paths.js.src)
        .pipe(plumber())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.js.destination));
});

/* -------- concat js plugins -------- */
gulp.task('concat-js-plugins', function () {
    return gulp.src(paths.js.plugins)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('plugins.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.js.destination));
});
gulp.task('concat-js-components', function () {
   return gulp.src(paths.js.components)
       .pipe(concat('components.js'))
       .pipe(gulp.dest(paths.js.component))
});

/* -------- clean prod/js -------- */
gulp.task('clean', function() {
    return gulp.src('build/js/*.js', { read: false })
        .pipe(rimraf());
});
gulp.task('image-compile', function () {
    gulp.src(paths.images.src)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(paths.images.destination));
});

/* -------- auto sprites  -------- */
gulp.task('sprite', function () {
    var spriteData = gulp.src('dev/sprites/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            imgPath: '../images/sprite.png',
            cssName: 'sprite.sass',
            padding: 10,
            algorithm: 'left-right'
        }));
    spriteData.img.pipe(gulp.dest(paths.sprites.destination));
    spriteData.css.pipe(gulp.dest(paths.sprites.sass));
});

/* -------- gulp server  -------- */
gulp.task('server', function () {
    browserSync({
        port: 9000,
        server: {
            baseDir: ["dev", "build"]
        }
    });
});

/* -------- gulp watching  -------- */
gulp.task('watch', function () {
    gulp.watch([paths.jade.src, paths.jade.components], ['jade-compile']);
    gulp.watch([paths.sass.src, paths.sass.components], ['sass-compile']);
    gulp.watch(paths.js.components, ['concat-js-components']);
    gulp.watch(paths.js.src, ['concat-js']);
    gulp.watch(paths.sprites.src, ['sprite']);
    gulp.watch(paths.images.src, ['image-compile']);
    gulp.watch(paths.js.plugins, ['concat-js-plugins']);
    gulp.watch([
        'build/*.html',
        'build/css/*.css',
        paths.js.src
    ]).on('change', browserSync.reload);
});

gulp.task('default', [
    'jade-compile',
    'sass-compile',
    'concat-js',
    'image-compile',
    'concat-js-plugins',
    'server',
    'concat-js-components',
    'sprite',
    'watch'
]);

// ===================== Functions ======================

// Working with the errors
var log = function (error) {
    console.log([
        '',
        "----------ERROR MESSAGE START----------",
        ("[" + error.name + " in " + error.plugin + "]"),
        error.message,
        "----------ERROR MESSAGE END----------",
        ''
    ].join('\n'));
    this.end();
}
