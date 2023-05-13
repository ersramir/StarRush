class Barrier extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity) {
        super(scene, game.config.width + starWidth, Phaser.Math.Between(starHeight/2, game.config.height - starHeight/2), 'Rock'); 
        
        this.parentScene = scene;               
        this.parentScene.add.existing(this);   
        this.parentScene.physics.add.existing(this);    
        this.setVelocityX(velocity);           
        this.setImmovable();                    
        this.newBarrier = true;                 
    }

    update() {
        if(this.newBarrier && this.x < centerX) {
            this.parentScene.addBarrier(this.parent, this.velocity);
            this.newBarrier = false;
        }

        if(this.x < -this.width) {
            this.destroy();
        }
    }
}