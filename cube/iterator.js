function Iterator() {

    var vs = [];
    var es = [];

    var cubeHistory = [];

    var rs = ['F', 'F`', 'B', 'B`', 'U', 'U`', 'D', 'D`', 'L', 'L`', 'R', 'R`'];

    var traversor = {};

    for (var i = 0; i < rs.length; i++) {
        traversor[rs[i]] = function (cube) {
            cube[rs[i]]();
            cubeHistory.push(cube.toString());
        }
    }

    var cube = CubeWorld.Cube.getPristineCube();
    var v = new GraphWorld.Vertex(cube.toString());
    v.marked = true;
    cubeHistory.push(cube.toString());

    vs.push(v);

    traversor.F(cube);
}

Iterator.CubeIterator = function () {
    var self = this;

    if (!Iterator.CubeIterator.__initialized__) {
        Iterator.CubeIterator.prototype.getAdjacentVertices = function (cube) {
            var rs = ['F', 'F`', 'B', 'B`', 'U', 'U`', 'D', 'D`', 'L', 'L`', 'R', 'R`'];

            var vs = [];

            for (var i = 0; i < rs.length; i++) {
                var op = rs[i];

                cube[op]();

                var v = new GraphWorld.Vertex(cube.toString());
                vs.push(v);

                cube.reset();
            }

            return vs;
        };

        Iterator.CubeIterator.prototype.traverse = function (cube, $timeout, interval) {
            if (!(cube instanceof CubeWorld.Cube)) {
                throw new Error('期待一个 Cube 实例, 得到的是 ', JSON.stringify(cube));
            }

            $timeout = $timeout || window.setTimeout;

            function traverse(c) {
                var v = new GraphWorld.Vertex(c.toString());
                try {
                    g.addVertex(v);
                } catch (ex) {
                    return;
                }

                var nextVertices = self.getAdjacentVertices(c);

                if (interval) {
                    $timeout(function () {
                        traverseNextGen(nextVertices);
                    }, interval);
                } else {
                    traverseNextGen(nextVertices);
                }
            }

            function traverseNextGen(nextVertices) {
                for (var i = 0; i < nextVertices.length; i++) {
                    traverse(CubeWorld.Cube.fromState(nextVertices[i].label));
                }
            }

            var g = new GraphWorld.Graph([], []);

            traverse(cube);

            return g;
        };

        Iterator.CubeIterator.__initialized__ = true;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Iterator;
} else {
    window.Iterator = Iterator;
}