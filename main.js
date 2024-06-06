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

    //loading the target apple, playeer sprite acquire
    this.target;
  }


  preload() {
    this.load.image("bg", "/assets/bg.png");
    this.load.image("basket", "/assets/basket.png");
    this.load.image("apple", "/assets/apple.png");
  }
  create() {
    //SCENE 
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    
    //PLAYER SPRITES AND PHYSICS
    this.player = this.physics.add.image(0, sizes.height - 100, "basket").setOrigin(0, 0); // size of canvas - 100, declare physics before .add
    this.player.setImmovable(true); //imparts the ability of body/sprite to not be knocked around by other sprites (turn on to see effects)
    this.player.body.allowGravity = false; //takes away effect of gravity from line 42
    this.player.setCollideWorldBounds(true);  //Phaser library for specifics, but it applies collision physics to player (scene specific)
    this.cursor = this.input.keyboard.createCursorKeys();  //here we are assigning movement to the keys. 

    //TARGET SPRITES
    this.target = this.add.image(200, sizes.height - 400, "apple").setOrigin(0,0);



  }
  update() {
    //Below we are going to define curser movement of the player, passing the player from the constructor
    const { left, right, up, down } = this.cursor; //restricting the cursor to key strokes left and right
    // logic below defines player movement with conditional
    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else if (up.isDown) {
      this.player.setVelocityY(-this.playerSpeed);
    } else if (down.isDown) {
      this.player.setVelocityY(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
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

