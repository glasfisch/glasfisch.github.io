
function Blubber(x0, y0, size) {

    this.speed = new Point(0,0);
    this.points = [];
    this.opacity = 0.5;
    this.opacityDecrease = 0.0;
    this.color = new Color(100, 100, 0);
    this.dir = new Point(0,1).normalized();
    this.nextBlob = 0;

    this.size = size;

    var p = new Point(x0, y0);
    this.points.push(p);


    this.draw = function(ctx) {

        ctx.beginPath();
        //ctx.fillStyle = 'rgba(55,250,0,' + this.opacity + ')';
        ctx.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.opacity + ')';

        var p = this.points[0];
        ctx.moveTo(p.x, ctx.canvas.height - p.y);
        ctx.arc(p.x, ctx.canvas.height - p.y, this.size, 0, 2 * Math.PI, false);

        ctx.fill();
    }

    this.checkLife = function(ctx, objectList) {

        move(this, this.speed);

        this.opacity -= this.opacityDecrease;
        if (this.opacity < 0)
            return;

        var inside = this.points.length;
        for (var i = 0; i < this.points.length; i++)
            if (this.points[i].x < -2 * this.size || this.points[i].x > ctx.canvas.width + 2 * this.size)
                inside--;
        if (inside <= 0) return;
            
        objectList.push(this);

        // generate bubbles:
        this.nextBlob--;
        if (this.nextBlob <= 0) {
            this.nextBlob = Math.random() * 5;

            var bb = new Circle(this.points[0].x, this.points[0].y, this.size);
            bb.speed = new Point(0, 9);
            var angle = (Math.random() - 0.5) * 30;
            bb.speed = bb.speed.rotate(angle);
            bb.opacityDecrease = 0.01;
            bb.color = this.color;
            objectList.push(bb);
        }
    }

}

