function Player () {
  //create a sprite and add the 3 animations
  this.sprite = createSprite(400, 200, 50, 100),
  this.create = function(){
    var myAnimation = this.sprite.addAnimation("floating", "assets/ghost_standing0001.png", "assets/ghost_standing0007.png");
    myAnimation.offY = 18;

    this.sprite.addAnimation("moving", "assets/ghost_walk0001.png", "assets/ghost_walk0004.png");
  },
  this.moveTo = function(x, y){

  },
  this.position = {
    x: this.sprite.position.x,
    y: this.sprite.position.y,
  }
}
