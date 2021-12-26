var player, obstacleGroup, pointsGroup;
var blastImg, cannonballImg, coinImage;
var coins = 4;
var obstacles = 5;
var score = 0;
var life = 1;
var displayScore, controls, instructions;
var backGroundMusic, blastSound, scoreSound;

var Start = 0, Play = 1, End = 2

var gameState = Start

function preload(){
  blastImg = loadImage("blast.png");
  cannonballImg = loadImage("cannonball.png");
  coinImage = loadImage("goldCoin.png");
  backGroundMusic = loadSound("background_music.mp3");
  blastSound = loadSound("cannon_explosion.mp3");
  scoreSound = loadSound("checkpoint.mp3");
}

function setup() {
  createCanvas(800,600);
  player = createSprite(400,400,18,18);
  player.shapeColor = "yellow";

  obstacleGroup = new Group();
  pointsGroup = new Group();
  
  displayScore = createElement("h2");
  controls = createElement("h2");
  instructions = createElement("h2");
}

function draw() {
  background(255,255,255);
  
 if(gameState === Start){
    player.visible = false;
    instructions.position(180,240);
    instructions.html("In this game, you will have to dodge the cannonballs and collect the coins")
    controls.position(200,380);
    controls.html("Use the arrow keys to move the player. Press 'Space' to start playing ")
    displayScore.position(-1000,-1000);

    if(keyDown("Space")){
      gameState = Play
    }
 }
 if(gameState === Play){
    background("Red")
    if(!backGroundMusic.isPlaying()){
      backGroundMusic.play();     
      backGroundMusic.setVolume(0.1);
  }
    player.visible = true;

    displayScore.position(60,20);
    instructions.position(-1000,-1000);
    controls.position(-1000,-1000);

    displayScore.html("Score: " + score)

    playerControls();
    
    newSprite(100, coinImage, 0.1, pointsGroup, 6);
    spriteCollision(coins,pointsGroup);

    newSprite(20, cannonballImg, 0.2, obstacleGroup, 4);
    spriteCollision(obstacles,obstacleGroup);
    
    if(life === 0 || score>=20){
      gameState = End
      
    }
 }

 if(gameState === End && frameCount%40 === 0){
      endGame();
 }

 if(gameState!== Play && gameState!== Start){
  if(keyDown("Enter")){
    gameState = Start;
    reset();
 }
 }

  drawSprites();
}

function newSprite(spawnRate,spriteImg,scale,spriteGroup,velocityY){
  if(frameCount%(spawnRate-score/2) === 0){
    var sprite = createSprite(random(10,790),0);
    sprite.addImage("spriteImg",spriteImg);
    sprite.lifetime = 400;
    sprite.velocityY = velocityY+score/5;
    sprite.scale = scale;
    spriteGroup.add(sprite);
  }
}

function spriteCollision(spriteType,spriteGroup){
  if(spriteGroup.collide(player) && life>0){
    if(spriteType === coins){
     score +=1;
     scoreSound.play();
    } else if(spriteType === obstacles) {
     life -= 1;
     blast = createSprite(player.x,player.y);
     blast.addImage("blast",blastImg);
     blast.scale = 0.3;
     blast.life = 20
     blastSound.play();
    }

    spriteGroup.destroyEach()
  }
}

function playerControls(){
   if(keyDown(UP_ARROW) && player.y>200){
       player.y -= 6
   }
   if(keyDown(DOWN_ARROW) && player.y<600){
       player.y += 6
   }
   if(keyDown(LEFT_ARROW) && player.x>0){
       player.x -= 6
   }
   if(keyDown(RIGHT_ARROW) && player.x<800){
       player.x += 6
   }
}



function endGame(){
  pointsGroup.destroyEach();
  pointsGroup.setLifeTimeEach = -1
  obstacleGroup.destroyEach();
  obstacleGroup.setLifeTimeEach = -1
  player.visible = false;
  if(life>0){
      controls.position(320,200)
      controls.html("YOU WON! THANKS FOR PLAYING");
      instructions.position(320,280);
      instructions.html("Press 'Enter' to play again")
  }else if(life === 0){
      instructions.position(300,200)
      instructions.html("YOU LOST. Press 'Space' to play again");
      displayScore.position(300,250);
      displayScore.html("Your Score: "+score)
  }
}

function reset(){
  score = 0;
  life = 1;
  pointsGroup.setLifeTimeEach = 400
  obstacleGroup.setLifeTimeEach = 400
}

