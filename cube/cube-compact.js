if (typeof module !== 'undefined' && module.exports) {
    var window = {};
}

var CORNER = {
    RedGreenYellow: 0,
    RedBlueYellow: 1,
    OrangeBlueYellow: 2,
    YellowGreenOrange: 3,
    WhiteGreenRed: 4,
    WhiteBlueOrange: 5,
    WhiteGreenOrange: 6
};

var POSITIONS = {
    TopColorTopSide: 0,
    TopColorToTopSideClockWise: 1,
    Other: 2
};

function CubeCompact(directions, positions) {
    this.directions = directions;
    this.positions = positions;

    if (!CubeCompact.__initialized__) {

        CubeCompact.prototype.toCubeLite = function () {

        };

        CubeCompact.prototype.toString = function () {
            return this.directions.join(', ') + '; ' + this.positions.join(', ');
        };

        CubeCompact.__initialized__ = true;
    }
}

CubeCompact.getPristineCube = function () {
    return new CubeCompact([0, 1, 2, 3, 4, 5, 6], [0, 0, 0, 0, 0, 0, 0]);
};

CubeCompact.getPristineCube = function () {
    return new CubeCompact('αβγδφχψωικλμνξοπεζηθρστυ');
};


if (typeof module !== 'undefined' && module.exports) {
    module.exports = CubeCompact;
} else {
    window.CuteCompact = CubeCompact;
}