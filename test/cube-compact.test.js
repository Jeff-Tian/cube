var CubeCompact = require('../cube/cube-compact');
var CubeLite = require('../cube/cube-lite');
var assert = require('assert');

describe('Cube Compact', function () {
    it('can get pristine cube', function () {
        var c = CubeCompact.getPristineCube();
        assert.equal(c.toString(), '0, 1, 2, 3, 4, 5, 6; 0, 0, 0, 0, 0, 0, 0');
    });

    it('can convert cube lite to a cube compact', function () {
        var cubeLite = CubeLite.getPristineCube();
        assert.equal(cubeLite.toCubeCompact().toString(), CubeCompact.getPristineCube().toString());
    });

    it('can change to cube lite', function () {
        var compact = new CubeCompact([0, 1, 2, 3, 4, 5, 6], [0, 0, 0, 0, 0, 0, 0]);
        var lite = compact.toCubeLite();

        console.log('get cube lite pristine cube:', CubeLite.getPristineCube().toString());

        assert.equal(lite.toString(), CubeLite.getPristineCube().toString());
    });
});