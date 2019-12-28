
function Branch(x0, y0, size) {

    this.speed = new Point(0,0);
    this.points = [];
    this.opacity = 0.75;
    this.opacityDecrease = 0.0;
    this.color = new Color(100, 100, 0);
    this.dir = new Point(0,1).normalized();
    this.level = 3;

    this.size = size;
    this.height = size;
    this.width = size/12;

    this.points.push(new Point(x0, y0));

    //var a = 15*(Math.random()-0.5);
    //this.dir = this.dir.rotate(a);


    this.makePoints = function(p) {
        var points = [];

        var perp = new Point(-this.dir.y, this.dir.x);
        var p1 = p.add(perp.mult(-0.5*this.width));
        points.push(p1);
        var p2 = p1.add(this.dir.mult(this.height));
        points.push(p2);
        var p3 = p2.add(perp.mult(this.width));
        points.push(p3);
        var p4 = p3.add(this.dir.mult(-this.height));
        points.push(p4);
        return points;
    }



    this.draw = function(ctx) {

        var a = 5*(Math.random()-0.5);
        this.dir = this.dir.rotate(a);  

        var drawPoints = this.makePoints(this.points[0]);

        ctx.beginPath();
        //ctx.fillStyle = 'rgba(55,250,0,' + this.opacity + ')';
        ctx.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.opacity + ')';

        var p = drawPoints[0];
        ctx.moveTo(p.x, ctx.canvas.height - p.y);
        for (var i = 1; i < drawPoints.length; i++) {
            p = drawPoints[i];
            ctx.lineTo(p.x, ctx.canvas.height - p.y);
        }

        ctx.fill();

        if (this.level > 0) {
            var p0 = this.points[0];

            var c1 = new Branch(p0.x + 0.25*this.height * this.dir.x,
                                p0.y + 0.25*this.height * this.dir.y,
                                0.8*this.size);
            c1.level = this.level - 1;
            //var a = 20 + 15*(Math.random()-0.5)
            //c1.dir = this.dir.rotate(a);
            c1.dir = this.dir.rotate(25);

            c1.draw(ctx);

            // ---            
            var c2 = new Branch(p0.x + 0.5*this.height * this.dir.x,
                                p0.y + 0.5*this.height * this.dir.y,
                                0.6*this.size);
            c2.level = this.level - 1;
            c2.dir = this.dir.rotate(-35);

            c2.draw(ctx);
        }
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
        if (inside > 0)
            objectList.push(this);
    }

}

