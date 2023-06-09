class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    create() {
        if(localStorage.getItem('hiscore') != null) {
            let storedScore = parseInt(localStorage.getItem('hiscore'));
            if(level > storedScore) {
                localStorage.setItem('hiscore', level.toString());
                highScore = level;
                newHighScore = true;
            } else {
                highScore = parseInt(localStorage.getItem('hiscore'));
                newHighScore = false;
            }
        } else {
            highScore = level;
            localStorage.setItem('hiscore', highScore.toString());
            newHighScore = true;
        }

        if(newHighScore) {
            this.add.text(centerX, centerY - textSpacer, 'New Hi-Score!', { fontSize: 66, fill: '#797EF6'}).setOrigin(0.5);
        }
        this.add.text(centerX, centerY, `Dashed through space for ${level}s`, { fontSize: 50, fill: '#707EF6'}).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer, `Your best time: ${highScore}s`, { fontSize: 46, fill: '#097EF6'}).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer*2, `Press Space to Restart`, { fontSize: 46, fill: '#797E06'}).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer*3, `Visual Assets By: Eric Ramirez | Music/SFX from Pixabay`, { fontSize: 22, fill: '#790EF6'}).setOrigin(0.5);

        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
            let textureManager = this.textures;
            console.log(textureManager)
            this.game.renderer.snapshot((snapshotImage) => {
                console.log('took snapshot in GameOver')
                if(textureManager.exists('titlesnapshot')) {
                    textureManager.remove('titlesnapshot');
                }
                textureManager.addImage('titlesnapshot', snapshotImage);
            });

            this.scene.start('playScene');
        }
    }
}