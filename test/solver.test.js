var solver = require('../cube/solver');
var GraphWorld = require('../cube/graph');
var assert = require('assert');

describe('Solver', function () {
    it('can find shortest path', function () {
        var v = new GraphWorld.Vertex('v');
        var w = new GraphWorld.Vertex('w');
        var e = new GraphWorld.Edge(v, w);
        var g = new GraphWorld.Graph([v, w], [e]);

        var expected = {l: 1, path: [v, w]};
        assert.deepStrictEqual(solver.shortestPath(g, v, w), expected);

        var x = new GraphWorld.Vertex('x');
        g.addVertex(x);
        g.addEdge(new GraphWorld.Edge(w, x));
        expected = {l: 2, path: [v, w, x]};

        assert.deepStrictEqual(solver.shortestPath(g, v, x), expected);

        var y = new GraphWorld.Vertex('y');
        var z = new GraphWorld.Vertex('z');
        g.addVertex(y);
        g.addVertex(z);
        g.addEdge(new GraphWorld.Edge(w, y));
        g.addEdge(new GraphWorld.Edge(x, z));

        console.log(g);

        expected = {l: 3, path: [v, w, x, z]};

        assert.deepStrictEqual(solver.shortestPath(g, v, z), expected);
    });

    it('can find the 1st shortest path', function () {
        var v = new GraphWorld.Vertex('v');
        var w = new GraphWorld.Vertex('w');
        var x = new GraphWorld.Vertex('x');
        var y = new GraphWorld.Vertex('y');
        var z = new GraphWorld.Vertex('z');

        var g = new GraphWorld.Graph([v, w, x, y, z], [
            new GraphWorld.Edge(v, w),
            new GraphWorld.Edge(w, x),
            new GraphWorld.Edge(w, y),
            new GraphWorld.Edge(x, z),
            new GraphWorld.Edge(y, z)
        ]);

        var expected = {l: 3, path: [v, w, x, z]};

        assert.deepStrictEqual(solver.shortestPath(g, v, z), expected);
    });

    it('can find the shortest path for simplest graph', function () {
        var a = new GraphWorld.Vertex('a');
        var b = new GraphWorld.Vertex('b');
        var c = new GraphWorld.Vertex('c');
        var d = new GraphWorld.Vertex('d');

        var g = new GraphWorld.Graph([a, b, c, d], [
            new GraphWorld.Edge(a, b),
            new GraphWorld.Edge(a, c),
            new GraphWorld.Edge(a, d)
        ]);

        var expected = {l: 1, path: [a, c]};

        assert.deepStrictEqual(solver.shortestPath(g, a, c), expected);
    });
});