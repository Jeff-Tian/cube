var SIDE = {
    front: 'front',
    top: 'top',
    left: 'left',
    right: 'right',
    under: 'under',
    back: 'back'
};

var COLOR = {
    green: 'blue',
    orange: 'yellow',
    blue: 'orange',
    red: 'red',
    white: 'white',
    yellow: 'green'
};

var LABEL = {
    frontLeftTopGreen: 'Α α',
    frontRightTopGreen: 'Β β',
    frontLeftBottomGreen: 'Γ γ',
    frontRightBottomGreen: 'Δ δ',

    topLeftTopOrange: 'Ε ε',
    topRightTopOrange: 'Ζ ζ',
    topLeftBottomOrange: 'Η η',
    topRightBottomOrange: 'Θ θ',

    leftLeftTopBlue: 'Ι ι',
    leftRightTopBlue: 'Κ κ',
    leftLeftBottomBlue: '∧ λ',
    leftRightBottomBlue: 'Μ μ',

    rightLeftTopRed: 'Ν ν',
    rightRightTopRed: 'Ξ ξ',
    rightLeftBottomRed: 'Ο ο',
    rightRightBottomRed: '∏ π',

    underLeftTopWhite: 'Ρ ρ',
    underRightTopWhite: '∑ σ',
    underLeftBottomWhite: 'Τ τ',
    underRightBottomWhite: 'Υ υ',

    backLeftTopYellow: 'Φ φ',
    backRightTopYellow: 'Χ χ',
    backLeftBottomYellow: 'Ψ ψ',
    backRightBottomYellow: 'Ω ω'
};

function Pos(surface, x, y) {
    this.surface = surface;
    this.row = x;
    this.col = y;
}

function Block(pos, label, color) {
    this.pos = pos;
    this.label = label;
    this.color = color;

    if (!Block.__initialized__) {

        Block.__initialized__ = true;
    }
}

Block.fromLabel = function (label) {
    var labelName;

    for (var n in LABEL) {
        if (LABEL[n] === label) {
            labelName = n;

            break;
        }
    }

    var parts = labelName.match(/[A-Z]?[a-z]+/g);
    console.log('label parts: ', parts);
    var surface = parts[0];
    var col = {Left: 0, Right: 1}[parts[1]];
    var row = {Top: 0, Bottom: 1}[parts[2]];
    var color = COLOR[parts[3].toLowerCase()];

    return new Block(
        new Pos(SIDE[surface], row, col),
        label,
        color
    );
};

function Surface(leftTopBlock, rightTopBlock, leftBottomBlock, rightBottomBlock) {
    this.blocks = [
        [leftTopBlock, rightTopBlock],
        [leftBottomBlock, rightBottomBlock]
    ];

    if (!Surface.__initialized__) {

        Surface.__initialized__ = true;
    }
}

Surface.createPrimitiveSurface = function (side) {
    switch (side) {
        case SIDE.front:
            return new Surface(
                Block.fromLabel(LABEL.frontLeftTopGreen), Block.fromLabel(LABEL.frontRightTopGreen),
                Block.fromLabel(LABEL.frontLeftBottomGreen), Block.fromLabel(LABEL.frontRightBottomGreen));

        case SIDE.top:
            return new Surface(
                Block.fromLabel(LABEL.topLeftTopOrange), Block.fromLabel(LABEL.topRightTopOrange),
                Block.fromLabel(LABEL.topLeftBottomOrange), Block.fromLabel(LABEL.topRightBottomOrange));

        case SIDE.left:
            return new Surface(
                Block.fromLabel(LABEL.leftLeftTopBlue), Block.fromLabel(LABEL.leftRightTopBlue),
                Block.fromLabel(LABEL.leftLeftBottomBlue), Block.fromLabel(LABEL.leftRightBottomBlue)
            );

        case SIDE.right:
            return new Surface(
                Block.fromLabel(LABEL.rightLeftTopRed), Block.fromLabel(LABEL.rightRightTopRed),
                Block.fromLabel(LABEL.rightLeftBottomRed), Block.fromLabel(LABEL.rightRightBottomRed)
            );

        case SIDE.under:
            return new Surface(
                Block.fromLabel(LABEL.underLeftTopWhite), Block.fromLabel(LABEL.underRightTopWhite),
                Block.fromLabel(LABEL.underLeftBottomWhite), Block.fromLabel(LABEL.underRightBottomWhite)
            );

        case SIDE.back:
            return new Surface(
                Block.fromLabel(LABEL.backLeftTopYellow), Block.fromLabel(LABEL.backRightTopYellow),
                Block.fromLabel(LABEL.backLeftBottomYellow), Block.fromLabel(LABEL.backRightBottomYellow)
            );
    }
};

