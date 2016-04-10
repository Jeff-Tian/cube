if (typeof module !== 'undefined' && module.exports) {
    var CubeWorld = require('./cube');
    var CubeLite = require('./cube-lite');
    var GraphWorld = require('./graph');
    var window = {};
}

function Iterator() {
}

Iterator.CubeIterator = function () {
    var self = this;

    if (!Iterator.CubeIterator.__initialized__) {
        Iterator.CubeIterator.prototype.getAdjacents = function (cube, turns) {
            turns = turns || Iterator.CubeIterator.turns;
            var ret = [];

            for (var i = 0; i < turns.length; i++) {
                var turn = turns[i];
                cube[turn]();
                ret.push(cube.toString());

                cube.reset();
            }

            return ret;
        };

        Iterator.CubeIterator.prototype.getAdjacentVertices = function (cube) {
            var turns = Iterator.CubeIterator.turns;

            var vs = [];

            for (var i = 0; i < turns.length; i++) {
                var op = turns[i];

                cube[op]();

                var v = new GraphWorld.Vertex(cube.toString());
                vs.push(v);

                cube.reset();
            }

            return vs;
        };

        Iterator.CubeIterator.prototype.breadthFirstTraverseFile = function (cube) {
            var start = cube.toString();
            console.log('starting ...', start);

            var self = this;

            var network = {nodes: {}};
            var unmarked = [start];

            var i = 1;
            var fs = require('fs');
            var filePath = './cube.csv';
            var option = 'utf-8';
            fs.writeFileSync(filePath, 'source, target\n', option);

            while (unmarked.length) {
                var current = unmarked.shift();

                if (network.nodes[current]) {
                    continue;
                    // console.error(network);
                    // throw new Error(current + ' 已经在第 ' + network.nodes[current] + ' 轮添加过了! i = ' + i + '.');
                }

                delete cube;
                cube = new CubeLite(current);

                var adj = self.getAdjacents(cube);

                if (adj.length !== 12) {
                    throw new Error('每个顶点应该连接另外的 12 个顶点, 而这个状态"' + cube.toString() + '"连接了 ', adj.length, ' 个.');
                }

                network.nodes[current] = i;

                console.log('marked ', i++, current);

                // var beforeAdded = unmarked.length;
                for (var j = 0; j < adj.length; j++) {
                    var v = adj[j];

                    if (!network.nodes[v]) {
                        // if (v === 'δγβαφχψωιολνμξκπεζσρθητυ') {
                        //     console.log('===================');
                        // }
                        // console.log(i, ': ', v);
                        // if (v === 'δγβαφχψωιολνμξκπεζσρθητυ') {
                        //     console.log('====================');
                        // }

                        fs.appendFileSync(filePath, current + ', ' + v + '\n', option);
                        unmarked.push(v);
                    }
                }
                // var afterAdded = unmarked.length;
                // console.log('beforeAdded: ', beforeAdded, '; afterAdded: ', afterAdded, '; added ', afterAdded - beforeAdded);

                // fs.appendFileSync(filePath, '\n', option);
            }

            console.log(network);

            return network;
        };

        Iterator.CubeIterator.prototype.breadthFirstTraverseQuick = function (cube) {
            var start = cube.toString();
            console.log('starting ...', start);

            var self = this;

            var network = {nodes: {}, edges: {}};
            var unmarked = [start];

            var i = 1;
            var fs = require('fs');
            while (unmarked.length) {

                var current = unmarked.shift();
                delete cube;
                cube = new CubeLite(current);

                var adj = self.getAdjacents(cube);

                if (adj.length !== 12) {
                    throw new Error('每个顶点应该连接另外的 12 个顶点, 而这个状态"' + cube.toString() + '"连接了 ', adj.length, ' 个.');
                }

                network.nodes[current] = adj.map(function (v) {
                    network.edges[current + '-' + v] = [current, v];
                    network.edges[v + '-' + current] = [v, current];

                    return v;
                });

                console.log('marked ', i++, current);

                var beforeAdded = unmarked.length;

                for (var k = 0; k < adj.length; k++) {
                    if (!network.nodes[adj[k]]) {
                        unmarked.push(adj[k]);
                    }
                }
                var afterAdded = unmarked.length;
                console.log('beforeAdded: ', beforeAdded, '; afterAdded: ', afterAdded, '; added ', afterAdded - beforeAdded);
            }

            console.log(network);
            fs.writeFileSync('./cube.csv', 'source, target, directed\n', 'utf-8');

            for (var key in network.edges) {
                fs.appendFileSync('./cube.csv', network.edges[key].join(', ') + ', TRUE\n', 'utf-8');
            }

            return network;
        };

        Iterator.CubeIterator.prototype.breadthFirstTraverseLite = function (cube) {
            var start = cube.toString();
            console.log('starting ...', start);

            var self = this;

            var network = {nodes: {}, edges: {}};
            var unmarked = [start];

            var i = 1;
            var fs = require('fs');
            while (unmarked.length) {

                var current = unmarked.shift();
                delete cube;
                cube = CubeWorld.Cube.fromState(current);

                network.nodes[current] = self.getAdjacentVertices(cube).map(function (v) {
                    network.edges[current + '-' + v.label] = [current, v.label];
                    network.edges[v.label + '-' + current] = [v.label, current];

                    return v.label
                });

                console.log('marked ', i++);

                var beforeAdded = unmarked.length;
                unmarked = unmarked.concat(network.nodes[current].filter(function (l) {
                    return !network.nodes[l];
                }));
                var afterAdded = unmarked.length;
                console.log('beforeAdded: ', beforeAdded, '; afterAdded: ', afterAdded, '; added ', afterAdded - beforeAdded);
            }

            console.log(network);
            fs.writeFileSync('./cube.csv', 'source, target\n', 'utf-8');

            for (var key in network.edges) {
                fs.appendFileSync('./cube.csv', network.edges[key].join(', ') + '\n', 'utf-8');
            }

            return network;
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

                    unmarked = unmarked.concat(
                        self.getAdjacentVertices(
                            CubeWorld.Cube.fromState(node.me.label)
                            )
                            .filter(function (me) {
                                return !(g.data[me]);
                            })
                            .map(function (me) {
                                    return {
                                        parent: node.me,
                                        me: me
                                    };
                                }
                            )
                    );
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

Iterator.CubeIterator.turns = ['F', 'F`', 'B', 'B`', 'U', 'U`', 'D', 'D`', 'L', 'L`', 'R', 'R`'];
Iterator.CubeIterator.restrictedTurns = ['F', 'U', 'R'];

Iterator.CubeIterator.getAdjacents = function (cube, turns) {
    turns = turns || Iterator.CubeIterator.turns;
    var ret = [];

    for (var i = 0; i < turns.length; i++) {
        var turn = turns[i];
        cube[turn]();
        ret.push(cube.toString());

        cube.reset();
    }

    return ret;
};

Iterator.CubeIterator.iterateTo = function (cube, endState) {
    var start = cube.toString();
    console.log('starting ...', start);

    var self = Iterator.CubeIterator;

    var network = {nodes: {}};
    var unmarked = [start];

    var i = 1;

    var found = false;

    while (unmarked.length && !found) {
        var current = unmarked.shift();

        if (network.nodes[current]) {
            continue;
        }

        delete cube;
        cube = new CubeLite(current);

        var adj = self.getAdjacents(cube, Iterator.CubeIterator.restrictedTurns);

        if (adj.length !== 3) {
            throw new Error('每个顶点应该连接另外的 3 个顶点, 而这个状态"' + cube.toString() + '"连接了 ', adj.length, ' 个.');
        }

        network.nodes[current] = adj;

        console.log(i++, ';');

        for (var j = 0; j < adj.length; j++) {
            var v = adj[j];

            if (!network.nodes[v]) {
                unmarked.push(v);
            }

            if (v === endState) {
                found = true;
                break;
            }
        }
    }

    console.log(network);

    return network;
};

Iterator.CubeIterator.iterate = function (cube) {
    var start = cube.toString();
    console.log('starting ...', start);

    var self = Iterator.CubeIterator;

    var network = {nodes: {}};
    var unmarked = [start];

    var i = 1;

    while (unmarked.length) {
        var current = unmarked.shift();

        if (network.nodes[current]) {
            continue;
        }

        delete cube;
        cube = new CubeLite(current);

        var adj = self.getAdjacents(cube, Iterator.CubeIterator.restrictedTurns);

        if (adj.length !== 3) {
            throw new Error('每个顶点应该连接另外的 3 个顶点, 而这个状态"' + cube.toString() + '"连接了 ', adj.length, ' 个.');
        }

        network.nodes[current] = i;

        console.log(i++, ';');

        for (var j = 0; j < adj.length; j++) {
            var v = adj[j];

            if (!network.nodes[v]) {
                unmarked.push(v);
            }
        }
    }

    console.log(network);

    return network;
};

Iterator.CubeIterator.iterateAndSaveFile = function (cube, filePath) {
    var start = cube.toString();
    console.log('starting ...', start);

    var self = Iterator.CubeIterator;

    var network = {nodes: {}};
    var unmarked = [start];

    var i = 1;
    var fs = require('fs');
    var option = 'utf-8';
    fs.writeFileSync(filePath, 'source, target\n', option);

    while (unmarked.length) {
        var current = unmarked.shift();

        if (network.nodes[current]) {
            continue;
        }

        delete cube;
        cube = new CubeLite(current);

        var adj = self.getAdjacents(cube, Iterator.CubeIterator.restrictedTurns);

        if (adj.length !== 3) {
            throw new Error('每个顶点应该连接另外的 3 个顶点, 而这个状态"' + cube.toString() + '"连接了 ', adj.length, ' 个.');
        }

        network.nodes[current] = i;

        console.log(i++, ';');

        for (var j = 0; j < adj.length; j++) {
            var v = adj[j];

            if (!network.nodes[v]) {
                fs.appendFileSync(filePath, current + ', ' + v + '\n', option);
                unmarked.push(v);
            }
        }
    }

    console.log(network);

    return network;
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Iterator;
} else {
    window.Iterator = Iterator;
}
