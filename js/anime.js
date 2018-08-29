let anime={
	display: true,
	status: 0,//0是淡入，1是淡出
	alpha: 1,
	init: function(status){
		anime.status=status;
		switch (anime.status){
			case 0:anime.alpha=1;
				break;
			case 1:anime.alpha=0;
				break;	
			default:
				break;
		}
		anime.display=true;
		anime.finish=function(){};
	},
	update: function(){
		ctx.fillStyle="rgba(0,0,0,"+anime.alpha+")";
		ctx.fillRect(0,0,w,h);
		switch (anime.status){
			case 0:anime.alpha-=0.04;
				break;
			case 1:anime.alpha+=0.04;
				break;
			default:
				break;
		}
		
		if(anime.alpha<0||anime.alpha>1){
			anime.display=false;
			anime.finish();
		}
	},
	finish: function(){
		
	}
	
}
