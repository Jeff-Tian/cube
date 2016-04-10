function Vertex(label) {
    this.label = label;

    if (!Vertex.__initialized__) {
        Vertex.prototype.toString = function () {
            // return 'Vertex (' + this.label + ')';
            return this.label;
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
        if (!(arguments[i] instanceof Vertex)) {
            throw new Error('期待一个顶点，得到的却是 ' + JSON.stringify(arguments[i]));
        }
    }

    this.data = [v1, v2];

    this.repr = {
        label: v1.label + ' -> ' + v2.label,
        from: v1.label,
        to: v2.label
    };

    if (typeof this.getItem !== 'function') {
        Edge.prototype.getItem = function (key) {
            return this.data[key];
        }
    }

    if (!Edge.__initialized__) {
        Edge.prototype.toString = function () {
            return 'Edge (' + this.data[0].toString() + ', ' + this.data[1].toString() + ')';
        };

        Edge.__initialized__ = true;
    }
}

function Graph(vs, es) {
    if (!(es instanceof Array)) {
        es = [es];
    }

    this.data = {};

    if (!Graph.__initialized__) {
        function addVertex(v) {
            if (typeof this.data[v] !== 'undefined') {
                throw new Error('不能重复添加顶点: ', JSON.stringify(v));
            }

            this.data[v] = {
                self: v
            };
        }

        function addEdge(e) {
            var v = e.getItem(0),
                w = e.getItem(1)
                ;

            if (this.data[v][w] || this.data[w][v]) {
                throw new Error('已经存在边: ', JSON.stringify(e));
            }

            this.data[v][w] = e;
            this.data[w][v] = e;
        }

        Graph.prototype.addVertex = addVertex;
        Graph.prototype.addEdge = addEdge;
        Graph.prototype.vertices = function () {
            var vs = [];
            for (var v in this.data) {
                vs.push(this.data[v].self);
            }

            return vs;
        };
        Graph.prototype.getEdge = function (v, w) {
            edgeShouldContain2VerticesOnly([v, w]);

            return this.data[v][w];
        };
        Graph.prototype.edges = function () {
            var es = [];
            var edgeDict = {};

            var vs = this.vertices();

            for (var i = 0; i < vs.length; i++) {
                var v = vs[i];
                for (var j = 0; j < vs.length; j++) {
                    var w = vs[j];
                    var e = this.getEdge(v, w);
                    e && (edgeDict[e.repr.label] = e);
                }
            }

            for (var e in edgeDict) {
                es.push(edgeDict[e]);
            }

            return es;
        };
        Graph.prototype.getOutEdges = function (v) {

        };

        Graph.prototype.serializeToCSV = function () {
            var es = this.edges();
            var b = [['source', 'target']];

            for (var i = 0; i < es.length; i++) {
                b.push([es[i].getItem(0).label, es[i].getItem(1).label]);
            }

            return b.reduce(
                function (x, y) {
                    return x ? x + '\n' + y.join(', ') : y.join(', ');
                },
                ''
            );
        };

        Graph.prototype.toString = function () {
            return 'Vertices #' + this.vertices().length + ', Edges #' + this.edges().length;
        };

        Graph.__initialized__ = true;
    }

    for (var i = 0; i < vs.length; i++) {
        this.addVertex(vs[i]);
    }

    for (i = 0; i < es.length; i++) {
        this.addEdge(es[i]);
    }
}

Graph.simplestGraph = function () {
    var v = new Vertex('v');
    var w = new Vertex('w');
    var e = new Edge(v, w);
    var g = new Graph([v, w], [e]);

    return g;
};

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