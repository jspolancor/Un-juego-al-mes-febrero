var player;
var players = [];
var bg;
var playerSpeed = 6;
var cameraZoom = 1;
var i;
var currentUser = false;
//scene size
var SCENE_W = 3000;
var SCENE_H = 3000;

function setup() {

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

      currentUser = {
        nickname: user.displayName
      };

      console.log(currentUser);

      $('#modalRegister').modal('hide');
      $('#modalLogin').modal('hide');
    } else {
      // Show login register form
      $('#modalRegister').modal('toggle');
    }
  });

  createCanvas(windowWidth, windowHeight);
  socket = io.connect(location.href);

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

    players.push(new Player(data.id, data.nick));

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

  player = new Player(null, currentUser.nickname);

}

function draw() {

  player.nickname = currentUser.nickname;
  //console.log(currentUser.nickname);
  background(51);
  camera.zoom = cameraZoom;
  player.move();
  fill(255);
  noStroke();
  drawSprites();
  camera.off();

  for (var i = 0; i < players.length; i++) {

    if (players[i].nickname) {
      fill(255, 255, 255);
      textAlign(CENTER);
      textSize(10);
      text(players[i].nickname, players[i].sprite.position.x + 400, players[i].sprite.position.y + 200);
    }

  }

}

function keyReleased() {
  player.keyReleased();
}

function keyPressed(){
  if(keyCode == 32){
    player.dash();
  }
}
