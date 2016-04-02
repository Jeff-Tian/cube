function Vertex(label) {
    this.label = label;

    if (!Vertex.__initialized__) {
        Vertex.prototype.toString = function () {
            return 'Vertex (' + this.label + ')';
        };

        Vertex.__initialized__ = true;
    }
}

function edgeShouldContain2VerticesOnly(args) {
    if (args.length !== 2) {
        throw new Error('一条边必须有且仅有两个顶点.')
    }
}

function Edge(v1, v2) {
    edgeShouldContain2VerticesOnly(arguments);

    for (var i = 0; i < arguments.length; i++) {
        if (!(arguments[i] instanceof  Vertex)) {
            throw new Error('期待一个顶点，得到的却是 ' + JSON.stringify(arguments[i]));
        }
    }

    var data = [v1, v2];

    if (typeof this.getItem !== 'function') {
        Edge.prototype.getItem = function (key) {
            return data[key];
        }
    }

    if (!Edge.__initialized__) {
        Edge.prototype.toString = function () {
            return 'Edge (' + data[0].toString() + ', ' + data[1].toString() + ')';
        };

        Edge.__initialized__ = true;
    }
}

function Graph(vs, es) {
    if (!(es instanceof  Array)) {
        es = [es];
    }

    var data = {};

    if (!Graph.__initialized__) {
        function addVertex(v) {
            data[v] = {};
        }

        function addEdge(e) {
            var v = e.getItem(0),
                w = e.getItem(1)
                ;

            data[v][w] = e;
            console.log('added edge to ', data[v][w]);
            data[w][v] = e;
            console.log('added edge to ', data[w][v]);
        }

        Graph.prototype.addVertex = addVertex;
        Graph.prototype.addEdge = addEdge;
        Graph.prototype.vertices = function () {
            var vs = [];
            for (var v in data) {
                console.log('finding vertex: ', v)
                vs.push(v);
            }

            return vs;
        };
        Graph.prototype.getEdge = function (v, w) {
            edgeShouldContain2VerticesOnly([v, w]);
            console.log('all data: ', data);

            return data[v][w];
        };
        Graph.prototype.edges = function () {
            var es = [];
            var vs = this.vertices();

            for (var i = 0; i < vs.length; i++) {
                var v = vs[i];
                console.log('|' + v);
                for (var j = 0; j < vs.length; j++) {
                    var w = vs[j];
                    console.log('--' + w);
                    var e = this.getEdge(v, w);
                    if (e && es.indexOf(e) < 0) {
                        es.push(e);
                    }
                }
            }

            return es;
        };

        Graph.__initialized__ = true;
    }

    for (var i = 0; i < vs.length; i++) {
        console.log('adding ', vs[i]);
        this.addVertex(vs[i]);
    }

    console.log('done adding vertices.', data);

    for (i = 0; i < es.length; i++) {
        this.addEdge(es[i]);
    }
}

var GraphWorld = {
    Vertex: Vertex,
    Edge: Edge,
    Graph: Graph
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GraphWorld;
} else {
    window.GraphWorld = GraphWorld;
}