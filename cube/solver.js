if (typeof module !== 'undefined' && module.exports) {
    var CubeWorld = require('./cube');
    var CubeLite = require('./cube-lite');
    var GraphWorld = require('./graph');
    var Iterator = require('./iterator');
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

        console.log('round ', round, ':, ', d, startSet);

        for (i = 0; i < targetSet.length; i++) {
            console.log('探测目标集中第 ', i, ' 个点', targetSet[i]);
            console.log('当前路径为 ', startSet);
            console.log('当前到 ', targetSet[i], ' 的距离为 ', d[targetSet[i]]);
            console.log('当前到 ', y, ' 的距离为 ', d[y]);
            var distance = (undirectedGraph.data[y][targetSet[i]] ? 1 : Infinity);
            console.log('测试从 ', y, ' 到 ', targetSet[i], ' 的距离为 ', distance);
            var t = d[y] + distance;
            if (t < d[targetSet[i]]) {
                d[targetSet[i]] = t;
                targetSet[i].parent = y;
            }

            console.log('所以当前到  ', targetSet[i], ' 的距离可以为 ', d[targetSet[i]]);

            if (d[targetSet[i]] < min) {
                min = d[targetSet[i]];
                minIndex = i;
            }
        }

        if (minIndex !== -1) {
            startSet.push(targetSet[minIndex]);

            y = targetSet[minIndex];
            console.log('目标集中第 ', minIndex, ' 个元素: ', y, ' 被选中. 因为到它的路径最短, 为', min, targetSet, d, startSet);

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
    var network = Iterator.CubeIterator.iterateTo(cube, target);
    return network;
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Solver;
} else {
    window.Solver = Solver;
}
