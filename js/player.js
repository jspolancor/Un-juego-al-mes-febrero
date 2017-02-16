function Player () {

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
    }

    if(keyIsDown(DOWN_ARROW)){
      this.sprite.setSpeed(playerSpeed, 90);
      this.sprite.changeAnimation('moving-down');
    }

    if(keyIsDown(LEFT_ARROW)){
      this.sprite.setSpeed(playerSpeed, 180);
      this.sprite.changeAnimation('moving-left');
    }

    if(keyIsDown(UP_ARROW)){
      this.sprite.setSpeed(playerSpeed, 270);
      this.sprite.changeAnimation('moving-up');
    }

    if(keyIsDown(DOWN_ARROW) && keyIsDown(RIGHT_ARROW)){
      this.sprite.setSpeed(playerSpeed, 45);
      this.sprite.changeAnimation('moving-down-right');
    }

    if(keyIsDown(DOWN_ARROW) && keyIsDown(LEFT_ARROW)){
      this.sprite.setSpeed(playerSpeed, 135);
      this.sprite.changeAnimation('moving-down-left');
    }

    if(keyIsDown(UP_ARROW) && keyIsDown(RIGHT_ARROW)){
      this.sprite.setSpeed(playerSpeed, 315);
      this.sprite.changeAnimation('moving-up-right');
    }

    if(keyIsDown(UP_ARROW) && keyIsDown(LEFT_ARROW)){
      this.sprite.setSpeed(playerSpeed, 225);
      this.sprite.changeAnimation('moving-up-left');
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

  }

  // Stops all animations
  this.keyReleased = function(){
    this.sprite.setSpeed(0, 0);
    this.sprite.changeAnimation('standing');
    return false;
  }

  this.dash = function(){

  }

}
