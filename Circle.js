
function Circle(x0, y0, size) {

    this.speed = new Point(0,0);
    this.points = [];
    this.opacity = 0.75;
    this.opacityDecrease = 0.0;
    this.color = new Color(0, 255, 0);

    this.points.push(new Point(x0, y0));
    this.radius = size/2;


    this.draw = function(ctx) {
        ctx.beginPath();
        //ctx.fillStyle = 'rgba(55,250,0,' + this.opacity + ')';
        ctx.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.opacity + ')';
        //ctx.fillStyle = 'hsla(100, 50%, 50%, 0.75)';

        var p = this.points[0];
        ctx.arc(p.x, ctx.canvas.height - p.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fill();

        // highlight
        if (false) {
        ctx.beginPath();
        //ctx.fillStyle = 'white';
        ctx.fillStyle = 'rgba(255, 255, 255,' + 0.75*this.opacity + ')';
        ctx.arc(p.x + this.radius/3, ctx.canvas.height - p.y - this.radius/3, this.radius/3, 0, 2 * Math.PI, false);
        ctx.fill();
        }
        if (true){
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        //ctx.fillStyle = 'rgba(255, 255, 255,' + 0.75*this.opacity + ')';
        ctx.arc(p.x, ctx.canvas.height - p.y , 0.7*this.radius, 1.55 * Math.PI, 1.95 * Math.PI, false);
        ctx.stroke();
        }
    }

    this.checkLife = function(ctx, objectList) {

        move(this, this.speed);

        this.opacity -= this.opacityDecrease;
        if (this.opacity < 0)
            return;

        var inside = this.points.length;
        for (var i = 0; i < this.points.length; i++)
            if (this.points[i].x < -2 * this.radius || this.points[i].x > ctx.canvas.width + 2 * this.radius)
                inside--;
        if (inside > 0)
            objectList.push(this);
    }

}

