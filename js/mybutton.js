let mybutton = function() {
	this.x;
	this.y; //绘制位置
	this.width;
	this.height; //绘制大小
	this.img;
	this.src;
	this.ready;
	this.status = 0;
}
mybutton.prototype.init = function(x, y, width, height, src) {
	this.x = x;
	this.y = y; //绘制位置
	this.width = width;
	this.height = height; //绘制大小
	this.src = src;
	this.ready = false;
	this.img = new Image();
	this.img.src = this.src;
	this.loadimg();
}

mybutton.prototype.loadimg = function() { //载入
	if(this.img.complete) {
		this.ready = true;
	}
}

mybutton.prototype.update = function() {
	this.checkIn();
	this.ondrew();
}

mybutton.prototype.ondrew = function() {

	ctx.drawImage(this.img, this.width * this.status, 0, this.width, this.height, this.x * SCALE, this.y * SCALE, this.width * SCALE, this.height * SCALE);
}
mybutton.prototype.checkIn = function() {
	if(mouse.clickX >= this.x * SCALE && mouse.clickX <= (this.x + this.width) * SCALE && mouse.clickY >= this.y * SCALE && mouse.clickY <= (this.y + this.height) * SCALE) {
		this.active();
		mouse.clickX = -1; //点击后复原
		mouse.clickY = -1;
	}
}
mybutton.prototype.active = function() {
	//点击执行
}