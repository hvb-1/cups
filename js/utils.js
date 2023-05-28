class Utils {
	constructor(_scene){
        this.scene = _scene;
	}

	init() {
		this.sound_unpaused = 1;
		this.playing_sounds = [];
		this.sound_id = 0;
		this.create_overlay();
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
		this.update_volume();
	}

	update_volume() {
		for (let sound_obj in this.playing_sounds.length) {
			if (sound_obj['sound'].isPlaying) sound_obj['sound'].setVolume(this.sound_unpaused);
		}
	}

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

}