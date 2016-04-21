(function (CubeCompact) {
    var Colors = {
        yellow: 'Yellow',
        white: 'White',
        blue: 'Blue',
        green: 'Green',
        orange: 'Orange',
        red: 'Red'
    };

    var LabelColorMapping = {
        'α': Colors.blue,
        'β': Colors.blue,
        'γ': Colors.blue,
        'δ': Colors.blue,

        'φ': Colors.green,
        'χ': Colors.green,
        'ψ': Colors.green,
        'ω': Colors.green,

        'ι': Colors.orange,
        'κ': Colors.orange,
        'λ': Colors.orange,
        'μ': Colors.orange,

        'ν': Colors.red,
        'ξ': Colors.red,
        'ο': Colors.red,
        'π': Colors.red,

        'ε': Colors.yellow,
        'ζ': Colors.yellow,
        'η': Colors.yellow,
        'θ': Colors.yellow,

        'ρ': Colors.white,
        'σ': Colors.white,
        'τ': Colors.white,
        'υ': Colors.white
    };

    function CubeLite(label) {
        this.original = label.split('');
        this.label = this.original.slice(0);

        if (!CubeLite.__initialized__) {
            CubeLite.prototype.change = function (changeDef) {
                var another = this.label.slice(0);

                var i = 0;
                for (var source in changeDef) {
                    i++;
                    var target = changeDef[source];

                    this.label[source] = another[target];
                }

                // if (i < 23) {
                //     for (var i = 0; i < 24; i++) {
                //         if (typeof changeDef[i] === 'undefined') {
                //             this.label[i] = another[i];
                //         }
                //     }
                // }

                return this;
            };

            CubeLite.prototype.getChangeMethod = function (label1, label2) {
                return CubeLite.getChangeMethod(label1, label2);
            };

            // TODO: why the following not work
            // var rs = ['F', 'F`', 'B', 'B`', 'L', 'L`', 'R', 'R`', 'U', 'U`', 'D', 'D`'];
            //
            // for (var i = 0; i < rs.length; i++) {
            //     var r = rs[i];
            //
            //     CubeLite.prototype[r] = function () {
            //         return this.change(CubeLite.rotateMapping[r]);
            //     };
            // }

            CubeLite.prototype.F = function () {
                // console.log('before F: ', this.toString());
                // this.change([[0, 2, 3, 1, 0], [9, 20, 14, 19, 9], [11, 21, 12, 18, 11]]);
                this.change(CubeLite.rotateMapping.F);
                // console.log('after F: ', this.toString());

                return this;
            };

            CubeLite.prototype['F`'] = function () {
                return this.change(CubeLite.rotateMapping['F`']);
            };

            CubeLite.prototype.B = function () {
                return this.change(CubeLite.rotateMapping.B);
            };

            CubeLite.prototype['B`'] = function () {
                return this.change(CubeLite.rotateMapping['B`']);
            };

            CubeLite.prototype.L = function () {
                return this.change(CubeLite.rotateMapping.L);
            };

            CubeLite.prototype['L`'] = function () {
                return this.change(CubeLite.rotateMapping['L`']);
            };

            CubeLite.prototype.R = function () {
                return this.change(CubeLite.rotateMapping.R);
            };

            CubeLite.prototype['R`'] = function () {
                return this.change(CubeLite.rotateMapping['R`']);
            };

            CubeLite.prototype.U = function () {
                return this.change(CubeLite.rotateMapping.U);
            };

            CubeLite.prototype['U`'] = function () {
                return this.change(CubeLite.rotateMapping['U`']);
            };

            CubeLite.prototype['D'] = function () {
                return this.change(CubeLite.rotateMapping['D']);
            };

            CubeLite.prototype['D`'] = function () {
                return this.change(CubeLite.rotateMapping['D`']);
            };

            CubeLite.prototype.reset = function () {
                this.label = this.original.slice(0);
            };

            CubeLite.prototype.toString = function () {
                return this.label.join('');
            };

            CubeLite.prototype.toCubeCompact = function () {
                function mapLabelToColor(l) {
                    var c = LabelColorMapping[l];

                    // console.log('mapping ', l, ' to ', c);

                    return c;
                }

                // console.log('Corner Mapping: ', CubeCompact.Corners);

                var directions = [
                    CubeCompact.Corners[this.getBackLeftTopCorner().map(mapLabelToColor).join('')],
                    CubeCompact.Corners[this.getFrontRightTopCorner().map(mapLabelToColor).join('')],
                    CubeCompact.Corners[this.getFrontLeftTopCorner().map(mapLabelToColor).join('')],
                    CubeCompact.Corners[this.getBackRightTopCorner().map(mapLabelToColor).join('')],

                    CubeCompact.Corners[this.getBackLeftBottomCorner().map(mapLabelToColor).join('')],
                    CubeCompact.Corners[this.getFrontLeftBottomCorner().map(mapLabelToColor).join('')],
                    CubeCompact.Corners[this.getBackRightBottomCorner().map(mapLabelToColor).join('')]
                ];

                var positions = [0, 0, 0, 0, 0, 0, 0];

                return new CubeCompact(directions, positions);
            };

            CubeLite.prototype.getFrontLeftTopCorner = function () {
                return [this.label[18], this.label[9], this.label[0]];
            };

            CubeLite.prototype.getFrontRightTopCorner = function () {
                return [this.label[19], this.label[1], this.label[12]];
            };

            CubeLite.prototype.getFrontLeftBottomCorner = function () {
                return [this.label[20], this.label[2], this.label[11]];
            };

            CubeLite.prototype.getFrontRightBottomCorner = function () {
                return [this.label[21], this.label[14], this.label[3]];
            };

            CubeLite.prototype.getBackLeftTopCorner = function () {
                return [this.label[17], this.label[13], this.label[7]];
            };

            CubeLite.prototype.getBackRightTopCorner = function () {
                return [this.label[16], this.label[6], this.label[8]];
            };

            CubeLite.prototype.getBackLeftBottomCorner = function () {
                return [this.label[23], this.label[5], this.label[15]];
            };

            CubeLite.prototype.getBackRightBottomCorner = function () {
                return [this.label[22], this.label[10], this.label[4]]
            };

            CubeLite.__initialized__ = true;
        }
    }

    CubeLite.getPristineCube = function () {
        return new CubeLite('αβγδφχψωικλμνξοπεζηθρστυ');
    };

    CubeLite.getChangeMethod = function (label1, label2) {
        var ret = {};

        for (var i = 0; i < label1.length; i++) {
            var index = label1.indexOf(label2[i]);
            if (index !== i) {
                ret[i] = index;
            }
        }

        return ret;
    };

    CubeLite.getStepByChangeMethod = function (changeMethod) {
        for (var s in CubeLite.rotateMapping) {
            if (JSON.stringify(changeMethod) === JSON.stringify(CubeLite.rotateMapping[s])) {
                return s;
            }
        }

        var m = '找不到这个变换对应的步骤. ';
        console.error(m, changeMethod);
        throw new Error(m + JSON.stringify(changeMethod));
    };

    CubeLite.rotateMapping = {
        F: {
            0: 2,
            1: 0,
            2: 3,
            3: 1,
            9: 20,
            11: 21,
            12: 18,
            14: 19,
            18: 11,
            19: 9,
            20: 14,
            21: 12
        },
        'F`': {
            0: 1,
            1: 3,
            2: 0,
            3: 2,
            9: 19,
            11: 18,
            12: 21,
            14: 20,
            18: 12,
            19: 14,
            20: 9,
            21: 11
        },
        B: {
            4: 6,
            5: 4,
            6: 7,
            7: 5,
            8: 17,
            10: 16,
            13: 23,
            15: 22,
            16: 13,
            17: 15,
            22: 8,
            23: 10
        },
        'B`': {
            4: 5,
            5: 7,
            6: 4,
            7: 6,
            8: 22,
            10: 23,
            13: 16,
            15: 17,
            16: 10,
            17: 8,
            22: 15,
            23: 13
        },
        L: {
            0: 16,
            2: 18,
            4: 20,
            6: 22,
            8: 10,
            9: 8,
            10: 11,
            11: 9,
            16: 4,
            18: 6,
            20: 0,
            22: 2
        },
        'L`': {
            0: 20,
            2: 22,
            4: 16,
            6: 18,
            8: 9,
            9: 11,
            10: 8,
            11: 10,
            16: 0,
            18: 2,
            20: 4,
            22: 6
        },
        R: {
            1: 21,
            3: 23,
            5: 17,
            7: 19,
            12: 14,
            13: 12,
            14: 15,
            15: 13,
            17: 1,
            19: 3,
            21: 5,
            23: 7
        },
        'R`': {
            1: 17,
            3: 19,
            5: 21,
            7: 23,
            12: 13,
            13: 15,
            14: 12,
            15: 14,
            17: 5,
            19: 7,
            21: 1,
            23: 3
        },
        U: {
            0: 12,
            1: 13,
            6: 9,
            7: 8,
            8: 0,
            9: 1,
            12: 7,
            13: 6,
            16: 18,
            17: 16,
            18: 19,
            19: 17
        },
        'U`': {
            0: 8,
            1: 9,
            6: 13,
            7: 12,
            8: 7,
            9: 6,
            12: 0,
            13: 1,
            16: 17,
            17: 19,
            18: 16,
            19: 18
        },
        D: {
            2: 10,
            3: 11,
            4: 15,
            5: 14,
            10: 5,
            11: 4,
            14: 2,
            15: 3,
            20: 22,
            21: 20,
            22: 23,
            23: 21
        },
        'D`': {
            2: 14,
            3: 15,
            4: 11,
            5: 10,
            10: 2,
            11: 3,
            14: 5,
            15: 4,
            20: 21,
            21: 23,
            22: 20,
            23: 22
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = CubeLite;
    } else {
        this.CubeLite = CubeLite;
    }
})((typeof require === 'function') ? require('./cube-compact') : window.CubeCompact);
