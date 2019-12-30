var _this = this;


window.onload = function () {
    var el = document.getElementById('content');
    var canv = (document.getElementById('canvas'));
    var canvText = (document.getElementById('canvasText'));

    var blubberTextInput = document.getElementById('blubberText');

    blubberTextInput.addEventListener('change', updateBlubberText);

    _this.flowLoop = new FlowLoop(el, canv, canvText);
    _this.flowLoop.start();
};



function updateBlubberText(e) {
    if (flowLoop) {
        flowLoop.blubberString = e.target.value;
        flowLoop.blubberText = undefined;
        //flowLoop.frameNr = -1;
    }
}




function FlowLoop(element, canv, canvText) {
    this.element = element;
    this.element.innerHTML += "#objects: ";
    this.span = document.createElement('span');
    this.element.appendChild(this.span);
    this.span.innerText = new Date().toUTCString();
    this.frameNr = -1;
    this.ctx = canv.getContext("2d");
    this.ctxText = canvText.getContext("2d");
    this.bgColor = 'cyan';
    this.objectList = [];

    this.moveSpeed = new Point(-9,0);

    this.nextBlubber = 0;
    this.nextMountain = 0;
    this.nextPlant = 0;
    this.nextBlubberText = 0;
    this.branching = 3;
    this.hue = 120;

    this.blubberString = 'Alles Gute für 2020 am Waldhaus, im Pferdehof, auf dem Etzberg und im Wäldchen !';
}

FlowLoop.prototype.start = function () {
    var _this = this;
    this.timerToken = setInterval(function () { return _this.nextFrame(); }, 1000 / 40);
};

FlowLoop.prototype.stop = function () {
    clearTimeout(this.timerToken);
    this.timerToken = 0;
};

FlowLoop.prototype.nextFrame = function () {
    this.frameNr++;
    if (this.objectList != null)
        this.span.innerHTML = this.objectList.length.toString();
        
    // generate fish:
    if (this.frameNr == 0) {
        this.fish = new Fish(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2, 15);
        this.fish.speed = new Point(-this.moveSpeed.x, -this.moveSpeed.y+2);
        this.objectList.push(this.fish);
    }
    if (this.blubberText == undefined) {
        //this.ctxText.canvas.fil
        this.blubberText = new BlubberText(this.ctxText, this.ctx, this.blubberString);
        this.nextBlubberText = 0;
    }

    //this.blubberString = document.getElementById('blubberText').textContent;
    //this.blubberText = new BlubberText(this.ctxText, this.ctx, this.blubberString);
 

    // generate mountains:
    this.nextMountain--;
    if (this.nextMountain < 0) {
        this.nextMountain = Math.random()*16;
        var size = 20 + Math.random() * 120;
        
        var bb = new Leaf(this.ctx.canvas.width + 2*size, 0, size);

        if (this.frameNr % 1000 == 0) this.hue = (this.hue + 30)%360;
        var sat = 10 + Math.round(Math.random() * 90);
        var lum = 10 + Math.round(Math.random() * 60);
        var alpha = 0.2 + Math.round(Math.random() * 0.8);
        bb.hue = ColorHSLA(this.hue, sat, lum, alpha);
        
        //bb.color = new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
        //bb.color = new Color(Math.random(255), Math.random(255), Math.random(255));
        if (Math.random() > 0.5) bb.color.r = 255;
        if (Math.random() > 0.5) bb.color.g = 55;
        if (Math.random() > 0.5) bb.color.b = 255;
        //bb.color.r = Math.random();

        this.objectList.push(bb);
    }

    // generate blubber:
    this.nextBlubber--;
    if (this.nextBlubber < 0) {
        this.nextBlubber = 30 + Math.random()*30;
        var size = 10 + Math.random() * 15;
        
        var bb = new Blubber(this.ctx.canvas.width + 2*size, 0, size);
        
        //bb.color = new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
        //bb.color = new Color(Math.random(255), Math.random(255), Math.random(255));
        if (Math.random() > 0.5) bb.color.r = 255;
        if (Math.random() > 0.5) bb.color.g = 55;
        if (Math.random() > 0.5) bb.color.b = 255;
        //bb.color.r = Math.random();

        this.objectList.push(bb);
    }
    
    this.nextBlubberText--;
    if (this.nextBlubberText < 0) {
        this.nextBlubberText = 0;

        for (var i = 0; i < 20; i++) {
            var origin = this.fish.points[0].add(this.fish.dir.mult(this.fish.size*3));
            var bubble = this.blubberText.getNextBlob(origin);
            if (bubble != null) this.objectList.push(bubble);
        }
    }


    //this.nextPlant--;
    if (this.nextPlant < 0) {
        this.nextPlant = 2 + Math.random()*6;
        //var size = 20 + Math.random() * 120;
        var size = 24 * this.nextPlant;
        
        var bb = new Branch(this.ctx.canvas.width + size / 2, 0, size);
        bb.level = this.branching;
        //bb.color = new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
        //bb.color = new Color(Math.random(255), Math.random(255), Math.random(255));
        //bb.color.r = Math.random();

        this.objectList.push(bb);
    }

    
    // clear canvas:
    this.ctx.fillStyle = this.bgColor;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    //this.currFramePos = this.currFramePos.sub(this.moveSpeed);
    this.blubberText.anchor = this.blubberText.anchor.add(this.moveSpeed);
    var newList;
    newList = [];
    for (var i = 0; i < this.objectList.length; i++) {
        move(this.objectList[i], this.moveSpeed);
        this.objectList[i].checkLife(this.ctx, newList);
        this.objectList[i].draw(this.ctx);
    }
    this.objectList = newList;    

};

FlowLoop.prototype.keyAction = function (e) {
    if (e.keyCode == 39) {
        //this.bgColor = 'cyan';
        this.fish.speed = this.fish.speed.mult(1.1);
    }
    else if (e.keyCode == 37) {
        //this.bgColor = 'white';
         this.fish.speed = this.fish.speed.mult(1.0/1.1);
    }
    else if (e.keyCode == 38) {
        //this.bgColor = 'pink';
        this.fish.speed = this.fish.speed.rotate(-10);
        this.fish.dir = this.fish.speed.normalized();
        this.fish.makePoints();
    }
    else if (e.keyCode == 40) {
        //this.bgColor = 'red';
        this.fish.speed = this.fish.speed.rotate(10);
        this.fish.dir = this.fish.speed.normalized();
        this.fish.makePoints();
    }
    else if (e.keyCode == 88) { // x
        this.branching++;
    }
    else if (e.keyCode == 89) { // y
        if (this.branching > 0) this.branching--;      
    }
    else if (e.keyCode == 83 || e.keyCode == 32) { // s or spacebar
        if (this.timerToken == 0) _this.flowLoop.start();
        else _this.flowLoop.stop();
    }
};




window.onkeydown = function (e) {
    _this.flowLoop.keyAction(e);
};
