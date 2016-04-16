if (typeof module !== 'undefined' && module.exports) {
    var window = {};
}

var CORNER = {
    // RedGreenYellow: 0,
    // RedYellowGreen: 0,
    // GreenRedYellow: 0,
    // GreenYellowRed: 0,
    // YellowGreenRed: 0,
    YellowRedGreen: 0,

    // RedBlueYellow: 1,
    // RedYellowBlue: 1,
    // BlueRedYellow: 1,
    // BlueYellowRed: 1,
    // YellowRedBlue: 1,
    YellowBlueRed: 1,

    // OrangeBlueYellow: 2,
    // OrangeYellowBlue: 2,
    // BlueOrangeYellow: 2,
    // BlueYellowOrange: 2,
    YellowOrangeBlue: 2,
    // YellowBlueOrange: 2,

    YellowGreenOrange: 3,
    // YellowOrangeGreen: 3,
    // GreenOrangeYellow: 3,
    // GreenYellowOrange: 3,
    // OrangeGreenYellow: 3,
    // OrangeYellowGreen: 3,

    WhiteGreenRed: 4,
    // WhiteRedGreen: 4,
    // GreenWhiteRed: 4,
    // GreenRedWhite: 4,
    // RedWhiteGreen: 4,
    // RedGreenWhite: 4,

    WhiteBlueOrange: 5,
    // WhiteOrangeBlue: 5,
    // BlueOrangeWhite: 5,
    // BlueWhiteOrange: 5,
    // OrangeWhiteBlue: 5,
    // OrangeBlueWhite: 5,

    // WhiteGreenOrange: 6,
    WhiteOrangeGreen: 6
    // GreenOrangeWhite: 6,
    // GreenWhiteOrange: 6,
    // OrangeGreenWhite: 6,
    // OrangeWhiteGreen: 6
};

var CornerReverseMap = {
    0: ['ζ', 'ξ', 'ω'],

    1: ['θ', 'β', 'ν'],

    2: ['η', 'κ', 'α'],

    3: ['ε', 'ψ', 'ι'],

    4: ['υ', 'χ', 'π'],

    5: ['ρ', 'γ', 'μ'],

    6: ['τ', 'λ', 'φ'],

    7: ['σ', 'ο', 'δ']
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
            var labels = [];

            labels[17] = CornerReverseMap[this.directions[0]][0];
            labels[13] = CornerReverseMap[this.directions[0]][1];
            labels[7] = CornerReverseMap[this.directions[0]][2];

            labels[19] = CornerReverseMap[this.directions[1]][0];
            labels[1] = CornerReverseMap[this.directions[1]][1];
            labels[12] = CornerReverseMap[this.directions[1]][2];

            if (this.positions[2] === 0) {
                labels[18] = CornerReverseMap[this.directions[2]][0];
                labels[9] = CornerReverseMap[this.directions[2]][1];
                labels[0] = CornerReverseMap[this.directions[2]][2];
            } else if (this.positions[2] === 1) {
                labels[18] = CornerReverseMap[this.directions[2]][2];
                labels[9] = CornerReverseMap[this.directions[2]][0];
                labels[0] = CornerReverseMap[this.directions[2]][1];
            } else {
                labels[18] = CornerReverseMap[this.directions[2]][1];
                labels[9] = CornerReverseMap[this.directions[2]][2];
                labels[0] = CornerReverseMap[this.directions[2]][0];
            }

            if (this.positions[3] === 0) {
                labels[16] = CornerReverseMap[this.directions[3]][0];
                labels[6] = CornerReverseMap[this.directions[3]][1];
                labels[8] = CornerReverseMap[this.directions[3]][2];
            } else if (this.positions[3] === 1) {
                labels[16] = CornerReverseMap[this.directions[3]][2];
                labels[6] = CornerReverseMap[this.directions[3]][0];
                labels[8] = CornerReverseMap[this.directions[3]][1];
            } else {
                labels[16] = CornerReverseMap[this.directions[3]][1];
                labels[6] = CornerReverseMap[this.directions[3]][2];
                labels[8] = CornerReverseMap[this.directions[3]][0];
            }

            labels[23] = CornerReverseMap[this.directions[4]][0];
            labels[5] = CornerReverseMap[this.directions[4]][1];
            labels[15] = CornerReverseMap[this.directions[4]][2];

            if (this.positions[5] === 0) {
                labels[20] = CornerReverseMap[this.directions[5]][0];
                labels[2] = CornerReverseMap[this.directions[5]][1];
                labels[11] = CornerReverseMap[this.directions[5]][2];
            } else if (this.positions[5] === 1) {
                labels[20] = CornerReverseMap[this.directions[5]][2];
                labels[2] = CornerReverseMap[this.directions[5]][0];
                labels[11] = CornerReverseMap[this.directions[5]][1];
            } else {
                labels[20] = CornerReverseMap[this.directions[5]][1];
                labels[2] = CornerReverseMap[this.directions[5]][2];
                labels[11] = CornerReverseMap[this.directions[5]][0];
            }

            if (this.positions[6] === 0) {
                labels[22] = CornerReverseMap[this.directions[6]][0];
                labels[10] = CornerReverseMap[this.directions[6]][1];
                labels[4] = CornerReverseMap[this.directions[6]][2];
            } else if (this.positions[6] === 1) {
                labels[22] = CornerReverseMap[this.directions[6]][2];
                labels[10] = CornerReverseMap[this.directions[6]][0];
                labels[4] = CornerReverseMap[this.directions[6]][1];
            } else {
                labels[22] = CornerReverseMap[this.directions[6]][1];
                labels[10] = CornerReverseMap[this.directions[6]][2];
                labels[4] = CornerReverseMap[this.directions[6]][0];
            }

            labels[21] = CornerReverseMap[7][0];
            labels[14] = CornerReverseMap[7][1];
            labels[3] = CornerReverseMap[7][2];

            if (typeof require === 'function') {
                var CubeLite = require('./cube-lite');
            }

            return new CubeLite(labels.join(''));
        };

        CubeCompact.prototype.L = function () {
            var t = this.directions[2];
            this.directions[2] = this.directions[3];
            this.directions[3] = this.directions[6];
            this.directions[6] = this.directions[5];
            this.directions[5] = t;

            t = this.positions[2];
            this.positions[2] = (this.positions[3] + 2) % 3;
            this.positions[3] = (this.positions[6] + 1) % 3;
            this.positions[6] = (this.positions[5] + 2) % 3;
            this.positions[5] = (t + 1) % 3;

            return this;
        };

        CubeCompact.prototype.toString = function () {
            return this.directions.join(', ') + '; ' + this.positions.join(', ');
        };

        CubeCompact.prototype.toLiteString = function () {
            return this.toCubeLite().toString();
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