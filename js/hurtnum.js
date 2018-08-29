let hurtnum = function(eid, hurt) {
	this.img = new Image();
	this.img.src = "img/num.png";
	/*	this.loadimg();*/
	this.status = 0;
	/*	this.ready = false;*/
	this.display = false;
	this.eid = eid; //对应敌人id
	this.fps = 0; //显示时长
	this.sdx = Math.floor(Math.random() * 120);
	this.sdy = Math.floor(Math.random() * 60);
	this.single = hurt % 10;
	this.ten = Math.floor(hurt % 100 / 10);
	this.hundred = Math.floor(hurt / 100);
}
/*hurtnum.prototype.loadimg = function() { //载入
	if(this.img.complete) {
		this.ready = true;
	}
}*/
hurtnum.prototype.update = function() { //载入
	this.fps++;
	if(this.status == 0) {
		if(this.fps >= 40) {
			this.status++;
			this.fps = 0;
		}
	} else {
		if(this.fps >= 4) {
			this.status++;
			this.fps = 0;
		}
	}
	this.ondrew();
}

hurtnum.prototype.ondrew = function() {
	/*	if(this.ready) {*/
	if(this.eid != -1) {
		ctx.drawImage(this.img, this.hundred * 70, this.status * 86, 70, 86, (enemys[this.eid].cx - mainscene.x + this.sdx) * SCALE + 20 * SCALE, (enemys[this.eid].y + this.sdy) * SCALE - 105 * SCALE, 70 * SCALE * 0.9, 86 * SCALE * 0.9);
		ctx.drawImage(this.img, this.ten * 70, this.status * 86, 70, 86, (enemys[this.eid].cx - mainscene.x + this.sdx) * SCALE + 60 * SCALE, (enemys[this.eid].y + this.sdy) * SCALE - 105 * SCALE, 70 * SCALE * 0.9, 86 * SCALE * 0.9);
		ctx.drawImage(this.img, this.single * 70, this.status * 86, 70, 86, (enemys[this.eid].cx - mainscene.x + this.sdx) * SCALE + 100 * SCALE, (enemys[this.eid].y + this.sdy) * SCALE - 105 * SCALE, 70 * SCALE * 0.9, 86 * SCALE * 0.9);
	}else{
		ctx.drawImage(this.img, this.hundred * 70, this.status * 86, 70, 86, (self.cx - mainscene.x + this.sdx) * SCALE + 20 * SCALE, (self.y + this.sdy) * SCALE - 105 * SCALE, 70 * SCALE * 0.9, 86 * SCALE * 0.9);
		ctx.drawImage(this.img, this.ten * 70, this.status * 86, 70, 86, (self.cx - mainscene.x + this.sdx) * SCALE + 60 * SCALE, (self.y + this.sdy) * SCALE - 105 * SCALE, 70 * SCALE * 0.9, 86 * SCALE * 0.9);
		ctx.drawImage(this.img, this.single * 70, this.status * 86, 70, 86, (self.cx - mainscene.x + this.sdx) * SCALE + 100 * SCALE, (self.y + this.sdy) * SCALE - 105 * SCALE, 70 * SCALE * 0.9, 86 * SCALE * 0.9);

	}
	/*	} else {
			this.loadimg();
		}*/
}