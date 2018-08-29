let character = function() {
	this.x;
	this.y; //绘制坐标
	this.cx; //场景坐标
	this.dx;
	this.dy; //活动范围
	this.direction; //方向 1为正，0为负
	this.life; //生命
	this.maxlife=10000;
	this.speed; //速度
	this.status; //状态
	this.img; //IMG对象
	this.shadowimg; //阴影IMG对象
	this.shadownum;
	this.shadowfps;
	this.src; //图像地址
	this.currentnum; //当前帧
	this.srcnum; //总帧数
	this.fps; //刷新频率
	this.fpsnum //频率阈值
	this.ready; //是否加载完成
	this.sx; //切图的宽
	this.sy; //切图的高
	this.sh; //开始切图的高度
	this.sdx;
	this.sdy; //贴图偏移量
	this.data; //侦听属性是否变化
	this.hit; //连击数
	this.hittime; //连击有效时间
	this.hurt; //收到伤害
	this.attack = {
		minhurt: 200, //最低伤害
		hurt: 300, //伤害阈值
		attackrange: 0, //伤害范围
		target: -1 //目标敌人
	}
}
character.prototype.init = function() {
	this.hit = 0;
	this.hittime = 0;
	this.attack.target=-1;
	this.y = 300;
	this.cx = 70;
	this.shadownum = 0;
	this.shadowfps = 0;
	this.speed = 1;
	this.dx = 900;
	this.life = this.maxlife;
	this.src = "img/self.png";
	this.direction = 1;
	this.fps = 0;
	this.status = 0;
	this.data = 0;
	this.config(0);
	this._ready = false;
	this.img = new Image();
	this.shadowimg = new Image();
	this.img.src = this.src;
	this.shadowimg.src = "img/shadow.png";
	this.loadimg();
}

character.prototype.config = function(status) { //设置切图具体数值
	this.currentnum = 0;
	switch(status) {
		case 0:
			this.srcnum = 12;
			this.sx = 220;
			this.sy = 280;
			this.sh = 0;
			this.fpsnum = 3;
			this.sdx = 0;
			this.sdy = 0;
			break;
		case 1:
			this.srcnum = 12;
			this.sx = 220;
			this.sy = 280;
			this.sh = 280;
			this.fpsnum = 3;
			this.sdx = 40;
			this.sdy = 0;
			break;
		case 2:
			this.srcnum = 12;
			this.sx = 285;
			this.sy = 235;
			this.sh = 560;
			this.fpsnum = 3;
			this.sdx = 40;
			this.sdy = 45;
			break;
		case 3:
			this.srcnum = 6;
			this.sx = 275;
			this.sy = 305;
			this.sh = 795;
			this.fpsnum = 4;
			this.sdx = 40;
			this.sdy = -25;
			break;
		case 4:
			this.srcnum = 4;
			this.sx = 231;
			this.sy = 259;
			this.sh = 1100;
			this.fpsnum = 6;
			this.sdx = 40;
			this.sdy = 21;
			break;
		case 5:
			this.srcnum = 12;
			this.sx = 198;
			this.sy = 338;
			this.sh = 1359;
			this.fpsnum = 4;
			this.sdx = 40;
			this.sdy = -58;
			break;
		case 6:
			this.srcnum = 12;
			this.sx = 377;
			this.sy = 512;
			this.sh = 1697;
			this.fpsnum = 4;
			this.sdx = -25;
			this.sdy = -192;
			break;
		default:
			break;
	}
}
character.prototype.update = function(sx) { //场景坐标
	this.x = this.cx - sx;
	this.fps++;
	this.hittime++;
	if(this.hittime >= 60) { //超过时间没有连击连击数清零
		this.hit = 0;
	}
	if(this.life <= 0) {
		this.status = 6;
	}
	this.check(); //探测状态是否改变
	if(this.status == 1) {
		this.speed = 1;
	} else if(this.status == 2) {
		this.speed = 3;
	} else if(this.status == 3) {
		this.judge();
		if(this.currentnum == this.srcnum - 1) {
			this.speed = 1;
			this.status = 0;
		}
	} else if(this.status == 4) {
		if(this.direction == 0 && this.x >= 10 && this.x < 1000) {
			this.cx += 6;
		} else if(this.direction == 1 && this.x >= 10 && this.x < 1000) {
			this.cx -= 6;
		}
		if(this.currentnum == this.srcnum - 1) {
			this.speed = 1;
			this.status = 0;
		}
	} else if(this.status == 5) { //跳跃
		this.sdy = -6 * (36 - (this.currentnum - 6) * (this.currentnum - 6)) - 58;
		if(this.currentnum == this.srcnum - 1) {
			this.speed = 1;
			this.status = 0;
		}
	} else if(this.status == 6) { //死亡
		if(this.currentnum == this.srcnum - 1) {
			
		} else {
			if(this.direction == 0 && this.x >= 10 && this.x < 1000) {
				this.cx += 8;
			} else if(this.direction == 1 && this.x >= 10 && this.x < 1000) {
				this.cx -= 8;
			}
		}
	}
	if(this.status != 6 || this.currentnum != this.srcnum - 1) { //死亡后停止更新动画
		if(this.fps >= this.fpsnum) { //每刷新n次更新一次角色动画
			this.currentnum = (this.currentnum + 1) % this.srcnum; //循环播放
			this.fps = 0;
		}
	}
	this.ondrew();

}
character.prototype.ondrew = function() {
	if(this.direction) {
		this.shadow(); //绘制阴影
		ctx.drawImage(this.img, this.sx * this.currentnum, this.sh, this.sx, this.sy, this.x * SCALE + this.sdx * SCALE, this.y * SCALE + this.sdy * SCALE, this.sx * SCALE * 0.95, this.sy * SCALE * 0.95);

	} else {
		this.x = 1280 - this.x - 300;
		ctx.save();
		ctx.translate(w, 0);
		ctx.scale(-1, 1);
		this.shadow(); //绘制阴影
		ctx.drawImage(this.img, this.sx * this.currentnum, this.sh, this.sx, this.sy, this.x * SCALE + this.sdx * SCALE, this.y * SCALE + this.sdy * SCALE, this.sx * SCALE * 0.95, this.sy * SCALE * 0.95);
		ctx.restore();
	}

}
character.prototype.loadimg = function() { //载入
	if(this.img.complete && this.shadowimg.complete) {
		this.ready = true;
	}
}

