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
		//fullscreen, sound btn

		this.create_assets();
	},

	create_assets() {

		this.holder = new Phaser.GameObjects.Container(this.scene, 0, 0);
		this.add(this.holder);

		for (let i = 0; i < config['cups_pos'].length; i++) {
			let cup = new GameCup(i);
			cup.emitter.on('EVENT', this.handler_event, this);
			this.cups.push(cup);
			this.holder.add(cup);
		}

		this.place_cups(true);

		this.overlay = new Phaser.GameObjects.Image(this.scene, 0, 0,'dark_overlay');
		this.add(this.overlay);
		this.overlay.alpha = 0.01;
		this.overlay.setInteractive();
		this.overlay.visible = false;
	},

	place_cups(quick = false, shuffle_times = 0, on_complete = null) {
		//let pos_copy = config['cups_pos'].slice();

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
			//console.log('anim_starts', shuffle_times)
			this.anim_all_cups(cups_pos, ()=>{
				shuffle_times -= 1;
				if (shuffle_times == 0 && on_complete) on_complete();
				else this.place_cups(quick, shuffle_times, on_complete);
			})
			//bringToTop(child)
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
			//console.log('aac', i, cup.current_pos)
			if (i != cup.current_pos) {
				let new_pos = config['cups_pos'][i];
				let points = [];
				points.push(new Phaser.Math.Vector2(cup.x, cup.y)); 
				if (cup.current_pos == 0) {
					points.push(new Phaser.Math.Vector2(new_pos.x + 100, new_pos.y - 70));
				}
				else if (cup.current_pos == 2) {
					points.push(new Phaser.Math.Vector2(new_pos.x - 100, new_pos.y + 70));
				}
				points.push(new Phaser.Math.Vector2(new_pos.x, new_pos.y));
				let curve = new Phaser.Curves.Spline(points);
//console.log('aac2=', points.length)
				let func = first_anim ? on_complete : null;
				first_anim = false;
				//let duration = Math.abs(cup.current_pos - i) > 1 ? 500 : 350
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
	},

	get_new_pos(quick = false) {
		let cups = this.cups// this.cups.slice();
		let pos1 = parseInt(Math.random() * cups.length);
		let cup = cups[pos1];
		
		let pos2 = parseInt(Math.random() * (cups.length - 1)) + 1;
		if (quick) pos2 = parseInt(Math.random() * cups.length);
		pos2 += pos1;
		if (pos2 >= cups.length) pos2 -= cups.length;

	//console.log('gnp', pos1, pos2)
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
		if (clicked_cup.ball) {
			clicked_cup.cup_over_anim();
			this.shuffle_next(clicked_cup, 300);
		}
		else {
			for (let cup of this.cups) {
				cup.cup_over_anim();
				if (!cup.is_up) cup.move_up();
			}
			setTimeout(() => {
				for (let cup of this.cups)
					if (cup != clicked_cup) cup.move_down();
				this.shuffle_next(clicked_cup);
			}, 500);
		}
		
	},

	shuffle_next(cup, delay = 0) {
		cup.move_down(()=> {
			//for (let cup of this.cups) cup.allow_click = false;
			if (cup.ball) this.place_cups(true);
			this.place_cups(false, config.shuffle_times, ()=>{
				this.overlay.visible = false;
				//for (let cup of this.cups) cup.allow_click = true;
			})
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
	
});
