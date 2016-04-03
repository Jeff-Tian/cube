if (typeof module !== 'undefined' && module.exports) {
    var GraphWorld = require('./graph');
}

function Position(x, y) {
    this.x = x;
    this.y = y;

    if (!Position.__initialized__) {
        Position.prototype.toString = function () {
            return '(' + Math.floor(this.x) + ', ' + Math.floor(this.y) + ')';
        };

        Position.__initialized__ = true;
    }
}

function CircleLayout(g, radius) {
    if (!(g instanceof GraphWorld.Graph)) {
        throw new Error('第一个参数必须是一个图的实例.');
    }

    if (typeof radius === 'undefined') {
        radius = 130;
    }

    this.blocks = {};

    var vs = g.vertices();

    var theta = Math.PI * 2 / vs.length;
    for (var i = 0; i < vs.length; i++) {
        v = vs[i];
        var x = radius * Math.cos(i * theta);
        var y = radius * Math.sin(i * theta);
        this.blocks[v] = new Position(x, y);
    }

    if (typeof this.pos !== 'function') {
        CircleLayout.prototype.pos = function (v) {
            return this.blocks[v];
        };

        CircleLayout.prototype.shift = function (offsetX, offsetY) {
            console.log('shifting ', offsetX, offsetY);
            for (var v in this.blocks) {
                console.log('Old position: ', this.blocks[v]);
                this.blocks[v] = new Position(
                    this.blocks[v].x + offsetX,
                    this.blocks[v].y + offsetY
                );
                console.log('New position: ', this.blocks[v]);
            }
        };
    }
}

var Layout = {
    CircleLayout: CircleLayout,
    Position: Position
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Layout;
} else {
    window.Layout = Layout;
}