var CubeCompact = require('../cube/cube-compact');
var CubeLite = require('../cube/cube-lite');
var CubeMini = require('../cube/cube-mini');
var assert = require('assert');

describe('Cube Mini: ', function () {
    it('can pad 0 to string', function () {
        assert.equal(CubeMini.padZeroLeft('1'), '00000000000000000000000000000001');
    });

    it('can format a string', function () {
        assert.equal(CubeMini.binaryFormat('00000000000000000000000000000001'), '0000 0000|0000 0000|0000 0000|0000 0001');

        assert.equal(CubeMini.padFormat(1), '0000 0000|0000 0000|0000 0000|0000 0001')
    });

    it('can get corner representation', function () {
        var c = 7;
        var r = CubeMini.getCornerDirectionRepresent(c, 1);

        assert.equal(CubeMini.padFormat(r.toString(2)), '0111 0000|0000 0000|0000 0000|0000 0000');

        r = CubeMini.getCornerDirectionRepresent(c, 2);
        assert.equal(CubeMini.padFormat(r.toString(2)), '0000 1110|0000 0000|0000 0000|0000 0000');

        r = CubeMini.getCornerDirectionRepresent(c, 3);
        assert.equal(CubeMini.padFormat(r.toString(2)), '0000 0001|1100 0000|0000 0000|0000 0000');

        r = CubeMini.getCornerDirectionRepresent(c, 4);
        assert.equal(CubeMini.padFormat(r.toString(2)), '0000 0000|0011 1000|0000 0000|0000 0000');

        r = CubeMini.getCornerDirectionRepresent(c, 5);
        assert.equal(CubeMini.padFormat(r.toString(2)), '0000 0000|0000 0111|0000 0000|0000 0000');

        r = CubeMini.getCornerDirectionRepresent(c, 6);
        assert.equal(CubeMini.padFormat(r.toString(2)), '0000 0000|0000 0000|1110 0000|0000 0000');

        c = 5;
        r = CubeMini.getCornerDirectionRepresent(c, 6);
        assert.equal(CubeMini.padFormat(r.toString(2)), '0000 0000|0000 0000|1010 0000|0000 0000');

        c = 3;
        r = CubeMini.getCornerPositionRepresent(c, 1);
        assert.equal(CubeMini.padFormat(r.toString(2)), '0000 0000|0000 0000|0000 1100|0000 0000');

        r = CubeMini.getCornerPositionRepresent(c, 2);
        assert.equal(CubeMini.padFormat(r.toString(2)), '0000 0000|0000 0000|0000 0011|0000 0000');

        r = CubeMini.getCornerPositionRepresent(c, 3);
        assert.equal(CubeMini.padFormat(r.toString(2)), '0000 0000|0000 0000|0000 0000|1100 0000');

        r = CubeMini.getCornerPositionRepresent(c, 4);
        assert.equal(CubeMini.padFormat(r.toString(2)), '0000 0000|0000 0000|0000 0000|0011 0000');

        r = CubeMini.getCornerPositionRepresent(c, 5);
        assert.equal(CubeMini.padFormat(r.toString(2)), '0000 0000|0000 0000|0000 0000|0000 1100');

        r = CubeMini.getCornerPositionRepresent(c, 6);
        assert.equal(CubeMini.padFormat(r.toString(2)), '0000 0000|0000 0000|0000 0000|0000 0011');

        assert.equal(CubeMini.padFormat(CubeMini.getCornerRepresent([7, 7, 0, 7, 0, 7], [0, 3, 0, 3, 0, 3]).toString(2)), '0111 1110|0011 1000|1110 0011|0011 0011');
        assert.equal(CubeMini.padFormat(CubeMini.getCornerRepresent([0, 1, 2, 3, 4, 5], [0, 3, 0, 3, 0, 3]).toString(2)), '0000 0010|1001 1100|1010 0011|0011 0011');
    });

    it('can be created from Cube Lite', function () {
        var mini = CubeMini.fromCubeCompact(new CubeCompact([0, 1, 2, 3, 4, 5, 6], [0, 0, 0, 0, 0, 0, 0]));

        assert.equal(mini.data, 43819008);

        assert.equal(mini.toString(), '0000 0010|1001 1100|1010 0000|0000 0000');
    });

    it('can get corner direction ', function () {
        var mini = CubeMini.getPristineCube();
        assert.equal(mini.getCornerDirection(1), 0);
        assert.equal(mini.getCornerDirection(2), 1);
        assert.equal(mini.getCornerDirection(3), 2);
        assert.equal(mini.getCornerDirection(4), 3);
        assert.equal(mini.getCornerDirection(5), 4);
        assert.equal(mini.getCornerDirection(6), 5);
        assert.equal(mini.getCornerDirection(7), 6);
    });

    it('can get corner position', function () {
        var mini = CubeMini.getPristineCube();
        assert.equal(mini.getCornerPosition(1), 0);
        assert.equal(mini.getCornerPosition(2), 0);
        assert.equal(mini.getCornerPosition(3), 0);
        assert.equal(mini.getCornerPosition(4), 0);
        assert.equal(mini.getCornerPosition(5), 0);
        assert.equal(mini.getCornerPosition(6), 0);
        assert.equal(mini.getCornerPosition(7), 0);
    });

    it('can convert to Cube Lite', function () {
        assert.equal(CubeMini.getPristineCube().toCubeCompact().toString(), CubeCompact.getPristineCube().toString());
    });

    it('can get pristine cube', function () {
        var c = CubeMini.getPristineCube();
        assert.equal(c.toString(), '0000 0010|1001 1100|1010 0000|0000 0000');
    });

    it('can get lite representation', function () {
        var c = CubeMini.getPristineCube();
        assert.equal(c.toLiteString(), CubeLite.getPristineCube().toString());
    });

    function testTurn(descr, turn) {
        it(descr, function () {
            var c = CubeMini.getPristineCube();
            c[turn]();

            var l = CubeLite.getPristineCube();
            l[turn]();

            assert.equal(c.toLiteString(), l.toString());

            c.L();
            l.L();

            assert.equal(c.toLiteString(), l.toString());

            c.L();
            l.L();

            assert.equal(c.toLiteString(), l.toString());
            c.L();
            l.L();

            assert.equal(c.toLiteString(), l.toString());
        });
    }

    testTurn('can turn left', 'L');
    testTurn('can turn left', 'L`');
    testTurn('can turn left', 'B');
    testTurn('can turn left', 'B`');
    testTurn('can turn left', 'U');
    testTurn('can turn left', 'U`');

    it('can randomize a cube', function () {
        var c = CubeMini.getPristineCube();
        c.randomize();

        assert.notEqual(c.data, 0);
    });

    it('can be created from a state', function () {
        var c = CubeMini.fromState(CubeMini.getPristineCube().data);

        assert.equal(c.toLiteString(), CubeLite.getPristineCube().toString());

        c = CubeMini.fromState(55885969);
        assert.equal(c.toLiteString(), 'ρβτδεχηωκμιλνξοπαζγθφσψυ');

        c = CubeMini.fromState(49561745);
        assert.equal(c.toLiteString(), 'εβηδρχτωλιμκνξοπφζψθασγυ');
    });
});