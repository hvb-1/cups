var ActionManager = new Phaser.Class({

	Extends: Phaser.GameObjects.Container,

	initialize:

	function ActionManager()
	{
		this.scene = boot_data['scene'];
		Phaser.GameObjects.Container.call(this, this.scene, 0, 0);
		this.emitter = new Phaser.Events.EventEmitter();
		this.create_assets();
	},

	create_assets() {
		let c1 = "#f4ec60";
		let c2 = "#330000";
		this.top_header_active = new Phaser.GameObjects.Text(this.scene, 0, -330, 'Tap box to unveil', {fontFamily: "font1", fontSize: 45, color: c1, stroke: c2, strokeThickness: 6});
		this.top_header_active.setOrigin(0.5);
		this.add(this.top_header_active);

		this.top_header_wait = new Phaser.GameObjects.Text(this.scene, 0, -330, 'Please wait...', {fontFamily: "font1", fontSize: 45, color: c1, stroke: c2, strokeThickness: 6});
		this.top_header_wait.setOrigin(0.5);
		this.add(this.top_header_wait);
		this.top_header_wait.alpha = 0;


		this.attempts = 0;
		this.wins = 0;

		this.attempts_txt_val = 'Attempts: ';
		this.attempts_header = new Phaser.GameObjects.Text(this.scene, -560, 330, 'Attempts: 0', {fontFamily: "font1", fontSize: 26, color: c1, stroke: c2, strokeThickness: 4});
		this.attempts_header.setOrigin(0.5);
		this.add(this.attempts_header);


		this.win_rate_header = new Phaser.GameObjects.Text(this.scene, -560, -60, 'Win rate', {fontFamily: "font1", fontSize: 32, color: c1, stroke: c2, strokeThickness: 4});
		this.win_rate_header.setOrigin(0.5);
		this.add(this.win_rate_header);

		

		this.win_rate_txt = new Phaser.GameObjects.Text(this.scene, -560, 60, 'Unknown %', {fontFamily: "font1", fontSize: 34, color: c1, stroke: c2, strokeThickness: 4});
		this.win_rate_txt.setOrigin(0.5);
		this.add(this.win_rate_txt);

		this.win_rate_panel = new Phaser.GameObjects.Container(this.scene, -560, 0);
		this.add(this.win_rate_panel);
		this.create_win_rate_panel(this.win_rate_panel);

		this.opt_pt = {x: boot_data['W'] / 2 - 45, y: -boot_data['H'] / 2 + 45}

		
		let options_button = new CustomButton(this.scene, this.opt_pt.x, this.opt_pt.y, this.handler_options, 'common1', 'btn_round_out', 'btn_round_over', 'btn_round_out', this ,1.2);
		let temp = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'icon_options');
		options_button.add(temp);

		this.slide_buttons = [];
		this.slide_btn_anim = false;
		this.buttons_showed = false;

		this.sound_btn = new CustomButton(this.scene, this.opt_pt.x, this.opt_pt.y, this.handler_sound, 'common1', 'btn_round_out', 'btn_round_over', 'btn_round_out', this, 1.2);
		this.add(this.sound_btn);
		this.sound_btn.alpha = 0;
		this.sound_btn.icon_off = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'icon_sound_off');
		this.sound_btn.icon_on = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'icon_sound_on');
		this.sound_btn.add(this.sound_btn.icon_off);
		this.sound_btn.add(this.sound_btn.icon_on);
		this.update_sound_icon();
		this.slide_buttons.push(this.sound_btn);

		this.full_btn = new CustomButton(this.scene, this.opt_pt.x, this.opt_pt.y, this.handler_fullscreen, 'common1', 'btn_round_out', 'btn_round_over', 'btn_round_out', this, 1.2);
		this.add(this.full_btn);
		this.full_btn.alpha = 0;
		this.full_btn.icon_off = new Phaser.GameObjects.Image(this.scene, 0, 1, 'common1', 'icon_full_off');
		this.full_btn.icon_on = new Phaser.GameObjects.Image(this.scene, 0, 1, 'common1', 'icon_full_on');
		this.full_btn.add(this.full_btn.icon_off);
		this.full_btn.add(this.full_btn.icon_on);
		this.update_fullscreen_icon();
		this.slide_buttons.push(this.full_btn);

		this.add(options_button);
	},

	

	create_win_rate_panel(cont) {
		let bg = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'info_panel');
		cont.add(bg);
		bg = new Phaser.GameObjects.Image(this.scene, 0, 26, 'common1', 'termo_bg');
		bg.setOrigin(0.5,1);
		cont.add(bg);
		let arrow = new Phaser.GameObjects.Image(this.scene, bg.x, bg.y - 6, 'common1', 'termo_arrow');
		arrow.setOrigin(0.5,0.85);
		cont.add(arrow);
		cont.arrow = arrow;
		cont.min_rate = 0;
		cont.max_rate = 0.8;
		cont.min_angle = -80;
		cont.max_angle = 80;
		arrow.angle = cont.min_angle;
	},

	round_result(is_win, is_init = false) {
		let cont = this.win_rate_panel;
		if (!is_init) {
			this.attempts += 1;
			if (is_win) this.wins += 1;
		}
		
		this.attempts_header.text = this.attempts_txt_val + String(this.attempts);

		let delay = is_win ? 1100 : 500

		let new_rate = this.wins / this.attempts;
		let new_angle = (new_rate / (cont.max_rate - cont.min_rate)) * (cont.max_angle - cont.min_angle) + cont.min_angle;
		if (new_angle > cont.max_angle) new_angle = cont.max_angle;
		this.scene.tweens.add({targets: this.win_rate_txt, scale: 1.1, duration: 300, delay: delay, onComplete: ()=>{
			this.win_rate_txt.text = String(Math.ceil(new_rate * 100)) + ' %';
			this.scene.tweens.add({targets: this.win_rate_txt, scale: 1, duration: 300, delay: 100, onComplete: ()=>{
				this.scene.tweens.add({targets: cont.arrow, angle: new_angle, duration: 400});
			}});
		}});

		this.scene.tweens.add({targets: this.top_header_active, alpha: 0, duration: 300});
		this.scene.tweens.add({targets: this.top_header_wait, alpha: 1, duration: 300, delay: 200});

	},

	prepare_next_round() {
		this.scene.tweens.add({targets: this.top_header_wait, alpha: 0, duration: 300});
		this.scene.tweens.add({targets: this.top_header_active, alpha: 1, duration: 300, delay: 200});
		
	},

	get_fly_ball_pt() {
		return utils.toGlobal(this.win_rate_panel);
	},


	handler_options() {
		if (!this.slide_btn_anim) {
			this.slide_btn_anim = true;
			
			for (let i = 0; i < this.slide_buttons.length; i++) {
				let btn = this.slide_buttons[i];
				let new_pos = this.opt_pt.y + (this.buttons_showed ? 0: (i + 1) * 95);
				let dur = 600 + i * 50;
				this.opt_btn_anim(btn, this.buttons_showed, new_pos, dur, i == this.slide_buttons.length - 1)
				// if (this.buttons_showed) {
				// 	let delay = i * 150;
				// 	let dur = 600 + i * 50;
				// 	console.log(i, new_alpha, delay, dur, dur + delay - 100)
				// 	this.opt_btn_anim(btn, )
				// }
				// else {
				// 	// let rev_i = this.slide_buttons.length - 1 - i;
				// 	// let delay = rev_i * 150;
				// 	//let dur = 600 + rev_i * 50;
				// 	let delay = i * 150;
				// 	let dur = 600 + i * 50;
				// 	this.scene.tweens.add({targets: btn, alpha: new_alpha, duration: 50, delay: delay});
				// 	this.scene.tweens.add({targets: btn, y: new_pos, duration: dur, delay: delay, ease: 'Back.easeOut', onComplete: ()=> {
				// 		if (i == this.slide_buttons.length - 1) this.slide_btn_anim = false;
				// 	}});
				// }
			}
			this.buttons_showed = !this.buttons_showed;
			utils.play_sound('opt_woosh');
		}
	},

	opt_btn_anim(btn, buttons_showed, new_pos, dur, reset_flag) {
		
		
		if (buttons_showed) {
			this.scene.tweens.add({targets: btn, alpha: 0, duration: 50, delay: dur - 50});
			this.scene.tweens.add({targets: btn, y: new_pos, duration: dur, ease: 'Back.easeIn', onComplete: ()=> {
				if (reset_flag) this.slide_btn_anim = false;
			}});
		}
		else {
			this.scene.tweens.add({targets: btn, alpha: 1, duration: 50});
			this.scene.tweens.add({targets: btn, y: new_pos, duration: dur, ease: 'Back.easeOut', onComplete: ()=> {
				if (reset_flag) this.slide_btn_anim = false;
			}});
		}
		
	},

	handler_sound () {
		utils.switch_sound_volume();
		this.update_sound_icon();
	},

	handler_fullscreen() {
		setTimeout(() => {
			this.update_fullscreen_icon();
		}, 250);
		if (this.scene.scale.isFullscreen) {
			//game_data['user_data']['full_screen'] = false;
			this.scene.scale.stopFullscreen();
		}
		else {
			//game_data['user_data']['full_screen'] = true;
			this.scene.scale.startFullscreen();
		}
		setTimeout(() => {
			this.scene.scale.refresh();
		}, 500);
	},

	update_sound_icon() {
		this.sound_btn.icon_off.visible = utils.sound_unpaused ? false : true;
		this.sound_btn.icon_on.visible = utils.sound_unpaused ? true : false;
	},

	update_fullscreen_icon() {
		this.full_btn.icon_on.visible = !this.scene.scale.isFullscreen;
		this.full_btn.icon_off.visible = this.scene.scale.isFullscreen;
	},
	
});
