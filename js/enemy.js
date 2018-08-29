let enemy = function() {
	this.x;
	this.y; //绘制坐标
	this.cx; //场景坐标
	this.direction; //方向 1为正，0为负
	this.life; //生命
	this.status; //状态
	this.img //IMG对象
	this.shadowimg //阴影IMG对象
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
	this.type; //怪物类
	this.demage; //伤害量
	this.ifattack; //攻击延迟量
	this.index; //序号
	this.hurt; //收到伤害量
	this.attack = {
		minhurt: 200, //最低伤害
		hurt: 100, //伤害阈值
		attackrange: 0, //伤害范围
	}
	/*	this.ifmove; //是否移动
		this.attackrange;//攻击范围*/
}
enemy.prototype.init = function(type, cx, y) { //怪物类型，出现场景坐标
	this.type = type;
	this.life = 3000;
	this.x = -600;
	this.y = y;
	this.cx = cx;
	this.attackrange = 200;
	switch(this.type) {
		case 1:
			this.src = "img/enemy.png";
			break;
		default:
			break;
	}
	this.direction = 0;
	this.fps = 0;
	this.status = 3;
	this.ifattack = 0;
	this.data = 0;
	this.config(0);
	this._ready = false;
	this.img = new Image();
	this.shadowimg = new Image();
	this.img.src = this.src;
	this.shadowimg.src = "img/enemyshadow.png";
	this.loadimg();
}

enemy.prototype.config = function(status) { //设置切图具体数值
	this.currentnum = 0;
	if(this.type == 1) {
		switch(status) {
			case 0: // 死亡
				this.srcnum = 9;
				this.sx = 227;
				this.sy = 246;
				this.sh = 0;
				this.fpsnum = 6;
				this.sdx = 0;
				this.sdy = 0;
				break;
			case 1: // 受到攻击
				this.srcnum = 6;
				this.sx = 286;
				this.sy = 251;
				this.sh = 246;
				this.fpsnum = 6;
				this.sdx = -60;
				this.sdy = 5;
				break;
			case 2: //移动
				this.srcnum = 6;
				this.sx = 227;
				this.sy = 252;
				this.sh = 497;
				this.fpsnum = 3;
				this.sdx = 0;
				this.sdy = 4;
				break;
			case 3: //站立
				this.srcnum = 10;
				this.sx = 197;
				this.sy = 256;
				this.sh = 749;
				this.fpsnum = 3;
				this.sdx = 0;
				this.sdy = 0;
				break;
			case 4: //攻击
				this.srcnum = 9;
				this.sx = 324;
				this.sy = 259;
				this.sh = 1005;
				this.fpsnum = 4;
				this.sdx = 0;
				this.sdy = -3;
				break;
			default:
				break;
		}
	}
}

enemy.prototype.update = function() { //敌人坐标取决于场景坐标,敌人AI取决于主角坐标
	if(this.status != 0 || this.currentnum != this.srcnum - 1) {
		this.fps++;
		this.check(); //探测状态是否改变
		this.x = this.cx - mainscene.x;
		if(this.life <= 0) {
			this.status = 0;
		}
		if(this.status == 4) {
			this.judge();
			if(this.currentnum == this.srcnum - 1) {
				this.status = 3;
			}
		} else if(this.status == 1) {
			if(this.currentnum == this.srcnum - 1) {
				this.status = 3;
			}
		}
		/*AI*/
		if(this.status != 0) {
			if(this.status != 1 && self.status != 6) { //当收到伤害时或玩家死亡，不追击
				if((this.cx - self.cx) <= 600 && (this.cx - self.cx) >= 0) { //视野范围
					this.direction = 0;
					this.enemyAI();
				} else if((this.cx - self.cx) <= 0 && (this.cx - self.cx) >= -600) {
					this.direction = 1;
					this.enemyAI();
				} else if(this.status != 4) {
					this.status = 3;
				}
			} else {
				this.ifattack = 0;
			}
		}
		if(this.fps >= this.fpsnum) { //每刷新n次更新一次角色动画
			this.currentnum = (this.currentnum + 1) % this.srcnum; //循环播放
			this.fps = 0;
		}
		this.ondrew();
	}

}
enemy.prototype.ondrew = function() {
	if(this.direction) {
		this.shadow(); //绘制阴影
		ctx.drawImage(this.img, this.sx * this.currentnum, this.sh, this.sx, this.sy, this.x * SCALE + this.sdx * SCALE, this.y * SCALE + this.sdy * SCALE, this.sx * SCALE, this.sy * SCALE);
	} else {
		this.x = 1280 - this.x - 300;
		ctx.save();
		ctx.translate(w, 0);
		ctx.scale(-1, 1);
		this.shadow(); //绘制阴影
		ctx.drawImage(this.img, this.sx * this.currentnum, this.sh, this.sx, this.sy, this.x * SCALE + this.sdx * SCALE, this.y * SCALE + this.sdy * SCALE, this.sx * SCALE, this.sy * SCALE);
		ctx.restore();
	}
}
enemy.prototype.loadimg = function() { //载入
	if(this.img.complete && this.shadowimg.complete) {
		this.ready = true;
	}
}

