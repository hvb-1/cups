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
