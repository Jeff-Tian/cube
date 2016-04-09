if (typeof module !== 'undefined' && module.exports) {
    var window = {};
}

function CubeLite(label) {
    this.label = label.split('');
    this.changeMethod = {
        0: 0,
        1: 1,
        2: 2,
        3: 3
    };

    if (!CubeLite.__initialized__) {
        CubeLite.prototype.change = function (changeDef) {
            var self = this;

            function changeInner(a) {
                var t = self.label[a[0]];
                for (var i = 0; i < a.length - 2; i++) {
                    self.label[a[i]] = self.label[a[i + 1]];
                }

                self.label[a[a.length - 2]] = t;
            }

            for (var i = 0; i < changeDef.length; i++) {
                var a = changeDef[i];

                changeInner(a);
            }

            return this;
        };

        CubeLite.prototype.F = function () {
            console.log('before F: ', this.label.toString());
            this.change([[0, 2, 3, 1, 0], [9, 20, 14, 19, 9], [11, 21, 12, 18, 11]]);
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