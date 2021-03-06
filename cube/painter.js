(function(){
    function Painter(canvasId, g, layout) {
        function clear() {
            context.fillStyle = 'black';
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        function drawAxes() {
            context.fillStyle = 'white';
            context.strokeStyle = 'white';
            context.moveTo(0, 0);
            context.lineTo(context.canvas.width, 0);
            context.moveTo(context.canvas.width - 10, -5);
            context.lineTo(context.canvas.width, 0);
            context.moveTo(context.canvas.width - 10, 5);
            context.lineTo(context.canvas.width, 0);
            context.stroke();

            context.moveTo(0, 0);
            context.lineTo(0, context.canvas.height);
            context.moveTo(-5, context.canvas.height - 10);
            context.lineTo(0, context.canvas.height);
            context.moveTo(5, context.canvas.height - 10);
            context.lineTo(0, context.canvas.height);
            context.stroke();
        }

        var canvas = document.getElementById(canvasId);
        layout.shift(canvas.width / 2, canvas.height / 2);
        var context = canvas.getContext('2d');

        clear();
        drawAxes();

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
                r = 10;
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
            context.font = '8px Arial';
            context.fillText(v.label, pos.x, pos.y);
            //context.font = '5px Arial';
            //context.fillText(pos, pos.x - 10, pos.y + 20);
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
        this.Painter = Painter;
    }
})();