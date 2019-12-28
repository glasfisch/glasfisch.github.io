
function BlubberText(ctxText, ctx, text) {

    this.text = text;
    this.opacity = 0.75;
    this.opacityDecrease = 0.0;
    this.color = new Color(0, 255, 0);
    //this.ctx = ctx;
    this.height = 15;
    this.scaleUp = 4;
    this.width = -1;
    this.pixData;
    
    this.blobs = [];
    this.cy = -1;
    this.cx = 0;
    this.textAnchor = new Point(250, ctx.canvas.height- this.height*this.scaleUp-50);
    this.anchor = null;
    this.finished = false;

    this.draw = function(ctx, text) {

        var fontHeight = this.height-3;
        //ctx.font = fontHeight + "px Arial";
        ctx.font = fontHeight + "px Helvetica";
        //ctx.font = fontHeight + "px Comic Sans MS";
        
        ctx.fillStyle = 'red';
        ctx.fillText(text, 2, ctx.canvas.height);
        this.width = Math.ceil(ctx.measureText(text).width);
        //var num = parseFloat(this.width);
    }

    this.draw(ctxText, this.text);

    this.getAllBlobs = function(pix) {

        //for (var i = 0, n = pix.length; i < n; i += 4) {

        for (var x = 0; x < this.width; x++) {
            var xList = [];
            this.blobs.push(xList);
            
            for (var y = 0; y < this.height; y++) {
                var i = (y * this.width + x)*4;
                var r = pix[i  ]; // red
                var g = pix[i+1]; // green
                var b = pix[i+2]; // blue
                var a = pix[i+3]; // alpha

                if (r == 255 && g == 0 && b == 0) 
                    xList.push(new Point(x, this.height-1-y));
            }
        }
        var dummy = 1;
    }

    var im = ctxText.getImageData(0, 1 + ctxText.canvas.height - this.height, this.width, this.height);
    var pix = im.data;

    this.getAllBlobs(pix);
    
    this.getNextBlob = function(fishPos) {
    
        if (this.anchor == null) 
            this.anchor = this.textAnchor.copy();
        else if (this.finished == true) {         
            if (this.anchor.x + (this.width*this.scaleUp) < this.textAnchor.x) {
                this.anchor = fishPos.copy();
                this.anchor.y += 100;
                this.cy = -1; this.cx = 0;
                this.finished = false;
            }
        }

        if (this.finished == true) return null;

        this.cy++;
        while (this.cy >= this.blobs[this.cx].length) {
            this.cy = 0; 
            this.cx++;   
            if (this.cx >= this.blobs.length) {
                this.finished = true; 
                break;
            }
        }  
        if (this.finished == true) return null;
        
        var target = this.blobs[this.cx][this.cy].mult(this.scaleUp);
        target.x += this.anchor.x; 
        target.y += this.anchor.y;

        var bb = new Bubble(target.x, target.y, fishPos.x, fishPos.y, 4);
        bb.opacityDecrease = 0.005;
        bb.color = new Color(255,0, 0);


        return bb;
    }

}

