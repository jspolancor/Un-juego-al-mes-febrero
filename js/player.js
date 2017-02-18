function Player (id, nickname) {

  this.id = null;
  this.nickname = null;

  if(id != null){
    this.id = id;
  }

  if(nickname != null){
    this.nickname = nickname;
  }
  this.bulletImage = loadImage("assets/bullet.png");
  this.direction = 9;

  this.sprite = createSprite(400, 200, 100, 100);
  this.sprite.addAnimation("standing", "assets/player/player02.png");
  this.sprite.addAnimation("moving-up", "assets/player/player19.png", "assets/player/player24.png");
  this.sprite.addAnimation("moving-down", "assets/player/player01.png", "assets/player/player06.png");
  this.sprite.addAnimation("moving-left", "assets/player/player07.png", "assets/player/player12.png");
  this.sprite.addAnimation("moving-right", "assets/player/player13.png", "assets/player/player18.png");
  this.sprite.addAnimation("moving-up-right", "assets/player/player43.png", "assets/player/player48.png");
  this.sprite.addAnimation("moving-up-left", "assets/player/player37.png", "assets/player/player42.png");
  this.sprite.addAnimation("moving-down-left", "assets/player/player30.png", "assets/player/player25.png");
  this.sprite.addAnimation("moving-down-right", "assets/player/player31.png", "assets/player/player36.png");

  // Move the player around
  this.move = function(){
    if(keyIsDown(RIGHT_ARROW)){
      this.sprite.setSpeed(playerSpeed, 0);
      this.sprite.changeAnimation('moving-right');
      this.sendPlayerData(3, false);
      this.direction = 0;
    }

    if(keyIsDown(DOWN_ARROW)){
      this.sprite.setSpeed(playerSpeed, 90);
      this.sprite.changeAnimation('moving-down');
      this.sendPlayerData(5, false);
      this.direction = 90;
    }

    if(keyIsDown(LEFT_ARROW)){
      this.sprite.setSpeed(playerSpeed, 180);
      this.sprite.changeAnimation('moving-left');
      this.sendPlayerData(7, false);
      this.direction = 180;
    }

    if(keyIsDown(UP_ARROW)){
      this.sprite.setSpeed(playerSpeed, 270);
      this.sprite.changeAnimation('moving-up');
      this.sendPlayerData(1, false);
      this.direction = 270;
    }

    if(keyIsDown(DOWN_ARROW) && keyIsDown(RIGHT_ARROW)){
      this.sprite.setSpeed(playerSpeed, 45);
      this.sprite.changeAnimation('moving-down-right');
      this.sendPlayerData(4, false);
      this.direction = 45;
    }

    if(keyIsDown(UP_ARROW) && keyIsDown(RIGHT_ARROW)){
      this.sprite.setSpeed(playerSpeed, 315);
      this.sprite.changeAnimation('moving-up-right');
      this.sendPlayerData(2, false);
      this.direction = 315;
    }

    if(keyIsDown(DOWN_ARROW) && keyIsDown(LEFT_ARROW)){
      this.sprite.setSpeed(playerSpeed, 135);
      this.sprite.changeAnimation('moving-down-left');
      this.sendPlayerData(6, false);
      this.direction = 135;
    }

    if(keyIsDown(UP_ARROW) && keyIsDown(LEFT_ARROW)){
      this.sprite.setSpeed(playerSpeed, 225);
      this.sprite.changeAnimation('moving-up-left');
      this.sendPlayerData(8, false);
      this.direction = 225;
    }

    //set the camera position to the players position
    if (this.sprite.position.x > 0 && this.sprite.position.x < SCENE_W ){
      camera.position.x = this.sprite.position.x;
    }

    if (this.sprite.position.y > 0 && this.sprite.position.y < SCENE_H){
      camera.position.y = this.sprite.position.y;
    }

    // Set boundaries of the game
    if(this.sprite.position.y > SCENE_H + windowHeight / 2 - 25){
      this.sprite.position.y = SCENE_H + windowHeight / 2 - 25;
    }

    if(this.sprite.position.y < windowHeight / 2 * -1 + 25){
      this.sprite.position.y = windowHeight / 2 * -1 + 25;
    }

    if(this.sprite.position.x > SCENE_W + windowWidth / 2 - 25){
      this.sprite.position.x = SCENE_W + windowWidth / 2 - 25;
    }

    if(this.sprite.position.x < windowWidth / 2 * -1 + 25){
      this.sprite.position.x = windowWidth / 2 * -1 + 25;
    }

    if (currentUser.nickname) {
      fill(255, 255, 255);
      textSize(10);
      textAlign(CENTER);
      text(currentUser.nickname, this.sprite.position.x, this.sprite.position.y - 20);
    }

  }

  this.changePosition = function(x, y, direction){
    this.sprite.position.x = x;
    this.sprite.position.y = y;

    switch (direction) {
      case 1:
          this.sprite.changeAnimation('moving-up');
        break;
      case 2:
          this.sprite.changeAnimation('moving-up-right');
        break;
      case 3:
          this.sprite.changeAnimation('moving-right');
        break;
      case 4:
          this.sprite.changeAnimation('moving-down-right');
        break;
      case 5:
          this.sprite.changeAnimation('moving-down');
        break;
      case 6:
          this.sprite.changeAnimation('moving-down-left');
        break;
      case 7:
          this.sprite.changeAnimation('moving-left');
        break;
      case 8:
          this.sprite.changeAnimation('moving-up-left');
        break;
      case 9:
          this.sprite.changeAnimation('standing');
        break;
      default:

    }

  }

  // Stops all animations
  this.keyReleased = function(){
    this.sprite.setSpeed(0, 0);
    this.sprite.changeAnimation('standing');
    this.sendPlayerData(9, false);
    this.direction = 0;
    return false;
  }

  this.shoot = function(remote, direction){

    var bullet = createSprite(this.sprite.position.x, this.sprite.position.y);
    bullet.addImage(this.bulletImage);
    bullet.setSpeed(9, this.direction);
    bullet.life = 300;
    if (remote) {
      // nothing
    }else{
      this.sendPlayerData(this.direction, true);
    }

  }

  this.dash = function(){

  }

  this.sendPlayerData = function(direction, shooting){
    var bullet = false;
    if(shooting){
      bullet = true;
    }
    socket.emit('playerMovement', { x: this.sprite.position.x, y: this.sprite.position.y, dir: direction, nick: this.nickname, shooting: bullet });
  }

}
