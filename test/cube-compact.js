var CubeCompact = require('../cube/cube-compact');
var CubeLite = require('../cube/cube-lite');
var assert = require('assert');

describe('Cube Compact', function () {
    it('can convert cube lite to a cube compact', function () {
        // var cubeLite = CubeLite.getPristineCube();
        // assert.equal(cubeLite.toCubeCompact().toString(), CubeCompact.getPristineCube().toString());
    });

    it('can change to cube lite', function () {
        // var compact = new CubeCompact([0, 1, 2, 3, 4, 5, 6], [0, 0, 0, 0, 0, 0, 0]);
        // var lite = compact.toCubeLite();
        //
        // assert.equal(lite.toString(), CubeLite.getPristineCube().toString());
    });
});