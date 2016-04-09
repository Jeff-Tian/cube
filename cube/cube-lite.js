if (typeof module !== 'undefined' && module.exports) {
    var window = {};
}

function CubeLite(label) {
    this.label = label.split('');

    if (!CubeLite.__initialized__) {
        CubeLite.prototype.change = function (changeDef) {
            var another = this.label.slice(0);

            for (var source in changeDef) {
                var target = changeDef[source];

                this.label[source] = another[target];
            }

            for (var i = 0; i < 24; i++) {
                if (typeof changeDef[i] === 'undefined') {
                    this.label[i] = another[i];
                }
            }
        };

        CubeLite.prototype.getChangeMethod = function (label1, label2) {
            var ret = [];


            return ret;
        };

        CubeLite.prototype.F = function () {
            console.log('before F: ', this.label.toString());
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
            this.F().F().F();
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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CubeLite;
} else {
    window.CuteLite = CubeLite;
}