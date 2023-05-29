// ######################################
// #### ../merged.js Version 1.0 ##############
// ######################################


// ############### /cygdrive/d/workflow/cups/hvb-1.github.io/js/action_manager.js
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
			//delayed game reset to be sure player see what happens
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
		//arrow related up to 80% win-rate, not 100% because for more fun max angle should be reachable 
		cont.min_rate = 0;
		cont.max_rate = 0.8;
		cont.min_angle = -80;
		cont.max_angle = 80;
		arrow.angle = cont.min_angle;
	},

	round_result(is_win, is_init = false) {
		let cont = this.win_rate_panel;
		if (!is_init) {//refactoring needed
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
		//options buttons slide up and down, reset_flag - true for last button
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
		setTimeout(() => {//some devices needs this delayed refresh
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
		//init update with last user bet
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
		//choose smallest bet in case user lacks of money for previously choosen bet after failed round
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

			//====== this windowed dialogue forced when player loose all money
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

			//====== this windowed dialogue forced when player click Restart button
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
// ############### /cygdrive/d/workflow/cups/hvb-1.github.io/js/config.js
﻿
const config = {
	'cups_pos': [{x: -120, y: -70}, {x: 0, y: 10}, {x: 120, y: 90}],
	'shuffle_times': 8,
	'bets': [10, 20, 50],
	'win_rate': 2,
	'use_local_storage': true,
	'reset_user_data': false,
};

const init_user_data = {
	'fullscreen': false,
	'sound': 1,
	'money': 100,
	'current_bet': 10,
	'attempts': 0,
	'wins': 0,
}
// ############### /cygdrive/d/workflow/cups/hvb-1.github.io/js/custom_button.js
var CustomButton = new Phaser.Class({
 
	Extends: Phaser.GameObjects.Container,   

	initialize:

	function CustomButton (scene, _x, _y, _click, _atlas, _out, _over, _down, _context, _scale = 1)
	{
		this.scene = scene;
		Phaser.GameObjects.Container.call(this, scene, 0, 0);        
		this.emitter = new Phaser.Events.EventEmitter();
		this.click = _click;
		this.was_down = false;
		this.text = null;
		this.out = new Phaser.GameObjects.Image(this.scene, 0, 0, _atlas, _out);
		this.over = new Phaser.GameObjects.Image(this.scene, 0, 0, _atlas, _over);
		this.down = new Phaser.GameObjects.Image(this.scene, 0, 0, _atlas, _down);
		this.out.setScale(_scale);
		this.over.setScale(_scale);
		this.down.setScale(_scale);
		this.add(this.out);
		this.add(this.over);
		this.add(this.down);
		this.x = _x;
		this.y = _y;
		this.out.setInteractive({useHandCursor: true});
		this.set_out();
		this.out.on('pointerdown', () => this.set_down() );
		this.out.on('pointerover', () => {
			this.set_over();
		});
		this.out.on('pointerout', () => { 
			this.set_out();
		});
		
		this.out.on('pointerup', () => {
			if (this.was_down) {
				this.set_over(false); 
				this.click.apply(_context, [this]); 
				this.was_down = false;
			}
			
		});
	},

	set_scale(x = 1, y = 1) {
		this.out.setScale(x, y);
		this.over.setScale(x, y);
		this.down.setScale(x, y);
	},

	set_handler(_click) {
		this.click = _click;
	},

	set_over(with_sound = true) {
		this.over.visible = true;
		this.down.visible = false;
		if (with_sound) utils.play_sound('button_over');
	},
	set_out() {
		this.over.visible = false;
		this.down.visible = false;
		this.was_down = false;
	},
	set_down() {
		this.over.visible = false;
		this.down.visible = true;
		this.was_down = true;
		utils.play_sound('button_click');
	},
  
});
// ############### /cygdrive/d/workflow/cups/hvb-1.github.io/js/game.js
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

// ############### /cygdrive/d/workflow/cups/hvb-1.github.io/js/game_cup.js
var GameCup = new Phaser.Class({

	Extends: Phaser.GameObjects.Container,

	initialize:

	function GameCup(_no, _anim_holder)
	{
		this.scene = boot_data['scene'];
		Phaser.GameObjects.Container.call(this, this.scene, 0, 0);
		this.emitter = new Phaser.Events.EventEmitter();
		this.no = _no;
		this.current_pos = _no;
		this.anim_holder = _anim_holder;
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

		if (this.no == 0) {//only first inited cup contains ball, let it be forever
			this.ball = new Phaser.GameObjects.Image(this.scene, 0, 10, 'common1', 'ball');
			this.ball_shadow = new Phaser.GameObjects.Image(this.scene, 0, 65, 'common1', 'ball');
			this.ball_shadow.setScale(1, 0.2);
			this.ball_shadow.alpha = 0;
			this.ball_shadow.d_alpha = 0.6;
			this.ball_shadow.postFX.addBlur(0, 0, 0, 2, 0x000000, 2);
			this.add(this.ball_shadow);
			this.add(this.ball);
			//ball copy will fly if player win, for more simple layers logic
			this.fly_cont = new Phaser.GameObjects.Container(this.scene, this.ball.x, this.ball.y);
			this.add(this.fly_cont);
			this.ball_for_fly = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'ball');
			this.fly_cont.add(this.ball_for_fly);
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
		this.scene.tweens.add({targets: this.main_cup, y: -140, duration: dur, onComplete: ()=>{
			this.allow_click = true;
			if (by_click) this.emitter.emit('EVENT', {'event': 'cup_click', 'instance': this});
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

	fly_ball(end_pt) {	
		this.ball.visible = false;
		let item = this.ball_for_fly;
		let pt = utils.toGlobal(item);
		this.anim_holder.add(item);
		item.x = pt.x;
		item.y = pt.y;
		item.visible = true;
		let dur = 1000;

		this.scene.tweens.add({targets: item, scale: 0.3, duration: dur, onComplete: ()=>{
			this.scene.tweens.add({targets: item, alpha: 0, duration: 100, onComplete: ()=>{
				item.x = 0;
				item.y = 0;
				item.scale = this.ball.scale;
				item.visible = false;
				item.alpha = 1;
				this.fly_cont.add(item);
				this.ball.visible = true;
			}});
		}});
		//randomize parcticle frame
		let colors = ['blue', 'green', 'yellow', 'white', 'red'];
		let color = colors[parseInt(Math.random() * colors.length)];
		let emit_zone = { 
			type: 'edge', 
			source: new Phaser.Geom.Circle(0, 0, item.displayWidth / 3), 
			quantity: 30 
		};
		
		let emitter = this.scene.add.particles(0, 0, 'flares', {
			frame: color,
			lifespan: 900,
			frequency: 30,
			quantity: 20,
			follow: item,
			emitZone: emit_zone,
			speedX: {min: -50, max: 50},
			speedY: {min: -210, max: 50},
			scale: { start: 0.1, end:  0.4 },
			alpha: {start: 1, end : 0.1},
			blendMode: 'ADD',
		});
		this.anim_holder.add(emitter);
		emitter.stop();
		emitter.start();
		

		let points = [];
		points.push(new Phaser.Math.Vector2(item.x, item.y)); 
		points.push(new Phaser.Math.Vector2(item.x - 140, item.y + 140)); 
		points.push(new Phaser.Math.Vector2(end_pt.x, end_pt.y)); 
		let curve = new Phaser.Curves.Spline(points);
		let tweenObject = { val: 0 };
		
		
		this.scene.tweens.add({targets: tweenObject, val: 1, duration: dur, ease: 'Sine.easeOut',
			onUpdate: (tween, target)=>{
				var position = curve.getPoint(target.val);
				item.x = position.x;
				item.y = position.y;
			},
			onComplete: ()=>{
				var position = curve.getPoint(1);
				item.x = position.x;
				item.y = position.y;
				if (emitter) {
					emitter.explode();
					emitter.stop();
					setTimeout(() => {
						emitter.destroy();
						emitter = null;
					}, 900);
				}
			}
		});
	}
});
// ############### /cygdrive/d/workflow/cups/hvb-1.github.io/js/game_engine.js
var GameEngine = new Phaser.Class({

	Extends: Phaser.GameObjects.Container,

	initialize:

	function GameEngine(pt)
	{
		this.scene = boot_data['scene'];
		Phaser.GameObjects.Container.call(this, this.scene, pt.x, pt.y);
		this.emitter = new Phaser.Events.EventEmitter();
	},

	init(params) {
		this.cups = [];
		this.score = 0;
		this.attempts = 0;
		this.anim_holder = params['anim_holder'];
		this.create_assets();
	},

	create_assets() {
		this.holder = new Phaser.GameObjects.Container(this.scene, 0, 0);
		this.add(this.holder);

		//stats overlay, options, bets
		this.action_manager = new ActionManager(this.anim_holder);
		this.action_manager.alpha = 0;
		this.add(this.action_manager);

		for (let i = 0; i < config['cups_pos'].length; i++) {
			let cup = new GameCup(i, this.anim_holder);
			cup.visible = false;
			cup.emitter.on('EVENT', this.handler_event, this);
			this.cups.push(cup);
			this.holder.add(cup);
		}
		//game locking while shuffle
		this.overlay = new Phaser.GameObjects.Image(this.scene, 0, 0,'dark_overlay');
		this.add(this.overlay);
		this.overlay.alpha = 0.01;
		this.overlay.setInteractive();
		this.overlay.visible = false;
		
		setTimeout(() => {
			this.init_show();
		}, 300);	
	},

	init_show() {
		this.place_cups(true);
		for (let i = 0; i < this.cups.length; i++) {
			let cup = this.cups[i];
			cup.dy = cup.y;
			cup.y = 500 * (Math.random() > 0.5 ? 1 : -1);
			cup.visible = true;
			let delay = 100 + i * 300;
			utils.play_sound('init_box', delay);
			this.scene.tweens.add({targets: cup, y: cup.dy, delay: delay, duration: 600, ease: 'Back.easeOut'});
		}
		this.scene.tweens.add({targets: this.action_manager, alpha: 1, delay: 700, duration: 300});
		
	},

	place_cups(quick = false, shuffle_times = 0, on_complete = null) {
		let cups_pos = this.get_new_pos(quick);
		if (quick) {
			for (let i = 0; i < cups_pos.length; i++) {
				cup = cups_pos[i];
				cup.x = config['cups_pos'][i].x;
				cup.y = config['cups_pos'][i].y;
				cup.current_pos = i;
			}
			this.reorder_cup_layers();
		}
		else if (shuffle_times > 0){
			this.anim_all_cups(cups_pos, ()=>{
				shuffle_times -= 1;
				if (shuffle_times == 1) this.action_manager.prepare_next_round();
				
				if (shuffle_times == 0 && on_complete) {
					utils.play_sound('next_round');
					on_complete();
				}
				else this.place_cups(quick, shuffle_times, on_complete);
			})
		}
	},

	reorder_cup_layers() {
		for (let i = 0; i < this.cups.length; i++)
			this.holder.bringToTop(this.cups[i]);
	},

	anim_all_cups(cups, on_complete) {
		let first_anim = true;
		for (let i = 0; i < cups.length; i++) {
			let cup = cups[i];
			if (i != cup.current_pos) {
				let new_pos = config['cups_pos'][i];
				let points = [];
				points.push(new Phaser.Math.Vector2(cup.x, cup.y)); 
				//simple 2-points movement for middle cup
				if (cup.current_pos == 0) {
					points.push(new Phaser.Math.Vector2(new_pos.x + 100, new_pos.y - 70));
				}
				else if (cup.current_pos == 2) {
					points.push(new Phaser.Math.Vector2(new_pos.x - 100, new_pos.y + 70));
				}
				points.push(new Phaser.Math.Vector2(new_pos.x, new_pos.y));
				let curve = new Phaser.Curves.Spline(points);
				let func = first_anim ? on_complete : null;
				first_anim = false;
				this.curve_anim(cup, curve, cup.current_pos == 1 ? 50 : 0, func);
				cup.current_pos = i;
			}
		}
		for (let i = 0; i < cups.length; i++) {
			cups[i].current_pos = i;
		}
	},

	curve_anim(item, curve, delay = 0, on_complete = null, base_duration = 350) {
		let duration = base_duration - delay;
		let tweenObject = { val: 0 };
		let reorder = on_complete != null;
		this.scene.tweens.add({targets: tweenObject, val: 1, duration: duration, delay: delay, ease: 'Sine.easeOut',
			onUpdate: (tween, target)=>{
				var position = curve.getPoint(target.val);
				item.x = position.x;
				item.y = position.y;
				//pseudo 3d needs
				if (reorder && target.val >= 0.5) {
					reorder = false;
					this.reorder_cup_layers();
				}
			},
			onComplete: ()=>{
				var position = curve.getPoint(1);
				item.x = position.x;
				item.y = position.y;
				if (on_complete) setTimeout(() => {
					on_complete();
				}, 20);
			}
		});
		utils.play_sound('woosh', delay);
	},

	//new positions after shuffle
	get_new_pos(quick = false) {
		let cups = this.cups;
		let pos1 = parseInt(Math.random() * cups.length);
		let cup = cups[pos1];
		
		let pos2 = parseInt(Math.random() * (cups.length - 1)) + 1;
		if (quick) pos2 = parseInt(Math.random() * cups.length);
		pos2 += pos1;
		if (pos2 >= cups.length) pos2 -= cups.length;

		cups[pos1] = cups[pos2]
		cups[pos2] = cup;
		this.cups = cups;
		return cups;
	},

	cup_click(params) {
		let clicked_cup = params['instance'];
		if (this.previous_cup) this.previous_cup.move_down()
		this.previous_cup = clicked_cup;
		this.overlay.visible = true;
		let will_reset = this.action_manager.round_result(clicked_cup.ball); //if returns true - zero money(casino wins) case
		if (clicked_cup.ball) {
			clicked_cup.cup_over_anim();
			clicked_cup.fly_ball(this.action_manager.get_fly_ball_pt());
			this.shuffle_next(clicked_cup, 300);
			utils.play_sound('round_win');
		}
		else {
			//shows where is the ball before shuffle
			for (let cup of this.cups) {
				cup.cup_over_anim();
				if (!cup.is_up) cup.move_up();
			}
			setTimeout(() => {
				for (let cup of this.cups)
					if (cup != clicked_cup) cup.move_down();
				this.shuffle_next(clicked_cup, 0, will_reset);
			}, 500);
			utils.play_sound('round_fail');
		}
	},

	shuffle_next(cup, delay = 0, will_reset = false) {
		cup.move_down(()=> {
			if (cup.ball) this.place_cups(true); //quick ball placing if player win last round
			//just couple shuffles because of reset window appears
			let total_shuffles = will_reset ? Math.ceil(config.shuffle_times / 4) : config.shuffle_times;
			this.place_cups(false, total_shuffles, ()=>{
				this.overlay.visible = false;
			});
		}, delay);
	},

	handler_event(params) {
		switch (params['event']) {
			case 'cup_click':
				this.cup_click(params);
				break;
			case 'cup_down':
				if (this.previous_cup == params['instance'])
					this.previous_cup = null;
				break;
			default:
				console.log('Unknown event:', params['event'])
				break;
		}
	},

	reset_game() {
		this.action_manager.reset_game();
	}
	
});
// ############### /cygdrive/d/workflow/cups/hvb-1.github.io/js/utils.js
class Utils {
	constructor(_scene){
        this.scene = _scene;
		this.emitter = new Phaser.Events.EventEmitter();
	}

	init() {
		this.sound_unpaused = user_data.sound;
		this.playing_sounds = [];
		this.sound_id = 0;
		this.create_overlay();
		if (user_data.money <= 0) this.reset_game();
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

	stop_tweens(arr) {
		for (let item of arr) {
			if (this.scene.tweens.isTweening(item)) 
				this.scene.tweens.killTweensOf(item);
		}
	}

	create_overlay() {
		var rect = new Phaser.Geom.Rectangle(0, 0, boot_data['W'], boot_data['H']);
		var graphics = this.scene.add.graphics({ fillStyle: { color: 0x000000, alpha: 1 } })
		graphics.fillRectShape(rect);
		graphics.generateTexture('dark_overlay', boot_data['W'], boot_data['H']);
		graphics.destroy();
	}

	toLocal(container, pt) {
		var containers = [];
		var parent_contaiter = container;
		var holder;
		if (!pt) pt = {x: 0, y: 0};
		var new_pt = new Phaser.Geom.Point(pt.x, pt.y);

		while (parent_contaiter && parent_contaiter != this.scene) {
			containers.push(parent_contaiter);
			parent_contaiter = parent_contaiter.parentContainer;
		}

		while(containers.length > 0) {
			holder = containers.pop();
			new_pt.x = (new_pt.x - holder.x) / holder.scaleX;
			new_pt.y = (new_pt.y - holder.y) / holder.scaleY;
		}

		 return new_pt;
	}

	toGlobal(container, pt = {x:0, y:0}) {
		if (!pt) pt = {x:0, y:0}
		let new_pt = new Phaser.Geom.Point(pt.x, pt.y);

		var parent_contaiter = container;
		while (parent_contaiter && parent_contaiter != this.scene) {
				new_pt.x = new_pt.x * parent_contaiter.scaleX + parent_contaiter.x;
				new_pt.y = new_pt.y * parent_contaiter.scaleY + parent_contaiter.y;
				parent_contaiter = parent_contaiter.parentContainer;
		}
		return new_pt;
	}

	add_orientation_notifier() {
		if (this.scene.sys.game.device.os.desktop) {}
		else {
			//appears at mobile devices in portrait position
			let cont = new Phaser.GameObjects.Container(this.scene, 0, 0);
			this.scene.add.existing(cont);
			this.orientation_notifier = cont;
			cont.visible = false;
			cont.allow_show = true;

			let bg = new Phaser.GameObjects.Image(this.scene, 0, 0,'dark_overlay');
			bg.setOrigin(0);
			cont.add(bg)
			bg.setInteractive();
			bg.on('pointerup', ()=> {
				this.hide_orientation_notifier(cont);
				cont.allow_show = false;
			}, this)
			
			let img = new Phaser.GameObjects.Image(this.scene, boot_data['W']/2, boot_data['H']/2, 'orientation_notifier');
			cont.add(img)
			
			window.onresize = ()=>{
				if (window.innerWidth > window.innerHeight){
					this.hide_orientation_notifier(cont);
				}
				else if (cont.allow_show){
					this.show_orientation_notifier(cont);
				}
			};
			if (window.innerWidth < window.innerHeight) this.show_orientation_notifier(cont);
		}
	}

	show_orientation_notifier(cont) {
		cont.alpha = 0;
		cont.visible = true;
		this.scene.tweens.add({targets: cont, alpha: 1, duration: 400});
	}

	hide_orientation_notifier(cont) {
		cont.visible = false;
	}

	switch_sound_volume() {
		this.sound_unpaused = 1 - this.sound_unpaused;
		user_data.sound = this.sound_unpaused;
		this.update_volume();
		this.save_user_data();
	}

	update_volume() {
		for (let sound_obj in this.playing_sounds.length) {
			if (sound_obj['sound'].isPlaying) sound_obj['sound'].setVolume(this.sound_unpaused);
		}
	}
	//part of audio manager, extendable for for different audio kind and types, ex.: music, ambience
	play_sound(sound_name, delay = 0) {
		let sound = null;
		var vol = this.sound_unpaused;
		var config = {'volume':vol};
		let sound_obj = boot_data['audio_library'][sound_name];
		let in_library = sound_obj && 'sound' in sound_obj;
		
		if (in_library || this.scene.cache.audio.exists(sound_name)) {
			if (in_library) sound = boot_data['audio_library'][sound_name]['sound'];
			else sound = this.scene.sound.add(sound_name);
			
			if (sound) {
				setTimeout(() => {
					this.add_playing_sound(sound_name, sound, config);
				}, delay);
			}
			
		}
		else if (navigator.onLine) {
			var dir_url = './assets/audio/';
			var loader = new Phaser.Loader.LoaderPlugin(this.scene);
			loader.audio(sound_name, dir_url + sound_name + '.mp3');
			loader.once('complete', ()=>{
				if (this.scene.cache.audio.exists(sound_name)) {
					sound = this.scene.sound.add(sound_name);
					if (sound) {
						boot_data['audio_library'][sound_name] = {};
						boot_data['audio_library'][sound_name]['sound'] = sound;	
						setTimeout(() => {
							this.add_playing_sound(sound_name, sound, config);
						}, delay);
					}
				}
				loader.destroy();
			});
			loader.start();
		}
	}

	add_playing_sound(sound_name, sound, config) {
		this.sound_id++;
		let sound_id = this.sound_id;
		this.playing_sounds.push({
			'sound': sound,
			'sound_id': this.sound_id,
			'sound_name': sound_name,
		});
		sound.play(config);
		sound.once('stop', ()=>{
			for (var i = 0; i < this.playing_sounds.length; i++)
				if (this.playing_sounds[i]['sound_id'] == sound_id) {
					this.playing_sounds.splice(i, 1);
					break;
				}
		});	
	}

	save_user_data() {
		if (config['use_local_storage']) {
			localStorage.setItem(boot_data['game_id'], JSON.stringify(user_data));
		}
	}

	reset_game() {
		user_data.money = init_user_data.money;
		user_data.current_bet = init_user_data.current_bet;
		user_data.attempts = 0;
		user_data.wins = 0;
		this.emitter.emit('EVENT', {'event': 'reset_game'});
	}

	//for prize claiming anims
	fly_items_collect(params, on_complete) {
		let amount = params['amount'];
		let delay = 30;			

		for (let i = 0; i < amount; i++) {
			let func = (i == amount - 1) ? on_complete : null;
			this.show_moving_item_collect(params, delay * i, func);
		}
	}

	get_collect_pt_mid(pt) {
		let angle_min = 220;
		let angle_max = 350;
		let angle = parseInt(Math.random() * (angle_max - angle_min) + angle_min)
		let dist_min = 50;
		let dist_max = 150;
		let dist = parseInt(Math.random() * (dist_max - dist_min) + dist_min)
		let pt_mid = new Phaser.Geom.Point(pt.x + Math.cos(Math.PI / 180 * angle) * dist, pt.y + Math.sin(Math.PI / 180 * angle) * dist);
		return pt_mid;
	}

	show_moving_item_collect(params, delay, on_complete = null) {
		let delay2 = 60 + parseInt(Math.random() * 40);
		let item_atlas = params['item_atlas'];
		let item_name = params['item_name'];
		let holder = params['holder'];
		let pt_start = this.toLocal(holder, params['pt_start']);
		let pt_end = this.toLocal(holder, params['pt_end']);

		let item = new Phaser.GameObjects.Image(this.scene, 0, 0, item_atlas, item_name);
		item.x = pt_start.x;
		item.y = pt_start.y;
		if (holder && holder.scene) {
			holder.add(item);
			let pt_mid = this.get_collect_pt_mid(pt_start);
			this.scene.tweens.add({targets: item, delay: delay, ease: "Sine.easeOut", x: pt_mid.x, y: pt_mid.y, duration: 150, onComplete: ()=>{
				this.scene.tweens.add({targets: item, delay: delay2, ease: "Sine.easeInOut", x: pt_end.x, y: pt_end.y, duration: 500, onComplete: ()=>{
					item.destroy();
					if (on_complete) on_complete();
				}});
			}});

		}		
}

}// ############### End of  ../merged.js (  7  files added)
