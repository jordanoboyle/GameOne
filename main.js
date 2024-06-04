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
  }


  preload() {
    this.load.image("bg", "/assets/bg.png");
    this.load.image("basket", "/assets/basket.png");
  }
  create() {
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.add.image(210, 420, "basket").setOrigin(0, 0); 
  }
  update() {}
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