function Cube(frontSurface, topSurface, leftSurface, rightSurface, underSurface, backSurface) {
    this.blocks = [frontSurface, topSurface, leftSurface, rightSurface, underSurface, backSurface];
    this.front = frontSurface;
    this.top = topSurface;
    this.left = leftSurface;
    this.right = rightSurface;
    this.under = underSurface;
    this.back = backSurface;

    if (!Cube.__initialized__) {
        Cube.prototype.F = function () {
            var self = this;
            var topRow1Col0 = self.top.blocks[1][0];
            var topRow1Col1 = self.top.blocks[1][1];

            function leftToTop() {
                self.top.blocks[1][0] = self.left.blocks[1][1];
                self.left.blocks[1][1].pos = new Pos(SIDE.top, 1, 0);

                self.top.blocks[1][1] = self.left.blocks[0][1];
                self.left.blocks[0][1].pos = new Pos(SIDE.top, 1, 1);
            }

            function underToLeft() {
                self.left.blocks[0][1] = self.under.blocks[0][0];
                self.under.blocks[0][0].pos = new Pos(SIDE.left, 0, 1);

                self.left.blocks[1][1] = self.under.blocks[0][1];
                self.under.blocks[0][1].pos = new Pos(SIDE.left, 1, 1);
            }

            function rightToUnder() {
                self.under.blocks[0][0] = self.right.blocks[1][0];
                self.right.blocks[1][0].pos = new Pos(SIDE.under, 0, 0);

                self.under.blocks[0][1] = self.right.blocks[0][0];
                self.right.blocks[0][0].pos = new Pos(SIDE.under, 0, 1);
            }

            function topToRight() {
                self.right.blocks[0][0] = topRow1Col0;
                topRow1Col0.Pos = new Pos(SIDE.right, 0, 0);

                self.right.blocks[1][0] = topRow1Col1;
                topRow1Col1.Pos = new Pos(SIDE.right, 1, 0);
            }

            function rotateFrontClockwise() {
                var t = self.front.blocks[0][0];

                self.front.blocks[0][0] = self.front.blocks[1][0];
                self.front.blocks[1][0].pos = new Pos(SIDE.front, 0, 0);
                self.front.blocks[1][0] = self.front.blocks[1][1];
                self.front.blocks[1][1].pos = new Pos(SIDE.front, 1, 0);
                self.front.blocks[1][1] = self.front.blocks[0][1];
                self.front.blocks[0][1].pos = new Pos(SIDE.front, 1, 1);
                self.front.blocks[0][1] = t;
                t.pos = new Pos(SIDE.front, 0, 1);
            }

            rotateFrontClockwise();
            leftToTop();
            underToLeft();
            rightToUnder();
            topToRight();
        };

        Cube.prototype.F_ = function () {

            var self = this;
            var topRow1Col0 = self.top.blocks[1][0];
            var topRow1Col1 = self.top.blocks[1][1];

            function rightToTop() {
                self.top.blocks[1][0] = self.right.blocks[0][0];
                self.right.blocks[0][0].pos = new Pos(SIDE.top, 1, 0);

                self.top.blocks[1][1] = self.right.blocks[1][0];
                self.right.blocks[1][0].pos = new Pos(SIDE.top, 1, 1);
            }

            function underToRight() {
                self.right.blocks[0][0] = self.under.blocks[0][1];
                self.under.blocks[0][1].pos = new Pos(SIDE.right, 0, 0);

                self.right.blocks[1][0] = self.under.blocks[0][0];
                self.under.blocks[0][0].pos = new Pos(SIDE.right, 1, 0);
            }

            function leftToUnder() {
                self.under.blocks[0][0] = self.left.blocks[0][1];
                self.left.blocks[0][1].pos = new Pos(SIDE.under, 0, 0);

                self.under.blocks[0][1] = self.left.blocks[1][1];
                self.left.blocks[1][1].pos = new Pos(SIDE.under, 0, 1);
            }

            function topToLeft() {
                self.left.blocks[0][1] = topRow1Col1;
                topRow1Col1.Pos = new Pos(SIDE.left, 0, 1);

                self.left.blocks[1][1] = topRow1Col0;
                topRow1Col0.Pos = new Pos(SIDE.left, 1, 1);
            }

            function rotateFrontCounterClockwise() {
                var t = self.front.blocks[0][0];

                self.front.blocks[0][0] = self.front.blocks[0][1];
                self.front.blocks[0][1].pos = new Pos(SIDE.front, 0, 0);

                self.front.blocks[0][1] = self.front.blocks[1][1];
                self.front.blocks[1][1].pos = new Pos(SIDE.front, 0, 1);

                self.front.blocks[1][1] = self.front.blocks[1][0];
                self.front.blocks[1][0].pos = new Pos(SIDE.front, 1, 1);

                self.front.blocks[1][0] = t;
                t.pos = new Pos(SIDE.front, 1, 0);
            }

            rotateFrontCounterClockwise();
            rightToTop();
            underToRight();
            leftToUnder();
            topToLeft();
        };

        Cube.__initialized__ = true;
    }
}

Cube.getPristineCube = function () {
    return new Cube(
        Surface.createPrimitiveSurface(SIDE.front),
        Surface.createPrimitiveSurface(SIDE.top),
        Surface.createPrimitiveSurface(SIDE.left),
        Surface.createPrimitiveSurface(SIDE.right),
        Surface.createPrimitiveSurface(SIDE.under),
        Surface.createPrimitiveSurface(SIDE.back)
    );
};

var CubeWorld = {
    Cube: Cube,
    Surface: Surface,
    Block: Block,
    SIDE: SIDE,
    LABEL: LABEL,
    COLOR: COLOR
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CubeWorld;
} else {
    window.CubeWorld = CubeWorld;
}