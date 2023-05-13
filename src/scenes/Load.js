class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        let loadingBar = this.add.graphics();
        this.load.on('progress', (value) => {
            loadingBar.clear();                                 
            loadingBar.fillStyle(0xFFFFFF, 1);                  
            loadingBar.fillRect(0, centerY, w * value, 5);  
        });
        this.load.on('complete', () => {
            loadingBar.destroy();
        });

        this.load.path = './assets/';
        this.load.image('ShootingStar', 'img/ShootingStar(Player).png');
        this.load.image('Dots', 'img/Dots.png');
        this.load.image('BGStarRunner', 'img/BGStarRunner.png');
        this.load.image('Rock', 'img/Rock.png');
        this.load.spritesheet('StarAnime', 'img/StarAnime', 64, 32)
        this.load.audio('GameMusic', ['audio/GameMusic.mp3']);
        this.load.audio('StarTwinkle', ['audio/StarTwinkle.mp3']);
        this.load.audio('StarBreak', ['audio/StarBreak.mp3']);
        this.load.bitmapFont('gem', 'font/gem.png', 'font/gem.xml');
    }

    create() {
        if(window.localStorage) {
            console.log('Local storage supported');
        } else {
            console.log('Local storage not supported');
        }

        this.scene.start('titleScene');
    }
}