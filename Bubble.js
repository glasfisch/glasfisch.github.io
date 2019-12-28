
function Bubble(xTarget, yTarget, xCurr, yCurr, size) {

    this.points = [];
    this.opacity = 0.75;
    this.opacityDecrease = 0.0;
    this.color = new Color(0, 255, 0);
    this.radius = size/2;

    this.points.push(new Point(xCurr, yCurr));
    this.points.push(new Point(xTarget, yTarget));

    //this.pCurr;

    this.draw = function(ctx) {

        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.opacity + ')';

        //var p = this.points[0];
        var p = this.points[0].copy();
        p.x += (Math.random()-0.5)*2;
        p.y += (Math.random()-0.5)*2;
        ctx.arc(p.x, ctx.canvas.height - p.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fill();

        // highlight
        if (true){
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            //ctx.fillStyle = 'rgba(255, 255, 255,' + 0.75*this.opacity + ')';
            ctx.arc(p.x, ctx.canvas.height - p.y , 0.7*this.radius, 1.55 * Math.PI, 1.95 * Math.PI, false);
            ctx.stroke();
        }

        var distVec = this.points[1].sub(this.points[0]);
        this.points[0] = this.points[0].add(distVec.mult(0.05));

    }

    this.checkLife = function(ctx, objectList) {

        this.opacity -= this.opacityDecrease;
        this.opacity = Math.min(1, this.points[0].x / 300);
        
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

