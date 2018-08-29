let control = {
	enabled: false, //是否获取键值
	ifclose: false, //是否删除连按记录
	keycode: new Array, //记录键值
	keytime: 0, //缓冲时间
	keystun: new Array(0, 0), //动作硬直
	attacklock:0,//一直按住只攻击一次
	left: 68,
	right: 65,
	up: 87,
	down: 83,
	attack: 74,
	jump: 32,
	keysdown: new Array(), //kd键值，记录正在按下的键值
	keysup: new Array(), //ku键值，记录键值连按次数，+1
	open: function(e) {
		control.enabled = true; //避免KD出现重复值
		if(e.type == "keydown") { //kd事件
			for(i in control.keysdown) { //没有重复值
				if(e.keyCode == control.keysdown[i]) {
					control.enabled = false;
				}
			}
			if(control.enabled) {
				control.keysdown.push(e.keyCode);
			}

		} else { //ku时间
			control.keysup.push(e.keyCode);
			for(i in control.keysdown) {
				if(e.keyCode == control.keysdown[i]) { //将对应键值从kd删除
					control.keysdown.splice(i, 1);
				}
			}

			/*setTimeout(control.close, 100);*/ //留缓冲时间让KU记录连按次数,当一定时间后，KD中不存在KU中的值时，将KU对应的值清除

		}
	},
	close: function(keycode) { //清除ku
		control.ifclose = true;

		for(i in control.keysdown) { //当kd中存在ku的值，视为连按
			if(control.keycode == control.keysdown[i]) {
				control.ifclose = false;
			}
		}
		if(control.ifclose) {
			console.log(control.keysup.indexOf(56));
			while(control.keysup.indexOf(control.keycode) != -1) { //当数组中存在该元素时删除
				control.keysup.splice(control.keysup.indexOf(control.keycode), 1);
			}
		}
	},
	popKey: function() {
		for(i in control.keystun) {
			if(control.keystun[i] != 0) {
				control.keystun[i]++; //进入硬直状态
			}
			if(control.keystun[i] ==10) {//硬直时间
				control.keystun[i] = 0; //退出硬直状态
			}
		}

		if(control.keytime >= 5) { /*每循环4次更新一次键值*/
			control.keycode = control.keysup.splice(0, 1);
			control.keytime = 0;
		}
		control.keytime++;
		if(control.keycode[0]==control.attack){
			control.attacklock=0;//解除攻击锁定
		}
		//具体控制
		if(control.keysdown.length == 0 && self.status < 3) { //没有按下任何键且不在硬直中
			self.status = 0; //默认状态
		} else { //按住某键时
			if(self.status < 3) { //不在动作硬直中时
				if(control.keysdown.indexOf(control.left) != -1) { //→键
					self.direction = 1;
					if(control.keycode == control.left) {
						self.status = 2;
					} else if(self.status != 2) {
						self.status = 1;
					}
					self.move();
				}
				if(control.keysdown.indexOf(control.right) != -1) { //←键
					self.direction = 0;
					if(control.keycode == control.right) {
						self.status = 2;
					} else if(self.status != 2) {
						self.status = 1;
					}
					self.move();
				}
				if(control.keysdown.indexOf(control.up) != -1) { //↑键
					if(control.keycode == control.up) {
						self.status = 2;
					} else if(self.status != 2) {
						self.status = 1;
					}
					self.up();
				}
				if(control.keysdown.indexOf(control.down) != -1) { //↓键
					if(control.keycode == control.down) {
						self.status = 2;
					} else if(self.status != 2) {
						self.status = 1;
					}
					self.down();
				}
				if(control.keysdown.indexOf(control.left) == -1 && control.keysdown.indexOf(control.right) == -1 && control.keysdown.indexOf(control.up) == -1 && control.keysdown.indexOf(control.down) == -1) { //既没有A也没有D
					self.status = 0;
				}
				if(control.keysdown.indexOf(control.attack) != -1) { //攻击键
					if(control.keystun[0] == 0&&control.attacklock==0) {//攻击锁定解除
						self.status = 3;
						control.attacklock=1;//攻击锁定
						control.keystun[0]++; //进入硬直时间
					}

				}
				if(control.keysdown.indexOf(control.jump) != -1) { //跳跃键
					if(control.keystun[1] == 0) {
						self.status = 5;
						control.keystun[1]++; //进入硬直时间
					}
				}
			}
			if(self.status == 5) {
				if(control.keysdown.indexOf(control.left) != -1) { //→键
					self.direction = 1;
					self.move();
				}
				if(control.keysdown.indexOf(control.right) != -1) { //←键
					self.direction = 0;
					self.move();
				}
			}
		}
		/*按了某键时*/

		//结束
	}
}