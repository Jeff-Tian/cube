var assert = require('assert');
var GraphWorld = require('../cube/graph');

describe('Graph World', function () {
    it('should display itself', function () {
        var v1 = new GraphWorld.Vertex('test');
        assert.equal('Vertex (test)', v1.toString());
        assert.equal('test', v1.label);

        var v2 = new GraphWorld.Vertex('again');
        assert.equal('Vertex (again)', v2.toString());
        var e = new GraphWorld.Edge(v1, v2);
        assert.equal('Edge (Vertex (test), Vertex (again))', e.toString());

        var g = new GraphWorld.Graph([v1, v2], e);
        assert.deepStrictEqual([v1, v2], g.vertices());
    });

    it('can get edge item', function () {
        var v = new GraphWorld.Vertex('test');
        var w = new GraphWorld.Vertex('again');
        var e = new GraphWorld.Edge(v, w);
        assert.deepStrictEqual(v, e.getItem(0));
        assert.deepStrictEqual(w, e.getItem(1));
    });

    it('should get edge by given vertices', function () {
        var v = new GraphWorld.Vertex('test');
        var w = new GraphWorld.Vertex('again');
        var e = new GraphWorld.Edge(v, w);
        var g = new GraphWorld.Graph([v, w], e);
        assert.deepStrictEqual(e, g.getEdge(v, w));
        assert.deepStrictEqual([e], g.edges());
    });
});