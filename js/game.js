class Game {
	constructor(_scene) {
		this.scene = _scene;
	}


	prepare_game() {
		utils = new Utils(this.scene);
		utils.init();
		window.focus();
		window.addEventListener("resize", ()=>{
			utils.set_game_size();
		});
		let pt = {x: boot_data['W'] / 2, y: boot_data['H'] / 2}
		let bg_holder = new Phaser.GameObjects.Container(this.scene, pt.x, pt.y);
		this.scene.add.existing(bg_holder);
		let img = new Phaser.GameObjects.Image(this.scene, 0, 0, 'main_bg');
		bg_holder.add(img);

		this.game_engine = new GameEngine(pt);
		this.scene.add.existing(this.game_engine);
		

		this.anim_holder = new Phaser.GameObjects.Container(this.scene, 0, 0);
		this.scene.add.existing(this.anim_holder);

		this.game_engine.init({'anim_holder': this.anim_holder});

		utils.add_orientation_notifier();
		
	}

	update(){
	}

}

