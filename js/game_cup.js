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
