var player;
var bg;
var playerSpeed = 8;
var cameraZoom = 1;
//scene size
var SCENE_W = 2000;
var SCENE_H = 2000;

function setup() {
  createCanvas(windowWidth, windowHeight);

  bg = new Group();
  //create some background for visual reference
  for(var i=0; i<100; i++)
  {
    var rock = createSprite(random(-width, SCENE_W+width), random(-height, SCENE_H+height));
    rock.addAnimation("normal", "assets/rocks"+i%3+".png");
    bg.add(rock);
  }

  player = new Player;

}

function draw() {

  background(255,255,255);
  camera.zoom = cameraZoom;
  player.move();
  fill(255);
  noStroke();
  drawSprites();
  camera.off();

}

function keyReleased() {
  player.keyReleased();
}

function keyPressed(){
  if(keyCode == 32){
    player.dash();
  }
}
