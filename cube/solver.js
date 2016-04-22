(function (CubeLite, Iterator, CubeMini) {
    function Solver() {
    }

    Solver.shortestPath = function (undirectedGraph, start, end) {
        var startSet = [start];
        var d = {};
        d[start] = 0;
        var targetSet = undirectedGraph.vertices().slice(0).filter(function (v) {
            return v.toString() !== start.toString();
        });

        for (var i = 0; i < targetSet.length; i++) {
            d[targetSet[i]] = Infinity;
        }

        var y = start;

        var round = 0;
        while (targetSet.length) {
            round++;
            var min = Infinity;
            var minIndex = -1;

            // console.log('round ', round, ':, ', d, startSet);

            for (i = 0; i < targetSet.length; i++) {
                // console.log('探测目标集中第 ', i, ' 个点', targetSet[i]);
                // console.log('当前路径为 ', startSet);
                // console.log('当前到 ', targetSet[i], ' 的距离为 ', d[targetSet[i]]);
                // console.log('当前到 ', y, ' 的距离为 ', d[y]);
                var distance = (undirectedGraph.data[y][targetSet[i]] ? 1 : Infinity);
                // console.log('测试从 ', y, ' 到 ', targetSet[i], ' 的距离为 ', distance);
                var t = d[y] + distance;
                if (t < d[targetSet[i]]) {
                    d[targetSet[i]] = t;
                    targetSet[i].parent = y;
                }

                // console.log('所以当前到  ', targetSet[i], ' 的距离可以为 ', d[targetSet[i]]);

                if (d[targetSet[i]] < min) {
                    min = d[targetSet[i]];
                    minIndex = i;
                }
            }

            if (minIndex !== -1) {
                startSet.push(targetSet[minIndex]);

                y = targetSet[minIndex];
                // console.log('目标集中第 ', minIndex, ' 个元素: ', y, ' 被选中. 因为到它的路径最短, 为', min, targetSet, d, startSet);

                targetSet.splice(minIndex, 1);

                if (y.toString() === end.toString()) {
                    break;
                }
            } else {
                throw new Error('意外: 图是不连通的! 发现于第 ' + round + ' 轮.');
                break;
            }
        }

        var path = [end];
        while (path[0].parent) {
            path.unshift(path[0].parent);
        }

        return {l: d[end], path: path};
    };

    Solver.CubeSolver = function () {
        var self = this;

        if (!Solver.CubeSolver.__initialized__) {

            Solver.CubeSolver.__initialized__ = true;
        }
    };

    Solver.CubeSolver.solve = function (start, target) {
        var cube = new CubeLite(start);
        var g = Iterator.CubeIterator.iterateTo(cube, target);

        if (!g.data[target]) {
            throw new Error('求解失败');
        }

        var result = Solver.shortestPath(g, g.data[start].self, g.data[target].self);

        return result;
    };

    Solver.CubeSolver.convertToSteps = function (result) {
        var steps = [];

        for (var i = 0; i < result.path.length - 1; i++) {
            var changeMethod = CubeLite.getChangeMethod(result.path[i].toString(), result.path[i + 1].toString());

            steps.push(CubeLite.getStepByChangeMethod(changeMethod));
        }

        return steps.reverse().map(function (step) {
            return step.length === 1 ? step + '`' : step[0];
        });
    };

    Solver.CubeMiniSolver = function () {

    };

    Solver.CubeMiniSolver.getAdjacents = function (state) {
        var adjs = [];

        for (var i = 0; i < Solver.CubeMiniSolver.turns.length; i++) {
            var c = CubeMini.fromState(state);
            var turn = Solver.CubeMiniSolver.turns[i];

            c[turn]();
            adjs.push({
                turn: turn,
                data: c.data
            });
        }

        return adjs;
    };

    Solver.CubeMiniSolver.iterate = function (from, to) {

    };

    function search(leftUnmarked, leftTree, rightTree, found, from, to, loop, direction) {
        var current = leftUnmarked.shift();
        // console.log(direction, ': ', 'marking: ', current);
        leftTree[current.self.data] = {data: current.parent.data};
        leftTree[current.self.data].turn = current.self.turn;

        var adj = Solver.CubeMiniSolver.getAdjacents(current.self.data);
        var beforeAdd = leftUnmarked.length;
        for (var i = 0; i < adj.length; i++) {
            if (!leftTree[adj[i].data]) {
                var t = {
                    self: {data: adj[i].data, turn: adj[i].turn},
                    parent: {data: current.self.data, turn: current.self.turn}
                };

                if (t.self.data == 49561745) {
                    console.log(direction, ' will mark: ', t);
                }

                leftUnmarked.push(t);
            } else {
                continue;
            }

            if (rightTree[adj[i].data]) {
                found = adj[i];

                if (found.data == 1616658577) {
                    console.log(direction, ': ', current.self.data, '-->', '1616658577: ', found.turn);
                }

                leftTree[found.data] = {data: current.self.data};
                leftTree[found.data].turn = adj[i].turn;

                console.log(direction, ': 找到啦! 关键结点是: ' + JSON.stringify(found) + ', 起始点是 ' + from + ', 终点是: ' + to);
                break;
            } else {
                if (adj[i].data == '49561745') {
                    console.log(direction, ': ', current.self.data, '-->', adj[i].data, ': ', adj[i].turn);
                }
            }
        }
        var afterAdd = leftUnmarked.length;

        // console.log('第 ' + loop + ' 代新增结点: ' + (afterAdd - beforeAdd) + ' 个.');
        return found;
    }


    var reverseStepMap = {
        'L': 'L`',
        'L`': 'L',
        'U': 'U`',
        'U`': 'U',
        'B': 'B`',
        'B`': 'B'
    };

    Solver.CubeMiniSolver.twoWaySearch = function (from, to) {
        console.log('search from ', from, ' to ', to);
        var tree1 = {};
        tree1[from] = {data: from, turn: ''};
        var tree2 = {};
        tree2[to] = {data: to, turn: ''};

        var unmarked1 = [
            {
                parent: {data: from, turn: ''},
                self: {data: from, turn: ''}
            }
        ];

        var unmarked2 = [
            {
                parent: {data: to, turn: ''},
                self: {data: to, turn: ''}
            }
        ];

        var found = tree2[from] || tree1[to];

        var loop = 0;
        while (!found && (unmarked1.length || unmarked2.length)) {
            loop++;
            // console.log('第 ' + loop + ' 次循环:');

            if (unmarked1.length) {
                found = search(unmarked1, tree1, tree2, found, from, to, loop, 'left');
            }

            if (!found && unmarked2.length) {
                found = search(unmarked2, tree2, tree1, found, to, from, loop, 'right');
            }

            if (found) {
                console.log('found by: ');
                console.log('tree1 ? : ', tree1[found.data]);
                console.log('tree2 ? : ', tree2[found.data]);
            }
        }

        if (!found) {
            return {
                path: [],
                turns: [],
                steps: []
            };
        } else {
            var path = [found.data];
            var turns = [];

            var start = found;
            var parent = tree1[start.data];

            while (parent && (parent.data !== start.data)) {
                path.unshift(parent.data);
                turns.unshift(parent.turn);

                console.log('tree1 start = ' + start.data + ', parent = ' + parent.data, ' through inverse ', parent.turn);
                console.log('turns = ', turns);

                start = parent;
                parent = tree1[start.data];
            }

            start = found;
            parent = tree2[start.data];

            while (parent && (parent.data !== start.data)) {
                path.push(parent.data);
                turns.push(reverseStepMap[parent.turn]);

                console.log('tree2 from ' + start.data + ' parent = ' + parent.data, ' through ', reverseStepMap[parent.turn]);

                console.log('turns = ', turns);

                start = parent;
                parent = tree2[start.data];
            }

            // console.log('tree1 = ', tree1);
            // console.log('tree2 = ', tree2);
            console.log('path = ', path);
            console.log('turns = ', turns);

            return {
                // loops: loop,
                path: path,
                turns: turns.filter(function (t) {
                    return t !== '';
                })
                // steps: Solver.CubeMiniSolver.getSteps(path)
            };
        }
    };

    Solver.CubeMiniSolver.getSteps = function (path) {
        var steps = [];

        for (var i = 0; i < path.length - 1; i++) {
            var from = path[i];
            var to = path[i + 1];

            var found = false;
            for (var j = 0; j < Solver.CubeMiniSolver.turns.length; j++) {
                var turn = Solver.CubeMiniSolver.turns[j];
                var cube = CubeMini.fromState(from);
                cube[turn]();
                if (cube.data === to) {
                    steps.push(turn);
                    found = true;
                    break;
                }
            }

            if (!found) {
                throw new Error('从状态 ' + from + ' 到 ' + to + ' 没有一步到达的步骤!');
            }
        }

        return steps;
    };

    Solver.CubeMiniSolver.solve = function (from, to) {
        return Solver.CubeMiniSolver.twoWaySearch(from, to);
    };

    Solver.CubeMiniSolver.solveGreek = function (from, to) {
        return Solver.CubeMiniSolver.twoWaySearch(
            CubeMini.fromGreekState(from).data,
            CubeMini.fromGreekState(to).data
        );
    };

    Solver.CubeMiniSolver.turns = ['L', 'L`', 'U', 'U`', 'B', 'B`'];
    Solver.CubeMiniSolver.reverseStepMap = reverseStepMap;


    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Solver;
    } else {
        this.Solver = Solver;
    }

})(
    typeof require === 'function' ? require('./cube-lite') : window.CubeLite,
    typeof require === 'function' ? require('./iterator') : window.Iterator,
    typeof require === 'function' ? require('./cube-mini') : window.CubeMini
);