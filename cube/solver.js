if (typeof module !== 'undefined' && module.exports) {
    var CubeWorld = require('./cube');
    var CubeLite = require('./cube-lite');
    var GraphWorld = require('./graph');
    var Iterator = require('./iterator');
    var CubeMini = require('./cube-mini');
    var window = {};
}

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
        adjs.push(c.data);
    }

    return adjs;
};

Solver.CubeMiniSolver.iterate = function (from, to) {

};

function search(leftUnmarked, leftTree, rightTree, found, from, to, loop) {
    var current1 = leftUnmarked.shift();
    leftTree[current1.self] = current1.parent;

    var adj1 = Solver.CubeMiniSolver.getAdjacents(current1.self);
    var beforeAdd = leftUnmarked.length;
    for (var i = 0; i < adj1.length; i++) {
        if (!leftTree[adj1[i]]) {
            leftUnmarked.push({self: adj1[i], parent: current1.self});
        } else {
            continue;
        }

        if (rightTree[adj1[i]]) {
            found = adj1[i];
            leftTree[found] = current1.self;

            console.log('找到啦! 关键结点是: ' + found + ', 起始点是 ' + from + ', 终点是: ' + to);
            break;
        }
    }
    var afterAdd = leftUnmarked.length;

    console.log('第 ' + loop + ' 代新增结点: ' + (afterAdd - beforeAdd) + ' 个.');
    return found;
}

Solver.CubeMiniSolver.twoWaySearch = function (from, to) {
    var tree1 = {};
    tree1[from] = from;
    var tree2 = {};
    tree2[to] = to;

    var unmarked1 = [{parent: from, self: from}];
    var unmarked2 = [{parent: to, self: to}];

    var found = tree2[from] || tree1[to];

    var loop = 0;
    while (!found && (unmarked1.length || unmarked2.length)) {
        loop++;
        console.log('第 ' + loop + ' 次循环:');

        if (unmarked1.length) {
            found = search(unmarked1, tree1, tree2, found, from, to, loop);
        }

        if (!found && unmarked2.length) {
            found = search(unmarked2, tree2, tree1, found, to, from, loop);
        }
    }

    if (!found) {
        return [];
    } else {
        var path = [found];

        var start = found;
        var parent = tree1[start];

        console.log('tree1 from ' + found + ' parent = ' + parent);
        while (parent && (parent !== start)) {
            path.unshift(parent);

            start = parent;
            parent = tree1[parent];

            console.log('start = ' + start + ', parent = ' + parent);
        }

        start = found;
        parent = tree2[found];
        console.log('tree2 from ' + found + ' parent = ' + parent);
        while (parent && (parent !== start)) {
            path.push(parent);

            start = parent;
            parent = tree2[parent];
        }

        return {
            path: path,
            steps: Solver.CubeMiniSolver.getSteps(path)
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

Solver.CubeMiniSolver.turns = ['L', 'L`', 'U', 'U`', 'B', 'B`'];


if (typeof module !== 'undefined' && module.exports) {
    module.exports = Solver;
} else {
    window.Solver = Solver;
}
