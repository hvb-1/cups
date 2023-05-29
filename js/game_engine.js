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
