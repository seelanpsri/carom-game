var canvas = $('#effects')[0];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// For rain effect another canvas in being used

// One the context oc canvas is available, start creating the rain effect
if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    ctx.strokeStyle = 'rgba(174,194,224,0.5)';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';

    // set up area to create the rain
    var init = [];
    var maxParts = 1000;
    for (var a = 0; a < maxParts; a++) {
        init.push({
            x: Math.random() * w,
            y: Math.random() * h,
            l: Math.random() * 1,
            xs: -4 + Math.random() * 4 + 2,
            ys: Math.random() * 5 + 5
        })
    }

    // create and store reference to particles
    var particles = [];
    for (var b = 0; b < maxParts; b++) {
        particles[b] = init[b];
    }

    // draw the rain on canvas on every frame
    function drawRain() {
        ctx.clearRect(0, 0, w, h);
        for (var c = 0; c < particles.length; c++) {
            var p = particles[c];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
            ctx.stroke();
        }
        move();
    }

    // move the particles
    function move() {
        for (var b = 0; b < particles.length; b++) {
            var p = particles[b];
            p.x += p.xs;
            p.y += p.ys;
            if (p.x > w || p.y > h) {
                p.x = Math.random() * w;
                p.y = -5;
            }
        }
    }

    setInterval(drawRain, 30);

}