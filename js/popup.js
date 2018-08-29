let popup = function() {
	this.display = false; //是否显示
	this.bkalpha = 0; //黑色遮罩透明度
	this.status = 0; //进入  离开
	this.type = 0;
	this.currentnum = 0; //当前帧
	this.x; //绘制起点坐标
	this.y;
	this.img = new Image();
	this.img.src = "img/popup.png";
	this.dead = new Image();
	this.dead.src = "img/dead.png";
	this.body = new Image();
	this.change = new Image();
	this.changeindex = -1; //要更改的鍵
	this.change.src = "img/change.png";
	this.keybtn = new Array();
	this.back = new mybutton();
	this.back.active = function() {
		popup.status = 1;
	}
	this.voicebtn = new mybutton();
	this.voicebtn.active = function() {
		bgm.setmuted();
		if(popup.voicebtn.status == 0) {
			popup.voicebtn.status = 1;
		} else {
			popup.voicebtn.status = 0;
		}
	}

	for(let i = 0; i < 6; i++) {
		btn1 = new mybutton();
		this.keybtn.push(btn1);
	}
	for(i in this.keybtn) {
		this.keybtn[i].active = function() {
			this.ifchange = true;
		}
	}
	this.title = new Image();
	this.ready = false;
	this.time; //控制动画播放速度

}
popup.prototype.init = function(type) { //默认显示0是设置，1是排行榜
	switch(type) {
		case 0:
			this.title.src = "img/setting.png";
			this.body.src = "img/set.png";
			break;
		case 1:
			this.title.src = "img/rank.png";
			this.body.src = "img/body.png";
			break;
		case 2:
			this.img.src = "img/dead.png";
			break;
		default:
			break;
	}
	this.time = 0;
	this.x = 0; //绘制起点坐标
	this.y = -720;
	this.display = false;
	this.type = 0;
	this.bkalpha = 0;
	this.back.init(this.x + 1027, this.y + 109, 80, 68, "img/back.png");
	this.voicebtn.init(this.x + 686, this.y + 258, 176, 58, "img/button/voicebtn.png");
	this.keybtn[0].init(this.x + 414, this.y + 427, 148, 58, "img/button/keybtn.png"); //up
	this.keybtn[1].init(this.x + 414, this.y + 545, 148, 58, "img/button/keybtn.png"); //down
	this.keybtn[2].init(this.x + 587, this.y + 545, 148, 58, "img/button/keybtn.png"); //right
	this.keybtn[3].init(this.x + 240, this.y + 545, 148, 58, "img/button/keybtn.png"); //left
	this.keybtn[4].init(this.x + 837, this.y + 545, 148, 58, "img/button/keybtn.png"); //attack
	this.keybtn[5].init(this.x + 837, this.y + 427, 148, 58, "img/button/keybtn.png"); //jump
	for(i in this.keybtn) {
		this.keybtn[i].ifchange = false;
	}
	this.keybtn[0].value = "W";
	this.keybtn[1].value = "S";
	this.keybtn[2].value = "D";
	this.keybtn[3].value = "A";
	this.keybtn[4].value = "J";
	this.keybtn[5].value = "";

	this.loadimg();
}
popup.prototype.loadimg = function() {
	if(this.img.complete && this.body.complete && this.back.img.complete && this.title.complete && this.dead.complete && this.voicebtn.img.complete && this.keybtn[0].img.complete && this.change.complete) {
		this.ready = true;
	}
}
popup.prototype.update = function() {
	switch(this.status) {
		case 0: //进入
			if(this.y < 0) {
				this.y += (24 - this.type * 12);
				this.back.y += (24 - this.type * 12);
				this.voicebtn.y += (24 - this.type * 12);
				for(i in this.keybtn) {
					this.keybtn[i].y += (24 - this.type * 12);
				}
				this.bkalpha += 0.025 - this.type * 0.0125;
			}
			break;
		case 1: //退出
			if(this.y > -720) {
				this.y -= (24 - this.type * 12);
				this.back.y -= (24 - this.type * 12);
				this.voicebtn.y -= (24 - this.type * 12);
				for(i in this.keybtn) {
					this.keybtn[i].y -= (24 - this.type * 12);
				}
				this.bkalpha -= 0.025;
			} else if(this.y == -720) {
				this.display = false;
				this.status = 0;
			}
			if(game.status != 0) { //游戏过程中退出直接返回首页
				anime.init(1);
				anime.finish = function() {
					popup.type = 0;
					popup.display = false;
					game.init(0);
					game.status = 0;
				}
			}
			break;
		default:
			break;
	}

	ctx.fillStyle = "rgba(0,0,0," + this.bkalpha + ")";
	ctx.fillRect(0, 0, w, h);
	this.ondrew();

}
popup.prototype.ondrew = function() {
	if(this.type == 0) {
		ctx.drawImage(this.img, this.x * SCALE, this.y * SCALE, w, h);
		ctx.drawImage(this.title, (this.x + 154) * SCALE, (this.y + 70) * SCALE, 282 * SCALE, 139 * SCALE);
		ctx.drawImage(this.body, 853 * this.currentnum, 0, 853, 435, (this.x + 223) * SCALE, (this.y + 203) * SCALE, 853 * SCALE, 435 * SCALE);
		this.back.update();
		if(game.status != 0) { //rank
			this.drewnum();
		} else { //setting
			this.voicebtn.update();
			for(i in this.keybtn) {
				this.keybtn[i].update();
			}
			this.drewkey();
			for(i in this.keybtn) {
				if(this.keybtn[i].ifchange) {
					ctx.drawImage(this.change, 0, 0, w, h);
					this.changeindex = i;//讀取要變的鍵
				}
			}
		}

	} else {
		ctx.drawImage(this.dead, this.x * SCALE, this.y * SCALE, w, h);
	}
}
popup.prototype.drewnum = function() {
	ctx.fillStyle = "rgba(255,255,255," + 1 + ")";
	ctx.strokeStyle = "rgba(0,0,0," + 1 + ")";
	//排行榜
	ctx.lineWidth = 6 * SCALE;
	ctx.font = (56 * SCALE) + "px fzs";
	popup.text(game.rank[0], 755, 258);
	popup.text(game.rank[1], 755, 348);
	popup.text(game.rank[2], 755, 438);
	popup.text(game.rank[3], 755, 528);
	popup.text(game.rank[4], 755, 618);
	//我的战绩
	ctx.lineWidth = 4;
	ctx.font = (36 * SCALE) + "px fzs";
	popup.text(game.score.hitnum, 300, 450);
	popup.text(game.score.hurt, 300, 502);
	popup.text(game.score.time, 300, 554);
	popup.text(game.score.score, 300, 606);
}
popup.prototype.text = function(text, x, y) {
	ctx.strokeText(text, (this.x + x) * SCALE, (this.y + y) * SCALE);
	ctx.fillText(text, (this.x + x) * SCALE, (this.y + y) * SCALE);
}
popup.prototype.drewkey = function() {
	ctx.fillStyle = "rgba(255,255,255," + 1 + ")";
	ctx.strokeStyle = "rgba(0,0,0," + 1 + ")";
	ctx.lineWidth = 6 * SCALE;
	ctx.font = (42 * SCALE) + "px nj";
	popup.text(this.keybtn[0].value, 474, 470);
	popup.text(this.keybtn[3].value, 300, 588);
	popup.text(this.keybtn[1].value, 474, 588);
	popup.text(this.keybtn[2].value, 647, 588);
	popup.text(this.keybtn[4].value, 897, 588);
	popup.text(this.keybtn[5].value, 897, 470);
}
popup.prototype.changekey = function(e) {
	this.keybtn[this.changeindex].value = e.key.toUpperCase();
	switch(Number(this.changeindex)) {//SWITCH為===比較
		case 0:
			control.up = e.keyCode;
			break;
		case 1:
			control.down = e.keyCode;
			break;
		case 2:
			control.right = e.keyCode;
			break;
		case 3:
			control.left = e.keyCode;
			break;
		case 4:
			control.attack = e.keyCode;
			break;
		case 5:
			control.jump = e.keyCode;
			break;
		default:
			break;
	}
	this.keybtn[this.changeindex].ifchange = false;
	this.changeindex = -1;
}