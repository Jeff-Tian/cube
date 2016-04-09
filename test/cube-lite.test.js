var assert = require('assert');
var CubeLite = require('../cube/cube-lite.js');

describe('Cube Lite', function () {
    it('can turn front side clockwise', function () {
        var cube = CubeLite.getPristineCube();
        cube.F();

        assert.equal(cube.toString(), 'γαδβφχψωιρλσηξθπεζμκοντυ');
    });

    it('can turn front side anti-clockwise', function () {
        var cube = CubeLite.getPristineCube();
        cube['F`']();

        assert.equal(cube.toString(), 'βδαγφχψωιθλησξρπεζνοκμτυ');
    });
});