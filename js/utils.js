class Utils {
	constructor(_scene){
        this.scene = _scene;
	}

	init() {
	}

    set_game_size() {
		let canvas = document.querySelector("canvas");
		let windowWidth;
		let windowHeight;
        let size = {'W': window.innerWidth, 'H': window.innerHeight};

		if (this.scene.scale.isFullscreen) {
			windowWidth = window.innerWidth;
			windowHeight = window.innerHeight;
		}
		else {
			windowWidth = size['W'];
			windowHeight = size['H'];
		}

		let windowRatio = windowWidth / windowHeight;
		let gameRatio = phaser_game.config.width / phaser_game.config.height;

		if(windowRatio < gameRatio){
			canvas.style.width = windowWidth + "px";
			canvas.style.height = (windowWidth / gameRatio) + "px";
		}
		else{
			canvas.style.height = windowHeight + "px";
			canvas.style.width = (windowHeight * gameRatio) + "px";
		}
	}
}