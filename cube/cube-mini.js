if (typeof module !== 'undefined' && module.exports) {
    var window = {};
}

function cornerDirectionBit(rank) {
    return 31 - (3 * rank);
}

function cornerPositionBit(rank) {
    return 12 - (2 * rank);
}

function CubeMini(data) {
    this.data = data || new Array(32);

    if (!CubeMini.__initialized__) {
        if (typeof require === 'function') {
            var CubeCompact = require('./cube-compact');
        }

        CubeMini.prototype.toString = function () {
            return CubeMini.padFormat(this.data.toString(2));
        };

        CubeMini.prototype.getCornerDirection = function (rank) {
            if (rank === 7) {
                // 并未存储, 进行脑补:
                var all = {0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true};

                for (var i = 1; i < 7; i++) {
                    delete all[this.getCornerDirection(i)];
                }

                for (var p in all) {
                    return p;
                }

                throw new Error('发生奇怪的错误, 脑补失败. 现场 all = ' + JSON.stringify(all));
            }

            return (this.data & parseInt(CubeMini.getCornerDirectionRepresent(7, rank))) >> cornerDirectionBit(rank);
        };

        CubeMini.prototype.getCornerPosition = function (rank) {
            if (rank === 7) {
                var stored = [];
                for (var i = 1; i < 7; i++) {
                    stored.push(this.getCornerPosition(i));
                }

                var sum = stored.reduce(function (x, y) {
                    return x + y;
                }, 0);

                var mod = sum % 3;

                if (mod === 0) {
                    return 0;
                } else if (mod === 1) {
                    return 2;
                } else if (mod === 2) {
                    return 1;
                }
            }

            return (this.data & parseInt(CubeMini.getCornerPositionRepresent(3, rank))) >> cornerPositionBit(rank);
        };

        CubeMini.prototype.toCubeCompact = function () {
            var ds = [];
            var ps = [];

            for (var i = 1; i <= 7; i++) {
                ds.push(this.getCornerDirection(i));
                ps.push(this.getCornerPosition(i));
            }

            return new CubeCompact(ds, ps);
        };

        CubeMini.prototype.toLiteString = function () {
            return this.toCubeCompact().toLiteString();
        };

        function makeTurn(t) {
            CubeMini.prototype[t] = (function (turn) {
                return function () {
                    var c = this.toCubeCompact();
                    c[turn]();

                    this.data = CubeMini.fromCubeCompact(c).data;
                    return this;
                }
            })(t);
        }

        for (var i = 0; i < CubeCompact.turns.length; i++) {
            makeTurn(CubeCompact.turns[i]);
        }

        CubeMini.prototype.randomize = function ($timeout, interval, numberOfSteps, callback) {
            var self = this;
            $timeout = $timeout || window.setTimeout;
            var availableSteps = ['B', 'B`', 'L', 'L`', 'U', 'U`'];

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

        CubeMini.__initialized__ = true;
    }
}

CubeMini.getPristineCube = function () {
    return new CubeMini(43819008);
};

CubeMini.fromCubeCompact = function (compact) {
    return new CubeMini(CubeMini.getCornerRepresent(compact.directions.slice(0, compact.directions.length - 1), compact.positions.slice(0, compact.positions.length - 1)));
};

CubeMini.fromState = function (state) {
    return new CubeMini(state);
};

CubeMini.getCornerDirectionRepresent = function (n, rank) {
    return Number(n) << cornerDirectionBit(rank);
};

CubeMini.getCornerPositionRepresent = function (n, rank) {
    return Number(n) << cornerPositionBit(rank);
};

CubeMini.getCornerRepresent = function (d, p) {
    var directions = [];
    var positions = [];

    for (var i = 0; i < d.length; i++) {
        directions.push(CubeMini.getCornerDirectionRepresent(d[i], i + 1));
    }

    for (var j = 0; j < p.length; j++) {
        positions.push(CubeMini.getCornerPositionRepresent(p[j], j + 1));
    }

    var c = directions.concat(positions);
    return c.reduce(function (x, y) {
        return x | y;
    }, 0);
};

CubeMini.padZeroLeft = function (s, n) {
    n = n || 32;
    var pad = new Array(n);

    for (var i = 0; i < pad.length; i++) {
        pad[i] = '0';
    }

    return (pad.join('') + s).substring(s.length);
};

CubeMini.binaryFormat = function (s) {
    s = String(s).split('').map(function (i) {
        return String(i);
    }).reverse();

    return s[31] + s[30] + s[29] + s[28] + ' ' + s[27] + s[26] + s[25] + s[24] +
        '|' + s[23] + s[22] + s[21] + s[20] + ' ' + s[19] + s[18] + s[17] + s[16] +
        '|' + s[15] + s[14] + s[13] + s[12] + ' ' + s[11] + s[10] + s[9] + s[8] +
        '|' + s[7] + s[6] + s[5] + s[4] + ' ' + s[3] + s[2] + s[1] + s[0];
};

CubeMini.padFormat = function (s) {
    return CubeMini.binaryFormat(CubeMini.padZeroLeft(s));
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CubeMini;
} else {
    window.CubeMini = CubeMini;
}