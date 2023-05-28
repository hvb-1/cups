var ActionManager = new Phaser.Class({

	Extends: Phaser.GameObjects.Container,

	initialize:

	function ActionManager(_anim_holder)
	{
		this.scene = boot_data['scene'];
		Phaser.GameObjects.Container.call(this, this.scene, 0, 0);
		this.emitter = new Phaser.Events.EventEmitter();
		this.anim_holder = _anim_holder
		this.create_assets();
		this.update_money();
		this.round_result(false, true);
		this.update_fullscreen_icon();
		this.update_sound_icon();
	},

	create_assets() {
		let c1 = "#f4ec60";
		let c2 = "#330000";
		this.color1 = c1;
		this.color2 = c2;
		this.top_header_active = new Phaser.GameObjects.Text(this.scene, 0, -330, 'Tap box to unveil', {fontFamily: "font1", fontSize: 45, color: c1, stroke: c2, strokeThickness: 6});
		this.top_header_active.setOrigin(0.5);
		this.add(this.top_header_active);

		this.top_header_wait = new Phaser.GameObjects.Text(this.scene, 0, -330, 'Please wait...', {fontFamily: "font1", fontSize: 45, color: c1, stroke: c2, strokeThickness: 6});
		this.top_header_wait.setOrigin(0.5);
		this.add(this.top_header_wait);
		this.top_header_wait.alpha = 0;


		this.attempts = user_data.attempts;
		this.wins = user_data.wins;

		this.attempts_txt_val = 'Attempts: ';
		this.attempts_header = new Phaser.GameObjects.Text(this.scene, -560, 330, 'Attempts: 0', {fontFamily: "font1", fontSize: 26, color: c1, stroke: c2, strokeThickness: 4});
		this.attempts_header.setOrigin(0.5);
		this.add(this.attempts_header);


		this.win_rate_header = new Phaser.GameObjects.Text(this.scene, -560, -60, 'Win rate', {fontFamily: "font1", fontSize: 32, color: c1, stroke: c2, strokeThickness: 4});
		this.win_rate_header.setOrigin(0.5);
		this.add(this.win_rate_header);

		this.win_rate_txt = new Phaser.GameObjects.Text(this.scene, -560, 60, '0 %', {fontFamily: "font1", fontSize: 34, color: c1, stroke: c2, strokeThickness: 4});
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
		
		this.slide_buttons.push(this.sound_btn);

		this.full_btn = new CustomButton(this.scene, this.opt_pt.x, this.opt_pt.y, this.handler_fullscreen, 'common1', 'btn_round_out', 'btn_round_over', 'btn_round_out', this, 1.2);
		this.add(this.full_btn);
		this.full_btn.alpha = 0;
		this.full_btn.icon_off = new Phaser.GameObjects.Image(this.scene, 0, 1, 'common1', 'icon_full_off');
		this.full_btn.icon_on = new Phaser.GameObjects.Image(this.scene, 0, 1, 'common1', 'icon_full_on');
		this.full_btn.add(this.full_btn.icon_off);
		this.full_btn.add(this.full_btn.icon_on);
		
		this.slide_buttons.push(this.full_btn);

		this.reset_btn = new CustomButton(this.scene, this.opt_pt.x, this.opt_pt.y, ()=> {this.show_reset_game(true)}, 'common1', 'btn_round_out', 'btn_round_over', 'btn_round_out', this, 1.2);
		this.add(this.reset_btn);
		this.reset_btn.alpha = 0;
		this.reset_btn.icon = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'icon_reset');
		this.reset_btn.add(this.reset_btn.icon);
		
		this.slide_buttons.push(this.reset_btn);

		this.add(options_button);

		this.money_panel = new Phaser.GameObjects.Container(this.scene, -560, -300);
		this.add(this.money_panel);
		let cont = this.money_panel;
		let bg = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'info_panel');
		cont.add(bg);
		this.money_icon = new Phaser.GameObjects.Image(this.scene, -37, 2, 'common1', 'coin');
		cont.add(this.money_icon);

		this.money_txt = new Phaser.GameObjects.Text(this.scene, 28, 2, '0', {fontFamily: "font1", fontSize: 36, color: c1, stroke: c2, strokeThickness: 4});
		this.money_txt.setOrigin(0.5);
		cont.add(this.money_txt);
		
		this.bet_panel = new Phaser.GameObjects.Container(this.scene, -90, 300);
		this.add(this.bet_panel);
		this.create_bet_panel(this.bet_panel);
	},

	get_money_pt() {
		return utils.toGlobal(this.money_icon);
	},

	update_money(delay = 0) {
		let txt = this.money_txt;
		this.scene.tweens.add({targets: txt, scale: 1.2, duration: 200, delay: delay, onComplete: ()=>{
			txt.text = String(user_data.money);
			this.scene.tweens.add({targets: txt, scale: 1, duration: 200});
			if (user_data.money <= 0) this.show_reset_game();
		}});
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
			if (is_win) {
				this.wins += 1;
				user_data.money += this.win_amount;
				this.prize_anims();
			}
			else {
				user_data.money -= this.current_bet;
				this.update_money(500);
				if (user_data.money < this.current_bet) this.update_bet_buttons(this.current_bet);
			}
			user_data.attempts = this.attempts;
			user_data.wins = this.wins;	
			utils.save_user_data();
			
		}
		this.attempts_header.text = this.attempts_txt_val + String(this.attempts);

		let delay = is_win ? 1100 : 500

		let new_rate = this.attempts > 0 ? this.wins / this.attempts : 0;
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
		return user_data.money <= 0;
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
			user_data.full_screen = false;
			this.scene.scale.stopFullscreen();
		}
		else {
			user_data.full_screen = true;
			this.scene.scale.startFullscreen();
		}
		utils.save_user_data();
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
	

	create_bet_panel(cont) {
		let txt = new Phaser.GameObjects.Text(this.scene, -200, 0, 'Your bet:', {fontFamily: "font1", fontSize: 34, color: this.color1, stroke: this.color2, strokeThickness: 4});
		txt.setOrigin(0.5);
		cont.add(txt);

		this.bet_buttons = [];
		let btn_pos = -80;
		let step = 105;

		for (let i = 0; i < config.bets.length; i++) {
			let holder = new Phaser.GameObjects.Container(this.scene, btn_pos + step * i, 0);
			cont.add(holder);
			this.bet_buttons.push(holder);
			this.add_bet_btn(holder, config.bets[i]);
		}
		

		txt = new Phaser.GameObjects.Text(this.scene, 285, 0, 'You can win:', {fontFamily: "font1", fontSize: 34, color: this.color1, stroke: this.color2, strokeThickness: 4});
		txt.setOrigin(0.5);
		cont.add(txt);

		this.win_amount = 0;
		this.win_amount_txt = new Phaser.GameObjects.Text(this.scene, 435, 0, '0', {fontFamily: "font1", fontSize: 34, color: this.color1, stroke: this.color2, strokeThickness: 4});
		this.win_amount_txt.setOrigin(0.5);
		cont.add(this.win_amount_txt);

		this.win_icon = new Phaser.GameObjects.Image(this.scene, 390, 1, 'common1', 'coin');
		this.win_icon.scale = 0.8;
		cont.add(this.win_icon);

		this.update_bet_buttons(user_data.current_bet);
	},

	add_bet_btn(holder, bet_size) {
		holder.bet_size = bet_size;
		let btn = new CustomButton(this.scene, 0, 0, ()=> { this.select_bet(holder); }, 'common1', 'btn_bet_out', 'btn_bet_over', 'btn_bet_out', this, 1.2);
		holder.add(btn);
		holder.coin = new Phaser.GameObjects.Image(this.scene, -17, 1, 'common1', 'coin');
		holder.coin.scale = 0.7;
		holder.avail = true;
		btn.add(holder.coin);
		let txt = new Phaser.GameObjects.Text(this.scene, 18, 1, String(bet_size), {fontFamily: "font1", fontSize: 34, color: this.color1, stroke: this.color2, strokeThickness: 4});
		txt.setOrigin(0.5);
		btn.add(txt);
	},

	select_bet(holder) {
		let bet_size = holder.bet_size;
		if (bet_size > user_data.money) {
			this.show_no_money_tip(utils.toGlobal(holder, {x: 10, y: -10}));
		}
		else {
			this.update_bet_buttons(bet_size);
		}
	},

	update_bet_buttons(_bet_size) {
		let bet_size = _bet_size > user_data.money ? config.bets[0] : _bet_size;
		this.current_bet = bet_size;
		for (let btn of this.bet_buttons) {
			if (bet_size == btn.bet_size) {
				this.scene.tweens.add({targets: btn, alpha: 1, scale: 1.2, duration: 300});
			}
			else {
				this.scene.tweens.add({targets: btn, alpha: 0.8, scale: 1, duration: 300});
			}
		}

		this.win_amount = bet_size * config.win_rate;
		this.win_amount_txt.text = String(this.win_amount);

		if (this.current_bet != user_data.current_bet) {
			user_data.current_bet = this.current_bet;
			utils.save_user_data();
		}
	},

	show_no_money_tip(pt) {
		if (!this.no_money_tip) {
			this.no_money_tip = new Phaser.GameObjects.Container(this.scene, 0, 0);
			this.anim_holder.add(this.no_money_tip);
			let bg = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'tip_bg');
			bg.scale = 1.3;
			bg.setOrigin(0.2, 1);
			this.no_money_tip.add(bg);
			let txt = new Phaser.GameObjects.Text(this.scene, 47, -47, "You don't have enough money", {fontFamily: "font1", fontSize: 22, color: this.color1, stroke: this.color2, strokeThickness: 3
				,align: 'center', wordWrap:{'width': 160}});
			txt.setOrigin(0.5);
			txt.setLineSpacing(-4);
			this.no_money_tip.add(txt);
			this.no_money_tip.visible = false;
			bg.setInteractive();
			bg.on('pointerdown', ()=>{this.hide_tip();});
		}
		if (!this.no_money_tip.visible) {
			this.no_money_tip.visible = true;
			this.no_money_tip.alpha = 0;
			this.no_money_tip.x = pt.x;
			this.no_money_tip.y = pt.y;
			this.scene.tweens.add({targets: this.no_money_tip, alpha: 1, duration: 200});
			setTimeout(() => {
				this.hide_tip();
			}, 3000);
		}
	},

	hide_tip() {
		this.scene.tweens.add({targets: this.no_money_tip, alpha: 0, duration: 200, onComplete: ()=>{
			this.no_money_tip.visible = false;
		}});
	},

	show_reset_game(by_user = false) {
		if (!this.reset_overlay) {
			let txt;
			let cont = new Phaser.GameObjects.Container(this.scene, boot_data['W'] / 2, boot_data['H'] / 2);
			this.reset_overlay = cont;
			this.anim_holder.add(cont);
			cont.visible = false;
			let dark = new Phaser.GameObjects.Image(this.scene, 0, 0,'dark_overlay');
			dark.setInteractive();
			dark.alpha = 0.7;
			cont.add(dark);

			cont.casino = new Phaser.GameObjects.Container(this.scene, 0, 0);
			cont.add(cont.casino);

			txt = new Phaser.GameObjects.Text(this.scene, 0, -100, 'Sorry, the casino always wins...', {fontFamily: "font1", fontSize: 40, color: this.color1, stroke: this.color2, strokeThickness: 4});
			txt.setOrigin(0.5);
			cont.casino.add(txt);

			cont.reset1 = new CustomButton(this.scene, 0, 100, ()=>{ utils.reset_game(); }, 'common1', 'big_btn_out', 'big_btn_over', 'big_btn_out', this);
			cont.casino.add(cont.reset1);
			txt = new Phaser.GameObjects.Text(this.scene, 0, 0, 'New Game', {fontFamily: "font1", fontSize: 34, color: this.color1, stroke: this.color2, strokeThickness: 4});
			txt.setOrigin(0.5);
			cont.reset1.add(txt);

			cont.user_choice = new Phaser.GameObjects.Container(this.scene, 0, 0);
			cont.add(cont.user_choice);

			txt = new Phaser.GameObjects.Text(this.scene, 0, -100, 'Are you sure you want to restart the game?', {fontFamily: "font1", fontSize: 40, color: this.color1, stroke: this.color2, strokeThickness: 4});
			txt.setOrigin(0.5);
			cont.user_choice.add(txt);

			cont.reset2 = new CustomButton(this.scene, -200, 100, ()=>{ utils.reset_game(); }, 'common1', 'big_btn_out', 'big_btn_over', 'big_btn_out', this);
			cont.user_choice.add(cont.reset2);
			txt = new Phaser.GameObjects.Text(this.scene, 0, 0, 'Yes, restart', {fontFamily: "font1", fontSize: 34, color: this.color1, stroke: this.color2, strokeThickness: 4});
			txt.setOrigin(0.5);
			cont.reset2.add(txt);

			cont.reset2 = new CustomButton(this.scene, 200, 100, this.close_reset_overlay, 'common1', 'big_btn_out', 'big_btn_over', 'big_btn_out', this);
			cont.user_choice.add(cont.reset2);
			txt = new Phaser.GameObjects.Text(this.scene, 0, 0, 'No, cancel', {fontFamily: "font1", fontSize: 34, color: this.color1, stroke: this.color2, strokeThickness: 4});
			txt.setOrigin(0.5);
			cont.reset2.add(txt);

		}
		let cont = this.reset_overlay;
		cont.casino.visible = !by_user;
		cont.user_choice.visible = by_user;
		cont.alpha = 0;
		cont.visible = true;
		this.scene.tweens.add({targets: this.reset_overlay, alpha: 1, duration: 200});
	},

	reset_game() {
		this.update_bet_buttons(user_data.current_bet);
		this.update_money();
		this.attempts = user_data.attempts;
		this.wins = user_data.wins;
		this.round_result(false, true);
		if (this.reset_overlay) this.close_reset_overlay();
	},

	close_reset_overlay() {
		if (this.reset_overlay.visible) {
			this.scene.tweens.add({targets: this.reset_overlay, alpha: 0, duration: 200, onComplete: ()=>{
				this.reset_overlay.visible = false;
			}});
		}
	},

	prize_anims() {
		utils.fly_items_collect({'amount': parseInt(this.win_amount / 10),								
			'holder': this.anim_holder, 'item_atlas': 'common1', 'item_name': 'coin',
			'pt_start': utils.toGlobal(this.win_icon), 'pt_end': this.get_money_pt()}, 
		()=>{
				
		});
		this.update_money(500);
		utils.play_sound('add_coin', 500)
	}
});
