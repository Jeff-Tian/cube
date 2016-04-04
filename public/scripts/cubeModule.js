angular.module('cubeModule', [])
    .controller('cubeCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
        var drawing = false;

        function drawStateChanges() {
            if (drawing) {
                return false;
            }

            drawing = true;
            var vs = $scope.history.map(function (h) {
                return new GraphWorld.Vertex(h);
            });

            var es = [];

            for (var i = 0; i < vs.length - 1; i++) {
                es.push(new Edge(vs[i], vs[i + 1]));
            }

            var g = new GraphWorld.Graph(vs, es);
            var canvas = document.getElementById('mycanvas');
            var layout = new Layout.CircleLayout(g, Math.min(canvas.width, canvas.height) / 2 - 20);
            var painter = new Painter('mycanvas', g, layout);
            drawing = false;

            return true;
        }

        $scope.$timeout = $timeout;

        $scope.history = [];
        $scope.cube = CubeWorld.Cube.getPristineCube();
        $scope.CubeWorld = CubeWorld;

        //drawStateChanges();

        $scope.$watch('cube.toString()', function (newValue, oldValue) {
            if ($scope.history.indexOf(newValue) < 0) {
                cy.add({
                    data: {
                        id: newValue
                    }
                });
            }

            if ($scope.history.length) {
                var source = $scope.history[$scope.history.length - 1];
                var target = newValue;

                try {
                    cy.add({
                        data: {
                            id: source + ' -> ' + target,
                            source: source,
                            target: target
                        }
                    });

                    cy.add({
                        data: {
                            id: target + ' -> ' + source,
                            source: target,
                            target: source
                        }
                    });
                } catch (ex) {
                    console.error(ex);
                }
            }

            cy.layout({
                name: 'breadthfirst'
            });

            $scope.history.push(newValue.toString());
            //drawStateChanges();
        });

        var cy = cytoscape({
            container: document.getElementById('cy'),
            elements: [],
            style: [ // the stylesheet for the graph
                {
                    selector: 'node',
                    style: {
                        'background-color': '#666',
                        'label': 'data(id)'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': '#ccc',
                        'target-arrow-color': '#ccc',
                        'target-arrow-shape': 'triangle'
                    }
                }
            ],
            layout: {
                name: 'breadthfirst'
            }
        });

        $scope.traverseGraph = undefined;
        $scope.$watch('traverseGraph.toString()', function (newValue, oldValue) {
            console.error(newValue);
        });
        $scope.traverse = function () {
            var iter = new Iterator.CubeIterator();
            $scope.traverseGraph = iter.traverse($scope.cube, $timeout, 3000);
        };
    }])
;