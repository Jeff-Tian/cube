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

gulp.task('breathFirst', function (done) {
    // var GraphWorld = require('./cube/graph.js');
    // var CubeWorld = require('./cube/cube.js');
    // var Iterator = require('./cube/iterator.js');
    //
    // var cube = CubeWorld.Cube.getPristineCube();
    // var iter = new Iterator.CubeIterator();
    // var g = iter.breadthFirstTraverse(cube);
    //
    // var fs = require('fs');
    // fs.writeFileSync('./cube.csv', g.serializeToCSV());
    //
    // done();


    // var CubeWorld = require('./cube/cube.js');
    // var Iterator = require('./cube/iterator.js');
    // var iter = new Iterator.CubeIterator();
    // iter.breadthFirstTraverseLite(CubeWorld.Cube.getPristineCube());
    //
    // done();

    // var CubeLite = require('./cube/cube-lite');
    // var Iterator = require('./cube/iterator');
    // var iter = new Iterator.CubeIterator();
    // iter.breadthFirstTraverseFile(CubeLite.getPristineCube());
    //
    // done();

});

gulp.task('bfl', function (done) {
    var CubeWorld = require('./cube/cube.js');
    var Iterator = require('./cube/iterator.js');
    var iter = new Iterator.CubeIterator();
    iter.breadthFirstTraverseLite(CubeWorld.Cube.getPristineCube());

    done();
});

gulp.task('fast', function (done) {
    var CubeLite = require('./cube/cube-lite');
    var Iterator = require('./cube/iterator');
    var iter = new Iterator.CubeIterator();
    iter.breadthFirstTraverseQuick(CubeLite.getPristineCube());

    done();
});

gulp.task('saveMemory', function (done) {
    var CubeLite = require('./cube/cube-lite');
    var Iterator = require('./cube/iterator');
    var iter = new Iterator.CubeIterator();
    iter.breadthFirstTraverseFile(CubeLite.getPristineCube());

    done();
});

gulp.task('restricted-search', function (done) {
    var CubeLite = require('./cube/cube-lite');
    var Iterator = require('./cube/iterator');
    Iterator.CubeIterator.iterateAndSaveFile(CubeLite.getPristineCube(), 'restricted-cube.csv');

    done();
});

gulp.task('restricted-search-only', function (done) {
    var CubeLite = require('./cube/cube-lite');
    var Iterator = require('./cube/iterator');
    var n = Iterator.CubeIterator.iterate(CubeLite.getPristineCube());

    var fs = require('fs');
    var filePath = 'nodes.csv';
    var option = 'utf-8';
    fs.writeFileSync(filePath, 'source, target\n', option);

    for (var p in n.nodes) {
        fs.appendFileSync(filePath, n.nodes[p] + '\n', option);
    }

    done();
});

gulp.task('read', function (done) {
    var fs = require('fs');

    var t = fs.readFileSync('./cube.csv', 'utf-8');
    var r = t.split('\n');
    console.log(r.length);
    done();
});