enemy.prototype.move = function() {
	/*for(let i = 0; i < enemysnum; i++) { //抽调出三名敌人
		if(this.cx + 12 == enemys[i].cx) {
			this.ifmove = false;
			this.attackrange+=12;
		}
	}
	if(this.ifmove) {*/
	if(this.direction == 1) {
		this.cx += 4;
	} else {
		this.cx -= 4;
	}
	/*	}
		this.ifmove = true;*/
}
enemy.prototype.up = function() {
	if(this.y >= 300) {
		this.y -= 2;
	}
}
enemy.prototype.down = function() {
	if(this.y < 480) {
		this.y += 2;
	}
}

enemy.prototype.check = function() { //如果status变化则载入对应数据
	if(this.data != this.status) {
		this.config(this.status);
		this.data = this.status;
	}
}

enemy.prototype.shadow = function() {
	ctx.drawImage(this.shadowimg, this.x * SCALE - 5 * SCALE, this.y * SCALE + 200 * SCALE, 243 * SCALE, 87 * SCALE);
}
enemy.prototype.enemyAI = function() {
	if(Math.abs(this.cx - self.cx) < this.attackrange && Math.abs(this.y - self.y) < 20) { //进入攻击范围
		if(this.status == 2) {
			this.status = 3;
		}
		if(this.ifattack >= 30) {
			this.status = 4;
			this.ifattack = 0;
		}
		this.ifattack++;
	} else if(this.status != 4 && this.ifattack == 0) { //攻击硬直结束后且不在攻击范围内且不在准备攻击状态
		this.status = 2;
		if(this.y > self.y) {
			this.up();
		} else if(this.y < self.y) {
			this.down();
		}
		this.move();
	} else if(this.ifattack != 0) { //不在攻击范围但是出于准备攻击状态
		this.ifattack++;
		if(this.ifattack >= 30) {
			this.status = 4;
			this.ifattack = 0;
		}
	}
}

enemy.prototype.judge = function() { //判定是否命中
	if((self.cx) <= (this.cx + this.sx * 0.5 + this.sx * 0.5 * this.direction) && (this.cx + this.sx * 0.5 * this.direction) <= (self.cx + self.sx) && Math.abs(this.y - self.y) < 20) { //命中则
		if(self.status != 4 && self.status != 5 && self.status != 6 && this.currentnum == 3 && this.fps == 1) { //无敌状态
			console.log(self.status);
			self.status = 4;
			if(this.direction) {
				self.direction = 0;
			} else {
				self.direction = 1;
			}
			self.hurt = Math.floor(this.attack.hurt * Math.random() + this.attack.minhurt);
			hurtnum1 = new hurtnum(-1, self.hurt); //i是敌人编号，hurt是收到伤害量
			if(hurtnums.length > 20) {
				hurtnums.splice(0, 1); //删除消失对象
			}
			hurtnums.push(hurtnum1);
			self.life -= self.hurt;
		}
	}
}