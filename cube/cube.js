if (typeof module !== 'undefined' && module.exports) {
    var window = {};
}

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

var SIMPLE_LABEL = {
    α: LABEL.frontLeftTopGreen,
    β: LABEL.frontRightTopGreen,
    γ: LABEL.frontLeftBottomGreen,
    δ: LABEL.frontRightBottomGreen,

    ε: LABEL.topLeftTopOrange,
    ζ: LABEL.topRightTopOrange,
    η: LABEL.topLeftBottomOrange,
    θ: LABEL.topRightBottomOrange,

    ι: LABEL.leftLeftTopBlue,
    κ: LABEL.leftRightTopBlue,
    λ: LABEL.leftLeftBottomBlue,
    μ: LABEL.leftRightBottomBlue,

    ν: LABEL.rightLeftTopRed,
    ξ: LABEL.rightRightTopRed,
    ο: LABEL.rightLeftBottomRed,
    π: LABEL.rightRightBottomRed,

    ρ: LABEL.underLeftTopWhite,
    σ: LABEL.underRightTopWhite,
    τ: LABEL.underLeftBottomWhite,
    υ: LABEL.underRightBottomWhite,

    φ: LABEL.backLeftTopYellow,
    χ: LABEL.backRightTopYellow,
    ψ: LABEL.backLeftBottomYellow,
    ω: LABEL.backRightBottomYellow
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

Surface.fromLabel = function (leftTop, rightTop, leftBottom, rightBottom) {
    return new Surface(
        Block.fromLabel(SIMPLE_LABEL[leftTop]),
        Block.fromLabel(SIMPLE_LABEL[rightTop]),
        Block.fromLabel(SIMPLE_LABEL[leftBottom]),
        Block.fromLabel(SIMPLE_LABEL[rightBottom])
    );
};

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

function Cube(frontSurface, backSurface, leftSurface, rightSurface, topSurface, underSurface) {
    //this.blocks = [frontSurface, backSurface, leftSurface, rightSurface, topSurface, underSurface];
    this.front = frontSurface;
    this.back = backSurface;
    this.left = leftSurface;
    this.right = rightSurface;
    this.top = topSurface;
    this.under = underSurface;
    this.sides = [frontSurface, backSurface, leftSurface, rightSurface, topSurface, underSurface];

    this.history = [];

    if (!Cube.__initialized__) {
        Cube.prototype.rotateSideClockwise = function (side) {
            var t = this[side].blocks[0][0];

            this[side].blocks[0][0] = this[side].blocks[1][0];
            this[side].blocks[1][0].pos = new Pos(SIDE[side], 0, 0);
            this[side].blocks[1][0] = this[side].blocks[1][1];
            this[side].blocks[1][1].pos = new Pos(SIDE[side], 1, 0);
            this[side].blocks[1][1] = this[side].blocks[0][1];
            this[side].blocks[0][1].pos = new Pos(SIDE[side], 1, 1);
            this[side].blocks[0][1] = t;
            t.pos = new Pos(SIDE[side], 0, 1);
        };

        Cube.prototype.rotateSideCounterClockwise = function (side) {
            this.rotateSideClockwise(side);
            this.rotateSideClockwise(side);
            this.rotateSideClockwise(side);
        };

        Cube.prototype.executeF = function () {
            var self = this;

            var topRow1Col0 = this.top.blocks[1][0];
            var topRow1Col1 = this.top.blocks[1][1];

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
                self.rotateSideClockwise(SIDE.front);
            }

            rotateFrontClockwise();
            leftToTop();
            underToLeft();
            rightToUnder();
            topToRight();
        };

        Cube.prototype.executeF_ = function () {
            this.executeF();
            this.executeF();
            this.executeF();

            //var topRow1Col0 = this.top.blocks[1][0];
            //var topRow1Col1 = this.top.blocks[1][1];
            //
            //function rightToTop() {
            //    this.top.blocks[1][0] = this.right.blocks[0][0];
            //    this.right.blocks[0][0].pos = new Pos(SIDE.top, 1, 0);
            //
            //    this.top.blocks[1][1] = this.right.blocks[1][0];
            //    this.right.blocks[1][0].pos = new Pos(SIDE.top, 1, 1);
            //}
            //
            //function underToRight() {
            //    this.right.blocks[0][0] = this.under.blocks[0][1];
            //    this.under.blocks[0][1].pos = new Pos(SIDE.right, 0, 0);
            //
            //    this.right.blocks[1][0] = this.under.blocks[0][0];
            //    this.under.blocks[0][0].pos = new Pos(SIDE.right, 1, 0);
            //}
            //
            //function leftToUnder() {
            //    this.under.blocks[0][0] = this.left.blocks[0][1];
            //    this.left.blocks[0][1].pos = new Pos(SIDE.under, 0, 0);
            //
            //    this.under.blocks[0][1] = this.left.blocks[1][1];
            //    this.left.blocks[1][1].pos = new Pos(SIDE.under, 0, 1);
            //}
            //
            //function topToLeft() {
            //    this.left.blocks[0][1] = topRow1Col1;
            //    topRow1Col1.Pos = new Pos(SIDE.left, 0, 1);
            //
            //    this.left.blocks[1][1] = topRow1Col0;
            //    topRow1Col0.Pos = new Pos(SIDE.left, 1, 1);
            //}
            //
            //function rotateFrontCounterClockwise() {
            //    var t = this.front.blocks[0][0];
            //
            //    this.front.blocks[0][0] = this.front.blocks[0][1];
            //    this.front.blocks[0][1].pos = new Pos(SIDE.front, 0, 0);
            //
            //    this.front.blocks[0][1] = this.front.blocks[1][1];
            //    this.front.blocks[1][1].pos = new Pos(SIDE.front, 0, 1);
            //
            //    this.front.blocks[1][1] = this.front.blocks[1][0];
            //    this.front.blocks[1][0].pos = new Pos(SIDE.front, 1, 1);
            //
            //    this.front.blocks[1][0] = t;
            //    t.pos = new Pos(SIDE.front, 1, 0);
            //}
            //
            //rotateFrontCounterClockwise();
            //rightToTop();
            //underToRight();
            //leftToUnder();
            //topToLeft();
        };

        Cube.prototype.executeB = function () {

            this.perspectiveLeft();
            this.perspectiveLeft();

            this.executeF();

            this.perspectiveLeft();
            this.perspectiveLeft();
        };

        Cube.prototype.executeB_ = function () {
            this.perspectiveLeft();
            this.perspectiveLeft();

            this.executeF_();

            this.perspectiveLeft();
            this.perspectiveLeft();
        };

        Cube.prototype.executeL = function () {
            this.perspectiveLeft();

            this.executeF();

            this.perspectiveRight();
        };

        Cube.prototype.executeL_ = function () {
            this.perspectiveLeft();

            this.executeF_();

            this.perspectiveRight();
        };

        Cube.prototype.executeR = function () {
            this.perspectiveRight();

            this.executeF();

            this.perspectiveLeft();
        };

        Cube.prototype.executeR_ = function () {
            this.perspectiveRight();

            this.executeF_();

            this.perspectiveLeft();
        };

        Cube.prototype.executeU = function () {
            this.perspectiveUp();

            this.executeF();

            this.perspectiveDown();
        };

        Cube.prototype.executeU_ = function () {
            this.perspectiveUp();

            this.executeF_();

            this.perspectiveDown();
        };

        Cube.prototype.executeD = function () {
            this.perspectiveDown();

            this.executeF();

            this.perspectiveUp();
        };

        Cube.prototype.executeD_ = function () {
            this.perspectiveDown();

            this.executeF_();

            this.perspectiveUp();
        };

        Cube.prototype.randomize = function ($timeout, interval, numberOfSteps, callback) {
            var self = this;
            $timeout = $timeout || window.setTimeout;
            var availableSteps = ['F', 'F`', 'B', 'B`', 'L', 'L`', 'R', 'R`', 'U', 'U`', 'D', 'D`'];

            var steps = [];
            numberOfSteps = numberOfSteps || Math.floor(Math.random() * 100);

            for (var i = 0; i < numberOfSteps; i++) {
                steps.push(availableSteps[Math.floor(Math.random() * availableSteps.length)]);
            }

            var doJob = function () {
                while (steps.length) {
                    self[steps.shift()]();

                    if (interval) {
                        $timeout(function () {
                            doJob(callback);
                        }, interval);

                        break;
                    }
                }

                if (!steps.length) {
                    callback && callback();
                }
            };

            doJob(callback);
        };

        Cube.prototype.reset = function ($timeout, interval, callback) {
            var self = this;

            var player = {
                'F': self.executeF,
                'F`': self.executeF_,
                "F'": self.executeF_,

                'B': self.executeB,
                'B`': self.executeB_,
                "B'": self.executeB_,

                'U': self.executeU,
                'U`': self.executeU_,
                "U'": self.executeU_,

                'D': self.executeD,
                'D`': self.executeD_,
                "D'": self.executeD_,

                'L': self.executeL,
                'L`': self.executeL_,
                "L'": self.executeL_,

                'R': self.executeR,
                'R`': self.executeR_,
                "R'": self.executeR_
            };

            player.execute = function (step) {
                player[step]();
            };

            player.reverseStep = function (step) {
                return step.length === 1 ? step + '`' : step[0];
            };

            $timeout = $timeout || window.setTimeout;

            while (self.history.length) {
                var s = self.history.pop();
                var rs = player.reverseStep(s);

                player[rs].call(self);

                if (interval) {
                    $timeout(function () {
                        self.reset($timeout, interval, callback);
                    }, interval);

                    break;
                }
            }

            if (!self.history.length) {
                callback();
            }
        };

        Cube.prototype.F = function () {
            this.executeF();
            this.history.push('F');
        };

        Cube.prototype.F_ = function () {
            this.executeF_();
            this.history.push('F`');
        };

        Cube.prototype.B = function () {
            this.executeB();
            this.history.push('B');
        };

        Cube.prototype.B_ = function () {
            this.executeB_();
            this.history.push('B`');
        };

        Cube.prototype.L = function () {
            this.executeL();
            this.history.push('L');
        };

        Cube.prototype.L_ = function () {
            this.executeL_();
            this.history.push('L`');
        };

        Cube.prototype.R = function () {
            this.executeR();
            this.history.push('R');
        };

        Cube.prototype.R_ = function () {
            this.executeR_();
            this.history.push('R`');
        };

        Cube.prototype.U = function () {
            this.executeU();
            this.history.push('U');
        };

        Cube.prototype.U_ = function () {
            this.executeU_();
            this.history.push('U`');
        };

        Cube.prototype.D = function () {
            this.executeD();
            this.history.push('D');
        };

        Cube.prototype.D_ = function () {
            this.executeD_();
            this.history.push('D`');
        };

        Cube.prototype['F`'] = Cube.prototype["F'"] = Cube.prototype.F_;
        Cube.prototype['B`'] = Cube.prototype["B'"] = Cube.prototype.B_;
        Cube.prototype['U`'] = Cube.prototype["U'"] = Cube.prototype.U_;
        Cube.prototype['D`'] = Cube.prototype["D'"] = Cube.prototype.D_;
        Cube.prototype['L`'] = Cube.prototype["L'"] = Cube.prototype.L_;
        Cube.prototype['R`'] = Cube.prototype["R'"] = Cube.prototype.R_;

        Cube.prototype.perspectiveLeft = function () {
            var self = this;
            var t = self.front;
            self.front = self.left;
            self.left = self.back;
            self.back = self.right;
            self.right = t;

            this.rotateSideCounterClockwise(SIDE.top);
            this.rotateSideClockwise(SIDE.under);
        };

        Cube.prototype.perspectiveRight = function () {
            var self = this;
            self.perspectiveLeft();
            self.perspectiveLeft();
            self.perspectiveLeft();
        };

        Cube.prototype.perspectiveUp = function () {
            var self = this;
            var t = self.front;
            self.front = self.top;
            self.top = self.back;
            self.back = self.under;
            self.under = t;

            this.rotateSideClockwise(SIDE.left);
            this.rotateSideCounterClockwise(SIDE.right);
        };

        Cube.prototype.perspectiveDown = function () {
            var self = this;
            self.perspectiveUp();
            self.perspectiveUp();
            self.perspectiveUp();
        };

        Cube.prototype.toString = function () {
            var a = function (x, y) {
                return x + y;
            };

            var self = this;

            return self.sides
                .map(function (s) {
                    return s.blocks
                        .map(function (row) {
                            return row
                                .map(function (col) {
                                    return col.label[col.label.length - 1];
                                })
                                .reduce(a);
                        })
                        .reduce(a);
                })
                .reduce(a);
        };

        Cube.__initialized__ = true;
    }
}

Cube.getPristineCube = function () {
    return new Cube(
        Surface.createPrimitiveSurface(SIDE.front),
        Surface.createPrimitiveSurface(SIDE.back),
        Surface.createPrimitiveSurface(SIDE.left),
        Surface.createPrimitiveSurface(SIDE.right),
        Surface.createPrimitiveSurface(SIDE.top),
        Surface.createPrimitiveSurface(SIDE.under)
    );
};

Cube.fromState = function (state) {
    return new Cube(
        Surface.fromLabel(state[0], state[1], state[2], state[3]),
        Surface.fromLabel(state[4], state[5], state[6], state[7]),
        Surface.fromLabel(state[8], state[9], state[10], state[11]),
        Surface.fromLabel(state[12], state[13], state[14], state[15]),
        Surface.fromLabel(state[16], state[17], state[18], state[19]),
        Surface.fromLabel(state[20], state[21], state[22], state[23])
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