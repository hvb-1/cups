/*

*/

var phaser_game;
var game = null;
var utils = null;
const landscape = true;
const boot_data = {
	'scene': null,
	'merged_js': false,
	'W': 1280,
	'H': 720,
}
const is_localhost = (location.hostname == '127.0.0.1' || location.hostname == 'localhost')


window.onload = function() {
	var elem = document.getElementById('preload');
	if (elem) elem.style.display = 'none';

	let init_config = {
		type: Phaser.WEBGL,
		parent: 'phaser_game',
		fullscreenTarget: 'phaser_game',
		width: boot_data['W'],
		height: boot_data['H'],
		backgroundColor: 0x000000,
		clearBeforeRender: true,
 		render: {
			powerPreference: 'high-performance'
 		},
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
		}
	};
	init_config['scene'] = mainGame;
	phaser_game = new Phaser.Game(init_config);
	window.focus();
}

class mainGame extends Phaser.Scene{
	constructor(){
		super("MainGame");
	}

	preload(){
		this.load.image('preload_bar', 'assets/preload_bar.png');
		this.load.image('preload_bg', 'assets/preload_bg.png');
		this.load.image('preload_bg2', 'assets/preload_bg2.png');

		this.load.once('complete', this.preload_files, this);
	}

	preload_files(on_complete){
		let loader = new Phaser.Loader.LoaderPlugin(this);
		
		boot_data['audio_library'] = {};
		let preload_sounds = [];
		// var preload_sounds = ['start_cards', 'coin_fly_add', 'wrong_click', 'get_star', 'break_pig', 'button_over', 'button_click', 'ice', 'correct_card',
		// 	'open_card', 'wrong_card', 'appear_pimp', 'level_complete', 'complete_window', 'bonus_use_undo', 'lock_open',
		// 	'level_cards_start', 'start_coin', 'coin_pig_finish', 'sequence_bonus', 'treasure_add', 'add_treasure_coins', 'prebooster_joker',
		// 	'5_cards_add', 'bonus_3cards', 'add_card', 'preb_streak', 'cards_appear', 'wrong_secret', 'arrow', 'target',
		// 	'combo1', 'combo2', 'combo3', 'combo4', 'combo5', 'combo6', 'combo7', 'combo8'
		// ]
		// for (let i = 0; i < preload_sounds.length; i++) {
		// 	loader.audio(preload_sounds[i], 'assets/audio/' + preload_sounds[i] + '.mp3');
		// }


		loader.atlas("common1", "assets/common1" + ".png" + '?' + assets_version, "assets/common1.json" + '?' + assets_version);
		loader.atlas("flares", "assets/flares.png" + '?' + assets_version, "assets/flares.json" + '?' + assets_version);
		loader.image('orientation_notifier', 'assets/orientation_notifier.png');
		loader.image('main_bg', 'assets/bg.jpg');

		if (boot_data['merged_js']) {
			loader.script('all', "./merged.js" + '?' + assets_version);
		}
		else {
			loader.script('main_game', "js/game.js");
			loader.script('config', "js/config.js");
			loader.script('utils', "js/utils.js");
			loader.script('game_cup', "js/game_cup.js");
			loader.script('game_engine', "js/game_engine.js");
			// loader.script('audio_manager', "game_utilities/audio_manager.js");
			// loader.script('game_utils', "game_utilities/game_utils.js");
			// loader.script('custom_button', "game_utilities/custom_button.js");
		
		}


		loader.on('progress', (value)=> {
			if (Math.round(value * 100) == 100) {
				loader.off('progress');
				if (this.preload_cont) this.preload_cont.visible = false;
			}
			else this.set_loading_progress(Math.floor(value * 100));
				
		});
		loader.once('complete', ()=> {
			this.set_loading_progress(100);
			for (let i = 0; i < preload_sounds.length; i++) {
				var sound_name = preload_sounds[i];
				if (this.cache.audio.exists(sound_name)) {
					var sound = this.sound.add(sound_name);
					loading_vars['audio_library'][sound_name] = {};
					loading_vars['audio_library'][sound_name]['sound'] = sound;
					sound.stop();
				}
			}
			this.create_game();
			loader.destroy();
		});
		loader.start();

	}

	set_loading_progress(val) {
		if (!this.preload_cont) {
			this.preload_cont = new Phaser.GameObjects.Container(this, boot_data['W']/2, boot_data['H']/2);
			this.add.existing(this.preload_cont);
			let txt = new Phaser.GameObjects.Text(this, 0, -25, '0%', {fontFamily:"font1", fontSize: 40, color:"#aaee66", stroke: '#000000', strokeThickness: 3});
			txt.setOrigin(0.5);
			this.preload_cont.add(txt);
			
			let bar = new Phaser.GameObjects.Image(this, 0, 19, 'preload_bar');
			let bg = new Phaser.GameObjects.Image(this, 0, 20, 'preload_bg');
			let top = new Phaser.GameObjects.Image(this, 0, 20, 'preload_bg2');
			bar.setOrigin(0, 0.5);
			bar.x = -bar.width / 2 + 5;
			bar.scaleX = 0.01;
			this.preload_cont.add(bg);
			this.preload_cont.add(bar);
			this.preload_cont.add(top);

			this.preload_cont.txt = txt;
			this.preload_cont.bar = bar;
		}
		this.preload_cont.txt = String(val) + '%';
		this.preload_cont.bar.scaleX = val / 100;
	}

	create_game() {
		boot_data['scene'] = this;
		game = new Game(this);
		game.prepare_game();
	}

	update(){
		//if (game) game.update();
	}
}


