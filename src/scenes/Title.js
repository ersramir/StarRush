class Title extends Phaser.Scene {
    constructor() {
        super('titleScene');
    }

    preload() {
        // load image
        this.load.image('StarRushIntro', './assets/img/StarRushIntro.png');
    }

    create() {
        // add title screen text
        this.add.image(450, 340, 'StarRushIntro');
        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();  
    }

    update() {
        // check for UP input
        if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
            let textureManager = this.textures;
            // take snapshot of the entire game viewport
            // .snapshot(callback, type, encoderOptions)
            // the image is automatically passed to the callback
            this.game.renderer.snapshot((snapshotImage) => {
                // make sure an existing texture w/ that key doesn't already exist
                if(textureManager.exists('titlesnapshot')) {
                    textureManager.remove('titlesnapshot');
                }
                // take the snapshot img returned from callback and add to texture manager
                textureManager.addImage('titlesnapshot', snapshotImage);
            });
            
            // start next scene
            this.scene.start('playScene');
        }
    }
}