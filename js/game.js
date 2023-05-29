class Game {
	constructor(_scene) {
		this.scene = _scene;
	}

	prepare_game() {
		//load saved data
		user_data = Object.assign({}, init_user_data);
		if (!config['reset_user_data'] && config['use_local_storage']) {
			let stored_data = localStorage.getItem(boot_data['game_id']);
			if (stored_data) {
				user_data = JSON.parse(stored_data);
			}
		}

		utils = new Utils(this.scene);
		utils.emitter.on('EVENT', this.handler_event, this);
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
		//delayed reset on start when no money and game not created
		if (this.delayed_reset_game) { 
			this.game_engine.reset_game(this.delayed_reset_game);
			this.delayed_reset_game = null;
		}
		utils.add_orientation_notifier();
	}

	handler_event(params) {
		switch (params['event']) {
			case 'reset_game':
				if (this.game_engine) this.game_engine.reset_game(params);
				else this.delayed_reset_game = params;
				break;
			default:
				console.log('Unknown event:', params['event'])
				break;
		}
	}

	update() {
	}

}

