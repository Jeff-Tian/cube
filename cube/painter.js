function Painter(canvasId, g, layout) {
    var canvas = document.getElementById(canvasId);
    layout.shift(canvas.width / 2, canvas.height / 2);
    var context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.strokeStyle = '#ffffff';

    function drawEdge(e) {
        var v = e.getItem(0).pos || layout.pos(e.getItem(0));
        var w = e.getItem(1).pos || layout.pos(e.getItem(1));
        context.fillStyle = '#ffffff';
        context.moveTo(v.x, v.y);
        context.lineTo(w.x, w.y);
        context.stroke();
    }

    function drawVertex(v, r, color) {
        console.log('drawing vertex: ', JSON.stringify(v));
        if (typeof r === 'undefined') {
            r = 20;
        }

        if (typeof color === 'undefined') {
            color = '#ffff00';
        }

        context.fillStyle = color;
        context.beginPath();
        var pos = v.pos || layout.pos(v);
        context.arc(pos.x, pos.y, r, 0, Math.PI * 2, true);
        context.fill();

        context.fillStyle = '#ff0000';
        context.font = '20px Arial';
        context.fillText(v.label, pos.x, pos.y);
        context.font = '10px Arial';
        context.fillText(pos, pos.x - 10, pos.y + 20);
    }

    function paint() {
        var vs = g.vertices();
        for (var i = 0; i < vs.length; i++) {
            vs[i].pos = layout.pos(vs[i]);
        }

        var es = g.edges();

        for (i = 0; i < es.length; i++) {
            drawEdge(es[i]);
        }

        for (i = 0; i < vs.length; i++) {
            drawVertex(vs[i]);
        }
    }

    paint();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Painter;
} else {
    window.Painter = Painter;
}