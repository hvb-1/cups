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
		//this.game_holder = new Phaser.GameObjects.Container(this.scene, 0, 0);

		// game_data['utils'].create_loader();
		// game_data['utils'].loading(null, 200, true, true);
		// game_data['socialApi'].set_game_size();
		// game_data['utils'].add_orientation_notifier();
	}



	create_main_game(){
		
		this.bg_holder = new Phaser.GameObjects.Container(game_data['scene'], 0, 0);
		this.menu_holder = new Phaser.GameObjects.Container(game_data['scene'], 0, 0);
		this.bg_holder.zone_keys = {};
		if (first_bg_loaded) this.bg_holder.zone_keys[0] = 'zone1'
		this.bg_holder.current_bg = null
		game_data['bg_holder'] = this.bg_holder;
		game_data['scene'].add.existing(this.bg_holder);

		game_data['utils'].init(game_data['scene']);
		game_data['utils'].emitter.on('EVENT', this.handler_event, this);

		window.addEventListener("resize", ()=>{
			game_data['socialApi'].set_game_size();
		});
	
		game_data['audio_manager'].init();
	
	
		this.game_play = new GamePlay(game_data['scene']);
		this.game_play.visible = false;
		game_data['scene'].add.existing(this.game_play);


		game_data['utils'].create_loader();
		game_data['utils'].loading(null, 200, true, true);
		game_data['socialApi'].set_game_size();
		game_data['utils'].add_orientation_notifier();

		

		game_data['utils'].load_xmls_preloaded(()=>{
			game_request.create_server_request_loader();
			game_data['utils'].create_missclick();
			game_data['notification_manager'] = new NotificationManager();
			var lang = game_data['user_data']['lang'].toLowerCase();
			if (game_data['langs'].indexOf(lang) < 0) game_data['user_data']['lang'] = 'en';
			if (loading_vars['new_user']) {
				if (loading_vars['locale']) {
					lang = loading_vars['locale'].substring(0,2).toLowerCase();
					game_data['user_data']['lang'] = (game_data['langs'].indexOf(lang) < 0) ? 'en' : lang;
					game_request.request( {'select_language': true,'lang': game_data['user_data']['lang']},(obj)=> {});
				}
			}
			if (loading_vars['new_user']) game_request.update_stat({'funnel': true,  'description': 'create_game2'});
			this.game_map.visible = false;
			this.game_tutorial.visible = false;
			this.game_windows.visible = false;
			this.game_play.visible = false;
			game_data['utils'].init_tips();
			game_data['utils'].check_extended_levels();

			this.game_map.emitter.on('EVENT', this.handler_event, this);
			this.game_map.init({});
			this.game_windows.init({});
			game_data['utils'].init_timers();
			game_data['task_manager'] = new TaskManager();
			game_data['task_manager'].init();
			setTimeout(() => {
				this.game_play.init({}, ()=> {
					this.start_game();
				});
			}, 300);

			if (loading_vars['urls']['ads']) {
				let data = {'game_id': loading_vars['game_id'], 'net_id':loading_vars['net_id']};
				//let data = {'game_id': loading_vars['game_id'], 'net_id':'fb'};
				if (loading_vars['net_id'] === 'vk' && loading_vars['platform'] === 'ANDROID') data['mobile_app'] = 1

				$.ajax({
					type: 'post',
					url: loading_vars['urls']['ads'],
					data,
					success: (data)=> {
						var res = JSON.parse(data);
						if (res['success'] && 'more_games' in res) {
							game_data['more_games'] = res['more_games'];
						}
					}
				});
			}
		});
	}


	update(){
	}

	start_game() {
		game_data['utils'].check_pending_purchases();
		game_data['utils'].save_prev_boosters();
		game_data['utils'].load_grayscale_plugin();
		this.game_map.visible = true;
		this.game_tutorial.visible = true;
		this.game_windows.visible = true;
		this.game_play.visible = true;
		this.game_play.emitter.on('EVENT', this.handler_event, this);
		this.game_windows.emitter.on('EVENT', this.handler_event, this);
		this.game_tutorial.emitter.on('EVENT', this.handler_event, this);
		game_request.emitter.on('EVENT', this.handler_event, this);


		var timeout = standalone ? 10 : 200;
		setTimeout(() => {
			if (loading_vars['new_user']) game_request.update_stat({'funnel': true, 'description': 'show_map'});
			this.show_map({'start_game': true});
			setTimeout(() => {
				let time2 = game_data['init_scroll_to_centre'] ? 200 : 2000;
				setTimeout(() => {
					if (loading_vars['net_id'] == 'ig' && game_data['scene'].sys.game.device.os.desktop) game_data['socialApi'].set_game_size(this);
					game_data['utils'].set_spine_anim_holder(this.game_play.spine_holder);
					game_data['sales_manager'].init();
					game_data['utils'].loaded();
				}, time2)

				setTimeout(() => {
					game_data['utils'].check_rating_bonus();
					this.game_map.update_star_chest();
					game_data['utils'].preload_field_anims();		
				}, time2 + 300);

				setTimeout(() => {
					// if (loading_vars['net_id'] == 'ig') {
					// 	this.game_map.update_money(true);
					// 	this.game_play.update_money({'ig_init':true});
					// 	this.game_play.update_language();
					// 	this.game_map.update_language();
					// 	game_data['utils'].update_language();
					// }
					game_data['utils'].game_mode(true);
					this.game_windows.create_predefined_windows();
				}, time2 + 1000);
				game_data['utils'].create_user_photo(loading_vars['user_id'], (res)=> {})
			}, 500);
		}, timeout);
		setTimeout(() => { game_data['scene'].scale.refresh(); }, 1000);
		game_data['utils'].prepare_focus_events();
		game_data['scene'].input.on('pointerdown', ()=> {
			if ('unpaused' in game_data && game_data['unpaused'] == 0) {
				game_data['unpaused'] = 1;
				game_data['audio_manager'].update_volume();
			}
		}, this);

		// game_data['scene'].input.on('pointerupoutside', (pointer)=> {
			
		// }, this);

		if (get_passed_amount() > 20) {
			game_data['utils'].preload_interstitial_ad();
			game_data['utils'].preload_rewarded_ad();
		}

		//this.form_debug_info();
	}

	form_debug_info() {
		let arr = game.scene.renderer.supportedExtensions;
		let delay = 100;
		let val = '';
		for (let i = 0; i < arr.length; i++) {
			val += String(arr[i]) + '  ';
			if ((i + 1) % 10 == 0) {
				this.send_debug_info(val, delay);
				delay += 200;
				val = ''
			}
		}
		this.send_debug_info(val, delay);
	}

	send_debug_info(val, delay) {
		setTimeout(() => {
			game_request.update_stat({'entry_point': true , 'info': val });
		}, delay);
	}

	handler_event(params) {
		switch (params['event']) {
			case 'show_scene':
				this.show_scene(params)
				break;
			case 'show_window':
					if (!('money_pt' in params)) params['money_pt'] = this.game_map.get_money_pt();
					this.game_windows.show_window(params);
					if (!this.game_windows.pending_windows.length) {
						this.game_map.window_shown(params);
					}
				break;
			case 'window_closed':
				if (!this.game_windows.pending_windows.length) {
					this.game_map.window_closed();
					setTimeout(() => {
						game_data['utils'].resume_tip();
					}, 150);
				}
				this.game_map.check_delayed_prize();
				break;
			case 'update_money':
				this.game_map.update_money(params);
				this.game_play.update_money(params);
				break;
			case 'update_moneybox':
				this.game_map.update_moneybox(params);
				break;
			case 'add_extra_moves':
				this.game_play.add_extra_moves(params['amount']);
				break;
			case 'update_language':
				this.game_play.update_language();
				this.game_map.update_language();
				game_data['utils'].update_language();
				break;
			case 'destroy_level':
				this.game_play.destroy_level();
				break;
			case 'START_TUTORIAL':
				this.game_tutorial.start_tutorial(params);
				break;
			case 'UPDATE_TUTORIAL_STORY':
				this.game_tutorial.update_tutorial_story(params);
				break;
			case 'tutorial_finished':
				if (this.saved_scene_params) {
					this.show_gameplay(this.saved_scene_params)
					this.saved_scene_params = null;
				}
				this.game_map.tutorial_finished(params);
				this.game_play.tutorial_finished(params);
				setTimeout(() => {
					game_data['utils'].resume_tip();
				}, 150);
				break;
			case 'GAME_MODE_CHANGE':
				this.game_map.game_mode_change(params);
				this.game_play.game_mode_change(params);
				break;
			default:
				//console.log('Unknown event=',params['event'])
				break;
		}
	}

	show_scene(params) {
		switch (params['scene_id']) {
			case 'GAMEPLAY':
				this.show_gameplay(params)
				break;
			case 'MAP':
				this.show_map(params)
				break;
			default:
				break;
		}
	}

	show_gameplay(params) {
		let with_story = params['story'];
		if (with_story) {
			this.saved_scene_params = params;
			this.game_map.visible = false;
			this.game_play.alpha = 0;
			this.game_play.visible = true;
			game_data['utils'].loaded(()=> {
				this.game_tutorial.start_tutorial(with_story);
				this.saved_scene_params.skip_loaded = true;
				delete this.saved_scene_params.story;
			});
		}
		else {
			this.game_map.visible = false;
			this.game_play.visible = true;
			if (this.game_play.alpha < 1) game_data['scene'].tweens.add({targets: this.game_play, alpha: 1, duration: 300});
			if (params.skip_loaded) {
				this.game_play.start_level(params);
			}
			else game_data['utils'].loaded(()=> {

				this.game_play.start_level(params);
			});
		}
		game_data['map_manager'].pause_anims();
	}

	show_map(params) {
		this.game_map.show_map(params);
		this.game_map.visible = true;
		this.game_play.visible = false;
		if (!params['start_game']) game_data['map_manager'].resume_anims();
	}

/*
	report_error(msg, url, line, col, error) {
		var stack = error ? error.stack : 'no_stack';
		game_request.update_stat_error({'msg': msg, 'url': url, 'line': line, 'col': col, 'stack': stack});
	}
*/

}

