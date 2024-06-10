import './style.css';
import Phaser, { Physics, Time } from 'phaser';



//dries up the code for canvas sizes.
const sizes = {
  width:500,
  height:500
};

const speedDown = 300;

// const gameStartDiv = document.querySelector("#gameStartDiv");
// const gameStartButton = document.querySelector("#gameStartButton");
// const gameEndDiv = document.querySelector("#gameEndDiv");
// const gameWinLoseSpan = document.querySelector("#gameWinLoseSpan");
// const gameEndScoreSpan = document.querySelector("#gameEndScoreSpan");

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene");
    this.player;  //essence of OOP in basic games
    this.cursor; //passed to create() and then movement defined
    this.playerSpeed = speedDown + 100; //defines how fast player can go

    //loading the target apple, playeer sprite acquire
    this.target;

    //We need a variable to handle collisions and points
    this.points = 0;

    // Loading some UI situations
    this.textScore;

    //timer 
    this.textTime;
    this.timedEvent;
    this.remainingTime;

    //music rendering (must be added to the create function)
    this.coinMusic;
    this.backGroundMusic;

    //Particle textures
    this.emitter;

  }


  preload() {
    this.load.image("bg", "/assets/bg.png");
    this.load.image("basket", "/assets/basket.png");
    this.load.image("apple", "/assets/apple.png");
    this.load.image("money", "/assets/money.png");
    this.load.audio("coin", "/assets/coin.mp3");
    this.load.audio("bgMusic", "/assets/bgMusic.mp3");
  }

  create() {

    this.scene.pause("scene-game");

    //Music
    this.coinMusic = this.sound.add("coin");
    this.backGroundMusic = this.sound.add("bgMusic");
    this.backGroundMusic.play();
    // this.backGroundMusic.stop();  //AN OPTION TO STOP THE MUSIC, THIS COULD BE TIED TO A BUTTON PRESS
    //SCENE 
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    
    //PLAYER SPRITES AND PHYSICS
    this.player = this.physics.add.image(0, sizes.height - 100, "basket").setOrigin(0, 0); // size of canvas - 100, declare physics before .add
    this.player.setImmovable(true); //imparts the ability of body/sprite to not be knocked around by other sprites (turn on to see effects)
    this.player.body.allowGravity = false; //takes away effect of gravity from line 42
    this.player.setCollideWorldBounds(true);  //Phaser library for specifics, but it applies collision physics to player (scene specific)
    // this.player.setSize(80, 15).setOffset(10, 70);

    this.player.setSize(this.player.width - this.player.width / 4, this.player.height / 6).setOffset(this.player.width / 10, this.player.height - this.player.height / 10);  // setOffset() sets the size of the physics body,  setSize() sets the display of the game object
    // 500 - 125 = 375, 500/6 = 83.3  setOffSet 50, 450)
    
    
    //TARGET SPRITES
    //this set up allows for readability, adjustment
    this.target = this.physics.add
      .image(200, sizes.height - 400, "apple")
      .setOrigin(0,0)
      .setMaxVelocity(0, speedDown + 50); //stops the target from "falling" continuously faster
      
    //This get's technical even for a simple game. Refer to notes for in depth: also hase to come after .target being defined
    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this);

    this.cursor = this.input.keyboard.createCursorKeys();  //here we are assigning movement to the keys. 

    // this will render the score within the game scene itself. At this point we are just rendering the score. 
    //Phaser recommends rendering the score with html
    this.textScore = this.add.text(sizes.width - 120, 10, "Score: 0", {
      font: "25px Arial",
      fill: "#000000"
    });
    // This will pass in the coordinates of where the score should be located. 

    //Producing the ability to draw a time counter:  Notice here we changed where we rendered it. (try changing the render location to bottom)
    this.textTime = this.add.text(10, 10, "Remaining Time: 00", {
      font: "18px Arial",
      fill: "#000000"
    });

    this.timedEvent = this.time.delayedCall(30000, this.gameOver(), [], this);

    this.emitter = this.add.particles(0, 0, "money", {
      speed: 100,
      gravityY: speedDown - 200,
      scale: 0.04,
      duration: 100,
      emitting: false //you want this at false so you can call this effect when wantted. 
    });
    this.emitter.startFollow(this.player, this.player.width / 2, this.player.height / 2, true); // here we are targeting the player with a follow function attached to the player. 
  }


  update() {
    this.remainingTime = this.timedEvent.getRemainingSeconds();  //allow us to get time remaining in seconds until timer runs out ang gameover runs

    this.textTime.setText(`Remaining time: ${Math.round(this.remainingTime).toString()}`);
    
    //APPLE LOGIC CONTROLLING SPEED
    if (this.target.y >= sizes.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX()); //here we are saying pick a random number on Xaxis to return to
    }
    
    
    //PLAYER CONTROLS, passing the player from the constructor
    const { left, right, up, down } = this.cursor; //restricting the cursor to key strokes left and right
    // logic below defines player movement with conditional
    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
    }      
  }
   
  // must be declared outside the update function, but within the class. 
  getRandomX() {
    return Math.floor(Math.random() * 480);
  } 

  //This function handles collisions between basket and apple...resets Ycoord to 0, calls getRandomX to set Xcoord point
  targetHit () {
    this.coinMusic.play();  //plays the coin music on collision
    this.emitter.start(); //we need the emitter to follow the player
    this.target.setY(0);
    this.target.setX(this.getRandomX()); //when hit, recycle apple to top of screen
    this.points++; //Does this look familiar?
    this.textScore.setText(`Score: ${this.points}`); // notice the back ticks where we are updating the score dynamically
  }

  gameOver () {
    console.log("game over");
  }
}
const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default:"arcade",
    arcade: {
      gravity: {y:speedDown},
    }
  },
  scene:[GameScene]
};

const game = new Phaser.Game(config);



