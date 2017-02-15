//virtual camera
//move the mouse around
//the sprite follows the mouse but appears at the center of the sketch
//because the camera is following it

var player;
var bg;
var playerSpeed = 8;
//scene size
var SCENE_W = 2000;
var SCENE_H = 2000;

var goToPosition = {
  x: 0,
  y: 0
}


function setup() {
  createCanvas(windowWidth, windowHeight);

  bg = new Group();
  //create some background for visual reference
  for(var i=0; i<50; i++)
  {
    //create a sprite and add the 3 animations
    var rock = createSprite(random(-width, SCENE_W+width), random(-height, SCENE_H+height));
    //cycles through rocks 0 1 2
    rock.addAnimation("normal", "assets/rocks"+i%3+".png");
    bg.add(rock);
  }

  player = createSprite(400, 200, 50, 100);
  var myAnimation = player.addAnimation("floating", "assets/ghost_standing0001.png", "assets/ghost_standing0007.png");
  myAnimation.offY = 18;
  player.addAnimation("moving", "assets/ghost_walk0001.png", "assets/ghost_walk0004.png");

}

function draw() {
  background(255,255,255);
  camera.zoom = .5;

  if(keyIsDown(RIGHT_ARROW))
    player.setSpeed(playerSpeed, 0);
  if(keyIsDown(DOWN_ARROW))
    player.setSpeed(playerSpeed, 90);
  if(keyIsDown(LEFT_ARROW))
    player.setSpeed(playerSpeed, 180);
  if(keyIsDown(UP_ARROW))
    player.setSpeed(playerSpeed, 270);
  if(keyIsDown(DOWN_ARROW) && keyIsDown(RIGHT_ARROW))
    player.setSpeed(playerSpeed, 45);
  if(keyIsDown(DOWN_ARROW) && keyIsDown(LEFT_ARROW))
    player.setSpeed(playerSpeed, 135);
  if(keyIsDown(UP_ARROW) && keyIsDown(RIGHT_ARROW))
    player.setSpeed(playerSpeed, 315);
  if(keyIsDown(UP_ARROW) && keyIsDown(LEFT_ARROW))
    player.setSpeed(playerSpeed, 225);
  //set the camera position to the players position
  if (player.position.x > 0 && player.position.x < SCENE_W )
    camera.position.x = player.position.x;
  if (player.position.y > 0 && player.position.y < SCENE_H)
    camera.position.y = player.position.y;
    console.log(player.position.y)
  if(player.position.y > SCENE_H + 300 + windowHeight / 2)
    player.position.y = SCENE_H + 300 + windowHeight / 2;
    //camera.off();
  //if(player.position.x > SCENE_W)
    //player.position.x = SCENE_W;
    //camera.off();
  //if(player.position.y > SCENE_H)
    //player.position.y = SCENE_H;
    //camera.off();

  fill(255);
  noStroke();
  drawSprites();

  camera.off();
}

function keyReleased() {
  player.setSpeed(0, 0);
  return false;
}

function keyPressed(){
  if(keyCode == 32)
    console.log('dash');
}
