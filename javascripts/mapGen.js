class mapGen {
    constructor() {
        this.blocks = [[]];

        this.time = 0;

        this.h = 128;
        this.w = 128;

        this.hoff = 0;
        this.woff = 0;

        this.my = ~~(this.h / 2);
        this.mx = ~~(this.w / 2);

        for (var i = 0; i < this.h + 1; i++) {
            this.blocks[i] = [];
            for (var e = 0; e < this.w + 1; e++) {
                this.blocks[i][e] = -5;
            }
        }

        this.blocks[this.my][this.mx] = (this.h + this.w) / 4;

        this.subdivide(this.mx, this.my, this.w, this.h);

        this.subdivide(0, this.my, this.mx, this.h);
        this.subdivide(this.mx, 0, this.w, this.my);

        this.subdivide(0, 0, this.mx, this.my);
    }

    subdivide(x1, y1, x2, y2) {
        if (x1 + 1 == x2 || y1 + 1 == y2) {
          return;
        }

        var tl = this.blocks[y1][x1];
        var tr = this.blocks[y1][x2];
        var br = this.blocks[y2][x2];
        var bl = this.blocks[y2][x1];

        var tHeight = this.random(x1 - x2) + (tl + tr) / 2;
        var lHeight = this.random(x1 - x2) + (tl + bl) / 2;

        var mHeight = this.random(x1 - x2) + (tl + tr + bl + br) / 4;

        this.blocks[y1][(x1 + x2) / 2] = tHeight;
        this.blocks[(y1 + y2) / 2][x1] = lHeight;

        this.blocks[(y1 + y2) / 2][(x1 + x2) / 2] = mHeight;

        this.subdivide((x1 + x2) / 2, (y1 + y2) / 2, x2, y2);

        this.subdivide((x1 + x2) / 2, y1, x2, (y1 + y2) / 2);
        this.subdivide(x1, (y1 + y2) / 2, (x1 + x2) / 2, y2);

        this.subdivide(x1, y1, (x1 + x2) / 2, (y1 + y2) / 2);
    }

    random(mag) {
        return (Math.random() - .75) * Math.abs(mag);
    }


    RGB2HTML(red, green, blue) {
        var decColor =0x1000000+ blue + 0x100 * green + 0x10000 *red ;
        return '#'+decColor.toString(16).substr(1);
    }

    render(x, y) {
        var h = this.blocks[y][x];

        if (h > 0) {
            var r = ~~Math.max(255 - (255 * h/64) * (this.time / 5), 0);
            var g = ~~Math.max(255 - (255 * h/64) * (this.time / 5), 0);
            var b = ~~Math.max(255 - (255 * h/64) * (this.time / 5), 0);
        } else {
            var r = 255;
            var g = 255;
            var b = 255;
        }
        var color = this.RGB2HTML(r,g,b);

        ctx.fillStyle = color;
        ctx.fillRect((x * 4) - 6, (y * 4) - 6, 4, 4);
    }

    tick(persist) {
        if (!persist) {
           this.time = this.time - 1;
        } else if (this.time < 5) {
           this.time = this.time + 1;
        }

        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        for (var i = 0; i < this.h; i++) {
            for (var e = 0; e < this.w; e++) {
                this.render(e, i);
            }
        }
        return this.time > 0;
    }
}
