if (typeof module !== 'undefined' && module.exports) {
    var CubeWorld = require('./cube');
    var GraphWorld = require('./graph');
    var window = {};
}

function Iterator() {
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

        Iterator.CubeIterator.prototype.breadthFirstTraverse = function (cube) {
            if (!(cube instanceof CubeWorld.Cube)) {
                throw new Error('期待一个 Cube 实例, 得到的是 ', JSON.stringify(cube));
            }

            var self = this;

            var g = new GraphWorld.Graph([], []);

            var v = new GraphWorld.Vertex(cube.toString());

            var unmarked = [{
                parent: null,
                me: v
            }];

            function mark() {
                var node = unmarked.shift();

                try {
                    g.addVertex(node.me);

                    if (node.parent) {
                        g.addEdge(new GraphWorld.Edge(node.parent, node.me));
                    }

                    unmarked = unmarked.concat(self.getAdjacentVertices(CubeWorld.Cube.fromState(node.me.label)).map(function (me) {
                        return {
                            parent: node.me,
                            me: me
                        };
                    }));
                } catch (ex) {
                    console.error(ex);
                }
            }

            while (unmarked.length) {
                mark();
            }

            return g;
        };

        Iterator.CubeIterator.prototype.traverse = function (cube, $timeout, interval, callback) {
            if (!(cube instanceof CubeWorld.Cube)) {
                callback();

                throw new Error('期待一个 Cube 实例, 得到的是 ', JSON.stringify(cube));
            }
            var recurseTimes = 0;

            $timeout = $timeout || window.setTimeout;

            function traverse(c, parentVertex) {
                if (recurseTimes++ > 13) {
                    return;
                }

                var v = new GraphWorld.Vertex(c.toString());
                try {
                    g.addVertex(v);

                    if (parentVertex) {
                        var e = new GraphWorld.Edge(parentVertex, v);

                        g.addEdge(e);
                    }
                } catch (ex) {
                    console.error(ex);
                    return;
                }

                var nextVertices = self.getAdjacentVertices(c);

                if (interval) {
                    $timeout(function () {
                        traverseNextGen(nextVertices, v);
                    }, interval);
                } else {
                    traverseNextGen(nextVertices, v);
                }
            }

            function traverseNextGen(nextVertices, parentVertex) {
                for (var i = 0; i < nextVertices.length; i++) {
                    traverse(CubeWorld.Cube.fromState(nextVertices[i].label), parentVertex);
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