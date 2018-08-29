let game = function() { //添加四步，声明对象，初始化对象init，重写active方法,加载load，更新update
	this.status; //控制主循环更新
	this.ifstop = 0; //是否暂停
	this.ifover = 0; //游戏是否结束
	this.ready = false; //加载
	this.load = new Array();
	this.score; //玩家数据；
	this.rank = new Array(100000, 100000, 100000, 100000, 100000, 100000); //排行榜数据,最后一位用来存储当前玩家数据
	this.loadnum = 0; //已加載
	this.status = 0;
	/*声明对象*/
	bgm = new gameaudio("audio/index.mp3", true);
	mainscene = new scene();
	pausescene = new scene();
	popup = new popup();
	pausescene.init(-1);
	self = new character();
	enemys = new Array();
	hurtnums = new Array();
	enemysnum = 8;
	for(let i = 0; i < 20; i++) { //总数为20的敌人组
		enemys[i] = new enemy();
	}
	info = new info();

	newbtn = new mybutton();
	settingbtn = new mybutton(); //设置

	stopbtn = new mybutton();

	/*按钮功能添加*/
	newbtn.active = function() {
		anime.init(1);
		anime.finish = function() {
			game.init(1);
			game.status = 1;
		}
	}
	settingbtn.active = function() {
		popup.display = true;
	}

	stopbtn.active = function() {
		game.ifstop = 1
		game.gameStop();
	}
}
game.prototype.init = function(status) {
	anime.init(0);
	this.ready = false;
	this.ifover = false;
	if(localStorage.playscore) {
		game.rank = JSON.parse(localStorage.playscore); //JSON转换为数组，读取数据
	}
	this.score = { //存储玩家数据
		hitnum: 0,
		time: 0,
		hurt: 0,
		score: 0
	}
	switch(status) {
		case 0:
			mainscene.init(0);
			popup.init(0);
			bgm.ado.src = "audio/index.mp3";
			bgm.play();
			newbtn.init(501, 479, 278, 42, "img/button/start.png");
			settingbtn.init(501, 558, 278, 42, "img/button/setting.png");
			break;

		case 1:
			mainscene.init(1);
			hurtnums.splice(0, hurtnums.length);
			popup.init(1);
			stopbtn.init(1227, 2, 49, 47, "img/button/stop.png");
			bgm.ado.src = "audio/scene1.mp3";
			bgm.play();
			info.init(0); //第一个角色
			self.init();
			for(let i = 0; i < enemysnum; i++) {
				enemys[i].init(1, Math.floor(3100 * Math.random() + 1100), Math.floor(180 * Math.random() + 300)); //敌人种类，出现的场景坐标
				enemys[i].index = i;
			}
			break;
		default:
			break;
	}
	this.gameLoad(status);
}

game.prototype.gameLoad = function(status) { //加载
	this.loadnum = 0; //重置加载进度
	switch(status) {
		case 0:
			this.load = [mainscene, newbtn, settingbtn, popup];
			break;


		case 1:
			this.load = [mainscene, info, self, stopbtn, popup];
			for(let i = 0; i < enemysnum; i++) {
				this.load.push(enemys[i]);
			}
			break;
		default:
			break;
	}

	for(let i = 0; i < game.load.length; i++) { //每次都检查更新一次加载进度
		if(this.load[i].ready) {
			this.loadnum += 1;
		}
	}

	/*绘制加载界面*/
	ctx.font = 40 * SCALE + "px nj";
	ctx.fillStyle = "#fff";
	ctx.fillText("加載中..." + parseInt(this.loadnum / this.load.length * 100) + "%", 440 * SCALE, 360 * SCALE);

	if(this.loadnum == this.load.length) { //当全部加载完成时
		console.log("seccuss");
		this.ready = true;
	} else { //加载未加载部分
		console.log("loading，" + this.loadnum);
		for(let i = 0; i < this.load.length; i++) {
			if(!this.load[i].ready) {
				this.load[i].loadimg();
			}
		}
	}

}

game.prototype.gameRander = function() { //this不同
	ctx.clearRect(0, 0, w, h); //每次绘制前重置
	document.onkeydown = function(e) {
		control.open(e)
		if(popup.changeindex != -1) {
			popup.changekey(e);
		}
	};
	document.onkeyup = function(e) {
		control.open(e)
	}
	if(game.ifover == 0) { //游戏结束后不读取键值
		control.popKey();
	}

	if(!game.ready) { //加载未完成时
		game.gameLoad();
	} else {
		switch(game.status) {
			case 0:
				mainscene.update();
				mainscene.closedrew();

				if(popup.display) {
					popup.update();
				} else {
					newbtn.update();
					settingbtn.update();
				}
				break;

			case 1:

				mainscene.update(self.x, self.status, self.direction); //场景更新

				info.update();

				for(let i = 0; i < enemysnum; i++) {
					if(enemys[i].y <= self.y) {
						enemys[i].update();
					}
				}
				self.update(mainscene.x); //主角更新
				for(let i = 0; i < enemysnum; i++) {
					if(enemys[i].y > self.y) {
						enemys[i].update();
					}
				}
				for(i in hurtnums) {
					hurtnums[i].update();
				}
				mainscene.closedrew(); //绘制前景
				if(game.ifover == 0) {
					popup.display = true;

					for(let i = 0; i < enemysnum; i++) {
						if(enemys[i].life > 0 || enemys[i].currentnum != enemys[i].srcnum - 1 || self.cx < 4200) { //通关条件
							popup.display = false; //只有有敌人存在，不显示通过画面
						}
					}
				}
				if(self.status == 6 && self.currentnum == self.srcnum - 1) { //战败
					popup.type = 1;
					popup.display = true;
				}
				if(popup.display) { //战胜
					if(game.ifover == 0) { //计算得分
						game.score.time = info.min * 60 + info.sec;
						game.score.hurt = self.maxlife - self.life;
						game.score.score = 1000000 - game.score.time * 9050 - game.score.hurt * 105 + game.score.hitnum * 4050;
						if(game.score.score < 100000) {
							game.score.score = 100000;
						} else if(game.score.score >= 1000000) {
							game.score.score = 999999;
						}
						game.rank[5] = game.score.score; //最后一位被替换为当前分数
						game.rank.sort(game.sortnum);
						localStorage.playscore = JSON.stringify(game.rank); //转换成json格式存储

						console.log(game.rank);
						console.log(localStorage.getItem("playscore"));
					}
					game.ifover = 1;
					popup.update();
					if(self.status!=6&&self.currentnum==self.srcnum-1){
						self.status=0;
					}
				}
				else{
					stopbtn.update();
				}
				break;

			default:
				break;
		}
		if(anime.display) { //动画未完成时播放动画
			anime.update();
		}
	}
	if(game.ifstop == 0) { //非暂停时
		requestAnimationFrame(game.gameRander);
	} else { //暂停时
		pausescene.ondrew();
		bgm.pause();
	}
}
game.prototype.gameStop = function() {
	if(game.ifstop == 0) {
		requestAnimationFrame(game.gameRander);
		bgm.play(); //音乐
	}
}
game.prototype.windowsize = function(width, height) {
	w = width;
	h = height;
	can.style.marginTop = -h / 2 + "px";
	can.style.marginLeft = -w / 2 + "px";
	SCALE = w / 1280;
	can.width = w;
	can.height = h;
}
game.prototype.sortnum = function(a, b) { //排序函数
	return b - a;
}