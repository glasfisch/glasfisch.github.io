
function Fish(x0, y0, size) {

    this.speed = new Point(0,0);
    this.points = [];
    this.opacity = 1.0;
    this.opacityDecrease = 0.0;
    this.size = size;
    this.nextBlob = 0;
    this.dir = new Point(1,0).normalized();
    this.orient = 1;
    this.p0 = new Point(x0, y0);

    this.transPoint = function(x, y) {
        var p = this.p0.add(this.dir.mult(x*this.size));
        //var perp = new Point(dir.y, -dir.x);
        p.x += this.dir.y*y*this.size*this.orient;
        p.y -= this.dir.x*y*this.size*this.orient;
        return p;
    }

    this.makePoints = function() {
        
        this.p0 = this.points[0];
        var points = [];
        points.push(this.transPoint(0.5, 0));
        
        points.push(this.transPoint(0, 0.95));      
        points.push(this.transPoint(1.0, 0.75));
        points.push(this.transPoint(0.2, 2.5));
        points.push(this.transPoint(1.4, 1.2));
        points.push(this.transPoint(1.5, 0.75));
        points.push(this.transPoint(2.0, 0.75));

        points.push(this.transPoint(3.0, 0)); // Spitze
        
        points.push(this.transPoint(2.0, -0.75));
        points.push(this.transPoint(1.5, -0.75));
        points.push(this.transPoint(1.4, -1.2));
        points.push(this.transPoint(0.0, -2.5));
        points.push(this.transPoint(1.0, -0.75));
        points.push(this.transPoint(-0.2, -0.75));
         
        this.points = points;
   }

    this.points.push(this.p0);
    this.makePoints();


    this.draw = function(ctx) {

        // contour:
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,50,0,' + this.opacity.toString() + ')';

        var p = this.points[0];

        ctx.moveTo(p.x, ctx.canvas.height - p.y);
        for (var i = 1; i < this.points.length; i++) {
            p = this.points[i];
            //ctx.lineTo(p.x, ctx.canvas.height - p.y);
            var pp = p.add(new Point(Math.random()-0.5, Math.random()-0.5).mult(4));
            //if (i==1 || i==5) pp = pp.add(this.dir.mult(-6*Math.random()));
            //if (i==3) pp = pp.add(this.dir.mult(8*Math.random()));
            ctx.lineTo(pp.x, ctx.canvas.height - pp.y);
        }
        ctx.fill();

        // eye:
        ctx.beginPath();
        //ctx.fillStyle = 'white';
        //ctx.fillStyle = 'hsla(0, 0%, 100%, 0.9)'; // white
        //ctx.fillStyle = 'hsla(180, 100%, 50%, 1.0)'; // cyan
        ctx.fillStyle = 'hsla(120, 100%, 90%, 1.0)'; // green

        var perp = new Point(this.dir.y*this.orient, -this.dir.x*this.orient);
        p = this.points[0].add(this.dir.mult(1.4*this.size)).add(perp.mult(-0.2*this.size));
        p = p.add(new Point(Math.random()-0.5, Math.random()-0.5).mult(4));
        ctx.arc(p.x, ctx.canvas.height - p.y, 0.33*this.size, 0, 2 * Math.PI, false);
        ctx.fill();

    }

    this.checkLife = function(ctx, objectList) {

        move(this, this.speed);

        this.opacity -= this.opacityDecrease;
        if (this.opacity < 0)
            return;

        var ymin = ctx.canvas.height;
        for (var i = 0; i < this.points.length; i++) ymin = Math.min(ymin, this.points[i].y);
        var ymax = 0;
        for (var i = 0; i < this.points.length; i++) ymax = Math.max(ymax, this.points[i].y);
        
        if (ymax > ctx.canvas.height && this.speed.y >= 0) {
            this.speed.y *= -1;  
            this.dir = this.speed.normalized();
            this.makePoints();     
        }

         if (ymin < 0 && this.speed.y <= 0) {
            this.speed.y *= -1;         
            this.dir = this.speed.normalized();
            this.makePoints();     
        }

        //var inside = this.points.length;
        //for (var i = 0; i < this.points.length; i++)
        //    if (this.points[i].x < -2 * this.size || this.points[i].x > ctx.canvas.width + 2 * this.size)
        //        inside--;
        //if (inside > 0) objectList.push(this);
        
        objectList.push(this);

        //this.nextBlob--;
        if (this.nextBlob < 0) {
            this.nextBlob = Math.random() * 5;

            var bb = new Circle(this.points[0].x, this.points[0].y, 20);
            bb.speed = new Point(-this.speed.x, -this.speed.y);
            var angle = (Math.random() - 0.5) * 60;
            bb.speed = bb.speed.rotate(angle);
            bb.opacityDecrease = 0.05;
            bb.color = new Color(255,0,0);
            objectList.push(bb);
        }
    }


}

