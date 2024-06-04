import './style.css';
import Phaser, { Physics } from 'phaser';


//dries up the code for canvas sizes.
const sizes = {
  width:500,
  height:500
};

const speedDown = 300;

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;  //essence of OOP in basic games
    this.cursor; //passed to create() and then movement defined
    this.playerSpeed = speedDown + 50; //defines how fast player can go
  }


  preload() {
    this.load.image("bg", "/assets/bg.png");
    this.load.image("basket", "/assets/basket.png");
  }
  create() {
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.player = this.physics.add.image(0, sizes.height - 100, "basket").setOrigin(0, 0); // size of canvas - 100, declare physics before .add
    this.player.setImmovable(true); //imparts the ability of body/sprite to not be knocked around by other sprites (turn on to see effects)

    this.player.body.allowGravity = false; //takes away effect of gravity from line 42

    this.cursor = this.input.keyboard.createCursorKeys();  //here we are assigning movement to the keys. 

  }
  update() {
    //Below we are going to define cursoe movement of the player, passing the player from the constructor
    const { left, right } = this.cursor; 
    // logic below defines player movement with conditional
    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }

  }
}

const config = {
  type:Phaser.WEBGL,
  width:sizes.width,
  height:sizes.height,
  canvas:gameCanvas,
  physics: {
    default:"arcade",
    arcade: {
      gravity: {y:speedDown},
    }
  },
  scene:[GameScene]
};

const game = new Phaser.Game(config);

