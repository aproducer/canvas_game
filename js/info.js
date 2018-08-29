let info = function() {
	this.id;
	this.min;
	this.sec;
	this.src;
	this.timenum;
	this.ready;
	this.fps;
	this.currentnum;
	this.status = 0;
	this.hit = 0;
	this.type = 0;
	this.infoimg = new Image();
	this.enemyinfoimg = new Image();
	this.hpimg = new Image();
	this.headimg = new Image();
	this.timeimg = new Image();
	this.numimg = new Image();
	this.numbkimg = new Image();
	this.enemyinfoimg.src = "img/info/enemyinfo.png";
	this.headimg.src = "img/info/head.png";
	this.infoimg.src = "img/info/info.png";
	this.hpimg.src = "img/info/hp.png";
	this.timeimg.src = "img/info/time.png";
	this.numimg.src = "img/info/num.png";
	this.numbkimg.src = "img/info/hit.png";
	this.loadimg();
}
info.prototype.init = function(id, hp) {
	this.id = id;
	this.hp = hp;
	this.min = 0;
	this.sec = 0;
	this.timenum = 0;
	this.currentnum = 0;
	this.fps = 0;
	this.loadimg();

}
info.prototype.update = function() {
	this.fps++;
	if(this.fps >= 10) {
		this.currentnum = (this.currentnum + 1) % 8; //循环播放
		this.fps = 0;
	}
	this.change();
	this.ondrew();
	if(game.ifover==0){
		this.time();
	}
	
}
info.prototype.ondrew = function() {
	if(this.ready) {
		if(self.attack.target!=-1&&enemys[self.attack.target].life>0) {
			ctx.drawImage(this.enemyinfoimg, 940 * SCALE * 0.9, 25 * SCALE * 0.9, 428 * SCALE * 0.9, 75 * SCALE * 0.9);
			ctx.save();
			ctx.translate(w, 0);
			ctx.scale(-1, 1);
			ctx.drawImage(this.hpimg, 0, 0, (enemys[self.attack.target].life / 3000) * 333, 13, 75 * SCALE * 0.9, 68 * SCALE * 0.9, (enemys[self.attack.target].life / 3000) * 333 * SCALE * 0.9, 13 * SCALE * 0.9);
			ctx.restore();
		}
		ctx.drawImage(this.infoimg, 0 * SCALE * 0.9, 5 * SCALE * 0.9, 482 * SCALE * 0.9, 139 * SCALE * 0.9);
		ctx.drawImage(this.hpimg, 0, 0, (self.life / self.maxlife) * 333, 13, 119 * SCALE * 0.9, 68 * SCALE * 0.9, (self.life / self.maxlife) * 333 * SCALE * 0.9, 13 * SCALE * 0.9);
		ctx.drawImage(this.headimg, 102 * this.currentnum, 0, 102, 102, 11 * SCALE * 0.9, 13 * SCALE * 0.9, 102 * SCALE * 0.9, 102 * SCALE * 0.9);
		ctx.drawImage(this.timeimg, 574 * SCALE, 45 * SCALE, 132 * SCALE, 35 * SCALE);
		ctx.fillStyle = "#fff";
		ctx.font = (30 * SCALE) + "px fzs";
		ctx.fillText(this.min + ":" + ("0" + this.sec).substr(-2), 616 * SCALE, 71 * SCALE);
		if(self.hit >= 3) {
			this.drewnum();
		}

	}
}
info.prototype.loadimg = function() { //载入
	if(this.infoimg.complete && this.hpimg.complete && this.headimg.complete && this.timeimg.complete && this.numimg.complete && this.numbkimg.complete) {
		this.ready = true;
	}
}
info.prototype.time = function() {
	this.timenum++;
	if(this.timenum == 60) {
		this.timenum = 0;
		this.sec++;
	}
	if(this.sec == 60) {
		this.min++;
		this.sec = 0;
	}
}
info.prototype.drewnum = function() {
	ctx.drawImage(this.numbkimg, 29 * SCALE, 202 * SCALE, 346 * SCALE, 151 * SCALE);
	if(self.hit >= 10) {
		ctx.drawImage(this.numimg, Math.floor(this.hit / 10) * 79, this.type * 158, 79, 158, 104 * SCALE + -10 * SCALE, 200 * SCALE, 79 * SCALE, 188 * SCALE);
	}
	ctx.drawImage(this.numimg, Math.floor(this.hit % 10) * 79, this.type * 158, 79, 158, 104 * SCALE + 40 * SCALE, 200 * SCALE, 79 * SCALE, 188 * SCALE);

}
info.prototype.change = function() { //变换动画
	if(this.hit != self.hit || this.type != 0) {
		switch(this.status) {
			case 0:
				this.type = 1
				break;
			case 1:
				this.hit = self.hit;
				break;
			case 2:
				this.type = 0;
				break;
			default:
				break;
		}
		this.status++;
	} else {
		this.status = 0;
	}
}