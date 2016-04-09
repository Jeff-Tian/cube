if (typeof module !== 'undefined' && module.exports) {
    var window = {};
}

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

        CubeLite.prototype.F = function () {
            console.log('before F: ', this.toString());
            // this.change([[0, 2, 3, 1, 0], [9, 20, 14, 19, 9], [11, 21, 12, 18, 11]]);
            this.change({
                0: 2,
                2: 3,
                3: 1,
                1: 0,

                9: 20,
                20: 14,
                14: 19,
                19: 9,

                11: 21,
                21: 12,
                12: 18,
                18: 11
            });
            console.log('after F: ', this.toString());

            return this;
        };

        CubeLite.prototype['F`'] = function () {
            return this.change({
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
            });
        };

        CubeLite.prototype.B = function () {
            return this.change({
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
            });
        };

        CubeLite.prototype['B`'] = function () {
            return this.change({
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
            });
        };

        CubeLite.prototype.L = function () {
            return this.change({
                0: 16,
                2: 18,
                5: 22,
                7: 20,
                8: 10,
                9: 8,
                10: 11,
                11: 9,
                16: 7,
                18: 5,
                20: 0,
                22: 2
            });
        };

        CubeLite.prototype['L`'] = function () {
            return this.change({
                0: 20,
                2: 22,
                5: 18,
                7: 16,
                8: 9,
                9: 11,
                10: 8,
                11: 10,
                16: 0,
                18: 2,
                20: 7,
                22: 5
            });
        };

        CubeLite.prototype.R = function () {
            return this.change({
                1: 21,
                3: 23,
                4: 19,
                6: 17,
                12: 14,
                13: 12,
                14: 15,
                15: 13,
                17: 1,
                19: 3,
                21: 6,
                23: 4
            });
        };

        CubeLite.prototype['R`'] = function () {
            return this.change({
                1: 17,
                3: 19,
                4: 23,
                6: 21,
                12: 13,
                13: 15,
                14: 12,
                15: 14,
                17: 6,
                19: 4,
                21: 1,
                23: 3
            });
        };

        CubeLite.prototype.U = function () {
            return this.change({
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
            });
        };

        CubeLite.prototype['U`'] = function () {
            return this.change({
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
            });
        };

        CubeLite.prototype['D'] = function () {
            return this.change({
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
            });
        };

        CubeLite.prototype['D`'] = function () {
            return this.change({
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
            });
        };

        CubeLite.prototype.reset = function () {
            this.label = this.original.slice(0);
        };

        CubeLite.prototype.toString = function () {
            return this.label.join('');
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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CubeLite;
} else {
    window.CuteLite = CubeLite;
}