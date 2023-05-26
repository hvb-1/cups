var GameCup = new Phaser.Class({

	Extends: Phaser.GameObjects.Container,

	initialize:

	function GameCup(_no)
	{
		this.scene = boot_data['scene'];
		Phaser.GameObjects.Container.call(this, this.scene, 0, 0);
		this.emitter = new Phaser.Events.EventEmitter();
		this.no = _no;
		this.current_pos = _no;
		this.create_assets();
	},

	create_assets() {
		this.is_up = false;
		this.allow_click = true;
		this.shadow = new Phaser.GameObjects.Image(this.scene, 0, 50, 'common1', 'cup_main');
		this.shadow.setScale(1, 0.7);
		this.shadow.dy = this.shadow.y;
		this.shadow.def_sx = this.shadow.scaleX;
		this.shadow.def_sy = this.shadow.scaleY;

		this.tweenable_parts = [];

		this.shadow.alpha = 0.9;
		this.shadow.postFX.addBlur(0, 0, 0, 3, 0x000000, 2);
		this.add(this.shadow);
		this.tweenable_parts.push(this.shadow);

		if (this.no == 0) {
			this.ball = new Phaser.GameObjects.Image(this.scene, 0, 10, 'common1', 'ball');
			this.ball_shadow = new Phaser.GameObjects.Image(this.scene, 0, 65, 'common1', 'ball');
			this.ball_shadow.setScale(1, 0.2);
			this.ball_shadow.alpha = 0;
			this.ball_shadow.d_alpha = 0.6;
			this.ball_shadow.postFX.addBlur(0, 0, 0, 2, 0x000000, 2);
			this.add(this.ball_shadow);
			this.add(this.ball);

			this.ball_for_fly = new Phaser.GameObjects.Image(this.scene, 0, this.ball.y, 'common1', 'ball');
			this.add(this.ball_for_fly);
			this.ball_for_fly.visible = false;

			this.tweenable_parts.push(this.ball_shadow);
		}

		this.main_cup = new Phaser.GameObjects.Container(this.scene, 0, 0);
		this.add(this.main_cup);
		this.tweenable_parts.push(this.main_cup);

		this.cup_out = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'cup_main');
		this.main_cup.add(this.cup_out);
		this.cup_over = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'cup_over');
		this.cup_over.alpha = 0.01;
		this.cup_over.setInteractive({useHandCursor: true, pixelPerfect: true});
		this.main_cup.add(this.cup_over);
		
		this.cup_over.on('pointerover', ()=> {
			this.cup_over_anim(true)
		});
		this.cup_over.on('pointerout', ()=> {
			this.cup_over_anim();
		});

		this.cup_over.on('pointerdown', this.handler_click, this);

	},

	cup_over_anim(show = false) {
		if (this.over_tween) this.over_tween.stop();
		let alpha = show ? 1 : 0.01;
		this.over_tween = this.scene.tweens.add({targets: this.cup_over, alpha: alpha, duration: 150});
	},

	handler_click() {
		if (this.allow_click) {
			this.allow_click = false;
			
			if (this.is_up) {
				this.move_down();
			}
			else {
				this.move_up(true);
			}
		}
	},

	move_up(by_click = false) {
		let dur = 400;
		this.is_up = true;
		utils.stop_tweens(this.tweenable_parts);
		if (this.tid_down) clearTimeout(this.tid_down);

		this.scene.tweens.add({targets: this.main_cup, y: -150, duration: dur, onComplete: ()=>{
			this.allow_click = true;
			if (by_click) this.emitter.emit('EVENT', {'event': 'cup_click', 'instance': this});
			this.tid_down = setTimeout(() => {
				if (this.allow_click) this.move_down();
			}, 5000);
		}});
		this.scene.tweens.add({targets: this.shadow, 
			y: this.shadow.dy + 60, 
			scaleX: this.shadow.def_sx * 0.7,
			scaleY: this.shadow.def_sy * 0.7,
			duration: dur
		});
		if (this.ball_shadow) {
			this.scene.tweens.add({targets: this.ball_shadow, alpha: this.ball_shadow.d_alpha, duration: 150});
		}
	},

	move_down(on_complete = null, delay = 0) {
		let dur = 400;
		this.is_up = false;
		utils.stop_tweens(this.tweenable_parts);
		if (this.tid_down) clearTimeout(this.tid_down);

		this.scene.tweens.add({targets: this.main_cup, y: 0, duration: dur, delay: delay, onComplete: ()=>{
			this.allow_click = true;
			this.emitter.emit('EVENT', {'event': 'cup_down', 'instance': this});
			if (on_complete) on_complete();
		}});
		this.scene.tweens.add({targets: this.shadow, 
			y: this.shadow.dy, 
			scaleX: this.shadow.def_sx,
			scaleY: this.shadow.def_sy,
			delay: delay,
			duration: dur
		});
		if (this.ball_shadow) {
			this.scene.tweens.add({targets: this.ball_shadow, alpha: 0, delay: dur - 150 + delay, duration: 150});
		}
	},

	

	// init(params) {
	// 	this.create_assets()
	// },

	
});
