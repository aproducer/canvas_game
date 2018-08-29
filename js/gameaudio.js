let gameaudio = function(src, loop) {
	this.src = src;
	this.loop = loop;
	this.ado;
	this.loadaudio();
}
gameaudio.prototype.loadaudio = function() {
	this.ado = new Audio();
	this.ado.src = this.src;
	this.ado.loop = this.loop;
}
gameaudio.prototype.play = function() {
	this.ado.play();
}
gameaudio.prototype.pause = function() {
	this.ado.pause();
}
gameaudio.prototype.setmuted = function() {
	if(this.ado.muted) {
		this.ado.muted = false;
	} else {
		this.ado.muted = true;
	}
}