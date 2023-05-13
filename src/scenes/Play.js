class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {
        this.barrierSpeed = -450;
        this.barrierSpeedMax = -3000;
        level = 0;
        this.extremeMODE = false;
        this.shadowLock = false;

        this.bgm = this.sound.add('GameMusic', { 
            mute: false,
            volume: 1,
            rate: 1,
            loop: true 
        });
        this.bgm.play();

        this.BGStarRunner = this.add.tileSprite(0, 0, 1024, 700 , 'BGStarRunner').setOrigin(0, 0);

        if (this.textures.exists('titlesnapshot')) {
            let titleSnap = this.add.image(centerX, centerY, 'titlesnapshot').setOrigin(0.5);
            this.tweens.add({
                targets: titleSnap,
                duration: 1,
                alpha: { from: 1, to: 0 },
                scale: { from: 1, to: 0 },
                repeat: 0
            });
        } else {
            console.log('texture error');
        }

        star = this.physics.add.sprite(32, centerY, 'ShootingStar').setOrigin(0.5);
        star.setCollideWorldBounds(true);
        star.setBounce(0);
        star.setImmovable();
        star.setMaxVelocity(0, 2000);
        star.setDragY(200);
        star.setDepth(1);            
        star.destroyed = false;       
        star.setBlendMode('SCREEN');  
        
        this.barrierGroup = this.add.group({
            runChildUpdate: true   
        });
        this.time.delayedCall(2500, () => { 
            this.addBarrier(); 
        });

        this.difficultyTimer = this.time.addEvent({
            delay: 1000,
            callback: this.levelBump,
            callbackScope: this,
            loop: true
        });

        cursors = this.input.keyboard.createCursorKeys();
    }

    addBarrier() {
        let speedVariance =  Phaser.Math.Between(0, 50);
        let barrier = new Barrier(this, this.barrierSpeed - speedVariance);
        barrier.setScale(3);
        this.barrierGroup.add(barrier);
    }

    update() {
        if(!star.destroyed) {
            if(cursors.up.isDown) {
                star.body.velocity.y -= starVelocity;
            } else if(cursors.down.isDown) {
                star.body.velocity.y += starVelocity;
            }
            this.physics.world.collide(star, this.barrierGroup, this.starCollision, null, this);
        }

        this.BGStarRunner.tilePositionX -= -7;  
        if(this.extremeMODE && !this.shadowLock && !star.destroyed) {
            this.spawnShadowstars();
            this.shadowLock = true;
            this.time.delayedCall(15, () => { this.shadowLock = false; })
        }
    }

    levelBump() {
        level++;

        if(level % 15 == 0) {
            this.sound.play('StarTwinkle', { volume: 0.5 });        
            if(this.barrierSpeed >= this.barrierSpeedMax) {    
                this.barrierSpeed -= 400;
                this.bgm.rate += 0.01;                         
            }
            
            let lvltxt01 = this.add.text(w, centerY, `☆彡${level}☆彡`, { fontSize: 72, fill: '#797EF6'}).setOrigin(0, 0.5);
            this.tweens.add({
                targets: [lvltxt01],
                duration: 1250,
                x: { from: w, to: 0 },
                alpha: { from: 0.9, to: 0 },
                onComplete: function() {
                    lvltxt01.destroy();
                }
            });
 
            let rndColor = this.getRandomColor();
            document.getElementsByTagName('canvas')[0].style.borderColor = rndColor;

            this.cameras.main.shake(100, 0.01);

        }
    }

    getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    spawnShadowstars() {
        let shadowstar = this.add.image(star.x, star.y, 'ShootingStar').setOrigin(0.5);
        shadowstar.scaleY = star.scaleY;           
        shadowstar.alpha = 0.5;                       
        this.tweens.add({ 
            targets: shadowstar, 
            alpha: { from: 0.5, to: 0 }, 
            duration: 750,
            ease: 'Linear',
            repeat: 0 
        });
        this.time.delayedCall(750, () => { shadowstar.destroy(); } );
    }

    starCollision() {
        star.destroyed = true;                   
        this.difficultyTimer.destroy();           
        this.sound.play('StarBreak', { volume: 0.50 }); 
        this.cameras.main.shake(2500, 0.0075);      
        
        this.tweens.add({
            targets: this.bgm,
            volume: 0,
            ease: 'Linear',
            duration: 2000,
        });

        let deathParticleManager = this.add.particles('Dots');
        let deathEmitter = deathParticleManager.createEmitter({
            alpha: { start: 1, end: 0 },
            scale: { start: 0.75, end: 0 },
            speed: { min: 550, max: 2000 },
            lifespan: 1000,
            blendMode: 'ADD'
        });

        let pBounds = star.getBounds();
        deathEmitter.setEmitZone({
            source: new Phaser.Geom.Rectangle(pBounds.x, pBounds.y, pBounds.width, pBounds.height),
            type: 'edge',
            quantity: 1000
        });

        deathEmitter.explode(1000);
        
        deathParticleManager.createGravityWell({
            x: pBounds.centerX + 200,
            y: pBounds.centerY,
            power: 0.5,
            epsilon: 100,
            gravity: 100
        });
        deathParticleManager.createGravityWell({
            x: centerX,
            y: centerY,
            power: 2,
            epsilon: 100,
            gravity: 550
        });
       
        star.destroy();    

        this.time.delayedCall(4000, () => { this.scene.start('gameOverScene'); });
    }
}