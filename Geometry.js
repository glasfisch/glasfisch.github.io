
function Point(x0, y0) {

    this.x = x0;
    this.y = y0;
    
    this.copy = function() {
        var p = new Point(this.x, this.y);
        return p;    
    }

    this.add = function(p) {
        var p = new Point(this.x + p.x, this.y + p.y);
        return p;    
    }

    this.sub = function(p) {
        var p = new Point(this.x - p.x, this.y - p.y);
        return p;    
    }


    this.mult = function(s) {
        var p = new Point(this.x * s, this.y * s);
        return p;    
    }

    this.normalized = function() {
        var p = new Point(this.x, this.y);
        var m = Math.sqrt(this.x*this.x + this.y*this.y);
        if (m > 0) {p.x /= m; p.y /= m;}
        return p;    
    }


    this.rotate = function(degree) {

        var a = degree * Math.PI / 180; 

        var p = new Point(0,0);
        p.x = this.x*Math.cos(a) + this.y*Math.sin(a);
        p.y = this.x*Math.sin(-a) + this.y*Math.cos(a);
        return p;
    }
}

function Color(r, g, b) {

    this.r = r;
    this.g = g;
    this.b = b;    
}

function ColorHSLA(h, s, l, a) {

    this.h = Math.round(h);
    this.s = Math.round(s);
    this.l = Math.round(l);    
    this.a = a;
    //this.string = 'hsla(120, 100%, 90%, 1.0)';
    var string = 'hsla(' + this.h + ',' + this.s + '%,' + this.l + '%,'+ this.a + ')';
    return string;
}


function move(shape, speed) {    
   
    for (var i = 0; i < shape.points.length; i++) {
        shape.points[i].x += speed.x;
        shape.points[i].y += speed.y;
    }
}


function rotateShape(shape, degree) {

    var a = degree * Math.PI / 180; 

    var cen = new Point(0,0);
    for (var i = 0; i < shape.points.length; i++)
    {
        cen.x += shape.points[i].x;
        cen.y += shape.points[i].y;
    }
    cen.x /= shape.points.length;
    cen.y /= shape.points.length;
    for (var i = 0; i < shape.points.length; i++)
    {
        shape.points[i].x -= cen.x;
        shape.points[i].y -= cen.y;
    }

    var newPoints = [];
    for (var i = 0; i < shape.points.length; i++)
    {
        newPoints.push(new Point(
            shape.points[i].x*Math.cos(a) + shape.points[i].y*Math.sin(a) + cen.x,
            shape.points[i].x*Math.sin(-a) + shape.points[i].y*Math.cos(a) + cen.y
        ));
    } 
    shape.points = newPoints;
}

