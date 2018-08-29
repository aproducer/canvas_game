let scene = function() {
	this.x; //当前场景坐标
	this.w; //场景长度
	this.h; //场景高度
	this.img; //场景IMG对象
	this.src; //场景图像地址
	this.ready; //加载完成
	this.status; //场景序号
	this.farimg;
	this.midimg;
	this.closeimg; //近景
	this.farimgsrc;
	this.midimgsrc;
	this.closeimgsrc; //近景图像地址
	this.ifchange; //是否转场
}
scene.prototype.init = function(status) { //初始化
	this.status = status; //0开始 1介绍 2选角色 3选难度 4第一场战斗
	this.closeimgsrc = "";
	this.midimgsrc = "";
	this.farimgsrc = "";
	this.config(status);
	this.ready = false;
	this.img = new Image();
	this.closeimg = new Image();
	this.midimg = new Image();
	this.farimg = new Image();
	this.img.src = this.src;
	this.closeimg.src = this.closeimgsrc;
	this.midimg.src = this.midimgsrc;
	this.farimg.src = this.farimgsrc;
	this.loadimg();
	this.ifchange = true;
}

scene.prototype.config = function(status) { //设置切图具体数值
	this.x = 0;
	switch(status) {
		case -1:
			this.w = 1280;
			this.h = 720;
			this.src = "img/pause.png";
			break;
		case 0:
			this.w = 1431;
			this.h = 720;
			this.src = "img/scene/indexbk.png";
			this.closeimgsrc = "img/scene/indexlogo.png";
			break;
		case 1:
			this.w = 4590;
			this.h = 393;
			this.src = "img/scene/scene.png";
			this.midimgsrc="img/scene/scenemid.png";
			this.farimgsrc="img/scene/scenefar.png";
			break;
		default:
			break;
	}
}

scene.prototype.loadimg = function() { //载入
	if(this.img.complete && this.closeimg.complete&& this.midimg.complete&& this.farimg.complete) {
		this.ready = true;
	}
}
scene.prototype.update = function(x, statue, direction) {
	if(x >= 850) { //角色位置大于某一值且状态为走路或跑步,场景才可以移动
		if(direction == 1) { //正向
			if(statue == 1 || statue == 5 || statue == 2) {
				if(self.speed == 1) {
					this.front(1);
				} else {
					this.front(2);
				}
			}
		} else if(direction == 0) { //反向
			if(statue == 1 || statue == 5 || statue == 2) {
				if(self.speed == 1) {
					this.back(1);
				} else {
					this.back(2);
				}
			}
		}
	}
	this.ondrew();
}

scene.prototype.front = function(ex) {
	if((this.w - this.x-10) * SCALE > w) {
		this.x += 5 * ex;
	} else if(game.status >= 5 && this.ifchange) { //下一关
	/*	this.ifchange = false;
		this.change();*/
	}
}
scene.prototype.back = function(ex) {
	if(this.x > 10) {
		this.x -= 5 * ex;
	}
}
scene.prototype.ondrew = function() {
	if(this.farimgsrc!=""){
			ctx.drawImage(this.farimg, this.x*436/3310, 0, 1280, 390, 0, 0* SCALE, 1280 * SCALE, 390 * SCALE);
		}
	if(this.midimgsrc!=""){
			ctx.drawImage(this.midimg, this.x*867/3310, 0, 1280, 501, 0, 70* SCALE, 1280 * SCALE, 501 * SCALE);
		}
	ctx.drawImage(this.img, this.x,0, 1280, this.h, 0,  (720-this.h)* SCALE, 1280 * SCALE, this.h * SCALE);
}
scene.prototype.closedrew = function() { //绘制前景
	if(this.status != 0) {
		if(this.closeimgsrc!=""){
			ctx.drawImage(this.closeimg, this.x, 0, 1280, 720, 0, 0, 1280 * SCALE, 720 * SCALE);
		}
	} else {
		ctx.drawImage(this.closeimg,300 * SCALE, 160 * SCALE, 681 * SCALE, 298 * SCALE);

	}
}
scene.prototype.change = function() { //场景切换
	anime.init(1);
	anime.finish = function() {
		game.status++;
		game.init(game.status);
	}
}