angular.module('cubeModule', [])
    .controller('cubeCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
        $scope.$timeout = $timeout;

        $scope.history = [];
        $scope.miniHistory = [];
        $scope.cube = CubeWorld.Cube.getPristineCube();
        $scope.CubeWorld = CubeWorld;

        $scope.state = {
            label: $scope.cube.toString(),
            steps: []
        };

        $scope.executeButtonValid = false;
        $scope.$watch('state.steps', function (newValue, oldValue) {
            if (typeof newValue === 'string') {
                newValue = newValue.replace(' ', '').split(/[,，]/);
            }

            $scope.executeButtonValid = true;
            for (var i = 0; i < newValue.length; i++) {
                var t = newValue[i];
                if (Iterator.CubeIterator.turns.indexOf(t) < 0) {
                    $scope.executeButtonValid = false;
                    break;
                }
            }

            if ($scope.executeButtonValid) {
                $scope.state.steps = newValue;
            }

            // console.log(oldValue, '-->', newValue);
        });

        $scope.resetCube = function () {
            $scope.doing = true;
            $scope.cube.reset($timeout, 100, function () {
                $scope.doing = false;
            });
        };

        $scope.randomizeCube = function () {
            $scope.doing = true;
            $scope.cube.randomize($timeout, 100, undefined, function () {
                $scope.doing = false;
            });
        };

        $scope.doing = false;
        $scope.execute = function () {
            function oneByOne(callback) {
                if ($scope.state.steps.length) {
                    var s = $scope.state.steps.shift();
                    $scope.cube[s]();
                    if ($scope.state.steps.length) {
                        $timeout(function () {
                            oneByOne(callback);
                        }, 500);
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            }

            $scope.doing = true;
            oneByOne(function () {
                $scope.state.steps = [];
                $scope.doing = false;
            });
        };

        $scope.generate = function () {
            $scope.cube = CubeWorld.Cube.fromState($scope.state.label);
        };

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
            $scope.miniHistory.push($scope.getMiniString(newValue.toString()));
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

        function toCytoscapeElements(g) {
            var a = [];

            var vs = g.vertices();
            for (var i = 0; i < vs.length; i++) {
                a.push({
                    data: {
                        id: vs[i].label
                    }
                });
            }

            var es = g.edges();
            for (i = 0; i < es.length; i++) {
                var e = es[i];
                var source = e.getItem(0).label;
                var target = e.getItem(1).label;

                a.push({
                    data: {
                        id: source + ' -> ' + target,
                        source: source,
                        target: target
                    }
                });

                a.push({
                    data: {
                        id: target + ' -> ' + source,
                        source: target,
                        target: source
                    }
                });
            }

            return a;
        }

        $scope.traverseGraph = undefined;
        window.$scope = $scope;
        $scope.$watch('traverseGraph.toString()', function (newValue, oldValue) {
            if (!newValue) {
                return;
            }

            cy = cytoscape({
                container: document.getElementById('cy'),
                elements: toCytoscapeElements($scope.traverseGraph),
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
        });

        $scope.traverse = function () {
            var iter = new Iterator.CubeIterator();
            $scope.traverseGraph = iter.traverse($scope.cube, $timeout, 3000);
        };

        function convertCubeStateToMiniState(cubeState) {
            var l = new CubeLite(cubeState);
            var compact = l.toCubeCompact();
            var m = CubeMini.fromCubeCompact(compact);
            return m.data;
        }

        $scope.solve = function () {
            $scope.doing = true;

            $timeout(function () {
                var from = ($scope.history[0]);
                var to = ($scope.history[$scope.history.length - 1]);

                $scope.result = Solver.CubeMiniSolver.solveGreek(from, to);

                $scope.state.steps = $scope.result.steps.reverse();
                $scope.doing = false;
            }, 100);
        };

        $scope.getMiniString = function (cubeState) {
            cubeState = cubeState || $scope.cube.toString();
            var cubeMini = CubeMini.fromCubeCompact(new CubeLite(cubeState).toCubeCompact());

            return cubeMini.data;
        };
    }])
;