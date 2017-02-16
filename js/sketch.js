var player;
var players = [];
var bg;
var playerSpeed = 6;
var cameraZoom = 1;
var i;
//scene size
var SCENE_W = 2000;
var SCENE_H = 2000;

function setup() {
  createCanvas(windowWidth, windowHeight);
  socket = io.connect('http://localhost:8080');
  socket.on('connection', function(){
    console.log('New connection');
  });

  socket.on('playerMovement', function(data){

    var exists = false;
    var index = null;

    for(var i = 0; i < players.length; i++){
      if(players[i].id == data.id){
        exists = true;
        index = i;
      }
    }

    if(exists){
      players[index].changePosition(data.x, data.y, data.dir);
      return;
    }

    players.push(new Player(data.id));

  });

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

  player = new Player;

}

function draw() {

  background(51);
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

// Function for sending to the socket
function sendPlayer(xpos, ypos) {
  // We are sending!
  console.log("sendmouse: " + xpos + " " + ypos);

  // Make a little object with  and y
  var data = {
    x: xpos,
    y: ypos
  };

  // Send that object to the socket
  socket.emit('mouse',data);
}
