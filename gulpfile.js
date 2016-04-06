var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sh = require('shelljs');
var karma = require('karma').server;

gulp.task('jshint', function () {
    gulp
        .src(['./www/js/**/*.js', './tests/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
    ;
});

gulp.task('mocha', function (done) {
    sh.exec('mocha', done);
});

gulp.task('start', function (done) {
    sh.exec('node app.js', done);
});

gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/tests/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('release', ['jshint', 'mocha', 'test']);

gulp.task('default', ['jshint', 'mocha', 'test', 'start']);

gulp.task('replace', function (done) {
    var replace = require('gulp-replace');

    gulp.src(['public/semantic/dist/semantic.min.css'])
        //.pipe(replace(/https:\/\/fonts.googleapis.com\/css/g, 'http://fonts.useso.com/css'))
        .pipe(replace(/https:\/\/fonts.googleapis.com\/css/g, ''))
        .pipe(gulp.dest('public/semantic/dist/'))
    ;

    done();
});

gulp.task('saveGraph', function (done) {
    var GraphWorld = require('./cube/graph.js');
    var CubeWorld = require('./cube/cube.js');
    var Iterator = require('./cube/iterator.js');

    var cube = CubeWorld.Cube.getPristineCube();
    var iter = new Iterator.CubeIterator();
    var g = iter.traverse(cube);

    var fs = require('fs');
    fs.writeFileSync('./cube.csv', g.serializeToCSV());

    done();
});

gulp.task('breathFirst', function(done){
    var GraphWorld = require('./cube/graph.js');
    var CubeWorld = require('./cube/cube.js');
    var Iterator = require('./cube/iterator.js');

    var cube = CubeWorld.Cube.getPristineCube();
    var iter = new Iterator.CubeIterator();
    var g = iter.breadthFirstTraverse(cube);

    var fs = require('fs');
    fs.writeFileSync('./cube.csv', g.serializeToCSV());

    done();
});