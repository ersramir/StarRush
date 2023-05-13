class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        // loading bar
        // see: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/loader/
        let loadingBar = this.add.graphics();
        this.load.on('progress', (value) => {
            loadingBar.clear();                                 // reset fill/line style
            loadingBar.fillStyle(0xFFFFFF, 1);                  // (color, alpha)
            loadingBar.fillRect(0, centerY, w * value, 5);  // (x, y, w, h)
        });
        this.load.on('complete', () => {
            loadingBar.destroy();
        });

        this.load.path = './assets/';
        // load graphics assets
        this.load.image('ShootingStar', 'img/ShootingStar(Player).png');
        this.load.image('Dots', 'img/Dots.png');
        this.load.image('BGStarRunner', 'img/BGStarRunner.png');
        this.load.image('Rock', 'img/Rock.png');
        this.load.spritesheet('StarAnime', 'img/StarAnime', 64, 32)
        // load audio assets
        this.load.audio('GameMusic', ['audio/GameMusic.mp3']);
        this.load.audio('StarTwinkle', ['audio/StarTwinkle.mp3']);
        this.load.audio('StarBreak', ['audio/StarBreak.mp3']);
        // load font
        this.load.bitmapFont('gem', 'font/gem.png', 'font/gem.xml');
    }

    create() {
        // check for local storage browser support
        if(window.localStorage) {
            console.log('Local storage supported');
        } else {
            console.log('Local storage not supported');
        }

        // go to Title scene
        this.scene.start('titleScene');
    }
}