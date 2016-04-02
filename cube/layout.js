if (typeof module !== 'undefined' && module.exports) {
    var GraphWorld = require('./graph');
}

function CircleLayout(g, radius) {
    if (!(g instanceof GraphWorld.Graph)) {
        throw new Error('第一个参数必须是一个图的实例.');
    }

    radius = radius || 130;

    this.data = {};

    for (var v in g.vertices()) {

    }
}


if (typeof module !== 'undefined' && module.exports) {
    module.exports = Layout;
} else {
    window.Layout = Layout;
}