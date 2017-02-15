//virtual camera
//move the mouse around
//the sprite follows the mouse but appears at the center of the sketch
//because the camera is following it

var player;
var bg;
//scene size
var SCENE_W = 500;
var SCENE_H = 500;

var goToPosition = {
  x: 0,
  y: 0
}


function setup() {
  createCanvas(windowWidth, windowHeight);

  player = new Player;
  player.create();

  bg = new Group();

  //create some background for visual reference
  for(var i=0; i<80; i++)
  {
  //create a sprite and add the 3 animations
  var rock = createSprite(random(-width, SCENE_W+width), random(-height, SCENE_H+height));
  //cycles through rocks 0 1 2
  rock.addAnimation("normal", "assets/rocks"+i%3+".png");
  bg.add(rock);
  }

}

function draw() {
  background(255,255,255);

  //mouse trailer, the speed is inversely proportional to the mouse distance

  //a camera is created automatically at the beginning
  player.sprite.update();
  //.5 zoom is zooming out (50% of the normal size)
  //console.log(player.position.x);
  camera.zoom = .5;

  //set the camera position to the ghost position
  camera.position.x = player.position.x;
  camera.position.y = player.position.y;
  //console.log(player.position.x);
  //limit the ghost movements
  if(player.position.x < 0)
    player.position.x = 0;
  if(player.position.y < 0)
    player.position.y = 0;
  if(player.position.x > SCENE_W)
    player.position.x = SCENE_W;
  if(player.position.y > SCENE_H)
    player.position.y = SCENE_H;

  //draw the scene
  //rocks first
  drawSprites(bg);

  //shadow using p5 drawing
  noStroke();
  fill(0,0,0,20);

  //character on the top
  drawSprite(player.sprite);

  //I can turn on and off the camera at any point to restore
  //the normal drawing coordinates, the frame will be drawn at
  //the absolute 0,0 (try to see what happens if you don't turn it off
  camera.off();
}

function mouseClicked(){
  player.sprite.attractionPoint(1, mouseX, mouseY);
}
