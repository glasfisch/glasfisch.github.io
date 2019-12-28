
function Leaf(x0, y0, size) {

    this.speed = new Point(0,0);
    this.points = [];
    this.opacity = 0.5;
    this.opacityDecrease = 0.0;
    this.color = new Color(100, 100, 0);
    this.hue = 'green';
    this.dir = new Point(0,1).normalized();

    this.size = size;

    var p = new Point(x0, y0);
    this.points.push(p);
    p.y -= 30;

    var range = 20 + Math.random()*70; 
    for (var a = -range; a <= range; a+= 2) {
        var aa = a*Math.PI/180;
        var v = new Point(Math.sin(aa), Math.cos(aa));
        var ll = (1+Math.random())*this.size;
        var p1 = p.add(v.mult(ll));
        this.points.push(p1);
    }

    this.draw = function(ctx) {

        //var a = 5*(Math.random()-0.5);

    for (var i = 1; i < this.points.length; i++) {
        this.points[i].x += (Math.random()-0.5)*5;
        this.points[i].y += (Math.random()-0.5)*5;
    }


        ctx.beginPath();
        //ctx.fillStyle = 'rgba(55,250,0,' + this.opacity + ')';
        //ctx.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.opacity + ')';
        ctx.fillStyle = this.hue;

        var p = this.points[0];
        ctx.moveTo(p.x, ctx.canvas.height - p.y);
        for (var i = 1; i < this.points.length; i++) {
            p = this.points[i];
            ctx.lineTo(p.x, ctx.canvas.height - p.y);
        }

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
        if (inside > 0)
            objectList.push(this);
    }

}

