if (typeof module !== 'undefined' && module.exports) {
    var window = {};
}

var CORNER = {
    RedGreenYellow: 0,
    RedYellowGreen: 0,
    GreenRedYellow: 0,
    GreenYellowRed: 0,
    YellowGreenRed: 0,
    YellowRedGreen: 0,

    RedBlueYellow: 1,
    RedYellowBlue: 1,
    BlueRedYellow: 1,
    BlueYellowRed: 1,
    YellowRedBlue: 1,
    YellowBlueRed: 1,

    OrangeBlueYellow: 2,
    OrangeYellowBlue: 2,
    BlueOrangeYellow: 2,
    BlueYellowOrange: 2,
    YellowOrangeBlue: 2,
    YellowBlueOrange: 2,

    YellowGreenOrange: 3,
    YellowOrangeGreen: 3,
    GreenOrangeYellow: 3,
    GreenYellowOrange: 3,
    OrangeGreenYellow: 3,
    OrangeYellowGreen: 3,

    WhiteGreenRed: 4,
    WhiteRedGreen: 4,
    GreenWhiteRed: 4,
    GreenRedWhite: 4,
    RedWhiteGreen: 4,
    RedGreenWhite: 4,

    WhiteBlueOrange: 5,
    WhiteOrangeBlue: 5,
    BlueOrangeWhite: 5,
    BlueWhiteOrange: 5,
    OrangeWhiteBlue: 5,
    OrangeBlueWhite: 5,

    WhiteGreenOrange: 6,
    WhiteOrangeGreen: 6,
    GreenOrangeWhite: 6,
    GreenWhiteOrange: 6,
    OrangeGreenWhite: 6,
    OrangeWhiteGreen: 6
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

CubeCompact.Corners = CORNER;


if (typeof module !== 'undefined' && module.exports) {
    module.exports = CubeCompact;
} else {
    window.CuteCompact = CubeCompact;
}