character.prototype.move = function() { //小于场景边界值
	if(this.direction == 1 && this.x <= this.dx) {
		this.cx += 4 * this.speed;
	} else if(this.direction == 0 && this.x <= this.dx) {

		this.cx -= 4 * this.speed;
	}
}

character.prototype.up = function() {
	if(this.y >= 280) {
		this.y -= 2 * this.speed;
	}
}
character.prototype.down = function() {
	if(this.y < 435) {
		this.y += 2 * this.speed;
	}

}

character.prototype.check = function() { //如果status变化则载入对应数据
	if(this.data != this.status) {
		this.config(this.status);
		this.data = this.status;
	}
}

character.prototype.shadow = function() {
	this.shadowfps++;
	if(this.shadowfps >= 8) {
		this.shadowfps = 0;
		this.shadownum = (this.shadownum + 1) % 8;
	}
	ctx.drawImage(this.shadowimg, this.shadownum * 305, 0, 305, 80, this.x * SCALE + 15 * SCALE, this.y * SCALE + 225 * SCALE, 305 * SCALE * 0.9, 80 * SCALE * 0.9);
}
character.prototype.judge = function() { //判定是否命中
	for(let i = 0; i < enemysnum; i++) {
		if(enemys[i].status != 0&&enemys[i].status != 4) { //当存在
			if((enemys[i].cx) <= (this.cx + this.sx*0.5+this.sx*0.5*this.direction) && (this.cx+this.sx*0.5*this.direction) <= (enemys[i].cx + enemys[i].sx) && Math.abs(this.y - enemys[i].y) < 20) { //命中则,名中区域与directtion有关
				if(this.currentnum == 3 && this.fps == 1) { //不在无敌状态且仅有一次判定
					if(this.hit > 99) {
						this.hit = 0; //超过三位数清零
					}
					this.hit++;
					game.score.hitnum=Math.max(this.hit,game.score.hitnum)//最大值存入
					this.hittime = 0;
					enemys[i].hurt = Math.floor(this.attack.hurt * Math.random() + this.attack.minhurt);
					hurtnum1 = new hurtnum(i, enemys[i].hurt); //i是敌人编号，hurt是收到伤害量
					if(hurtnums.length > 20) {
						hurtnums.splice(0, 1); //删除消失对象
					}
					hurtnums.push(hurtnum1);
					enemys[i].life -= enemys[i].hurt;
					/*					enemys[i].ifattack = 0;*/
					enemys[i].status = 1;
					self.attack.target = i;
				}
			}
		}
	}
}