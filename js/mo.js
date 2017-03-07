function Mo (nick, fireAngle) {

  this.sprite = null;
  this.direction = 0;
  this.nick = nick;
  this.isDeath = true;
  this.monsterName = false;
  this.lifePoints = 100;
  this.angle = fireAngle;

  this.create = function(x, y){

    this.nickStyle = {
        font: "15px",
        fill: "red"
    };

    this.sprite = game.add.sprite(x, y, 'minion');
    this.sprite.animations.add('standing', [0,1], false);
    this.sprite.animations.add('walking', [0,1,2,3,4,5,6,7], false);
    this.sprite.animations.play('walking', 11, true);
    game.physics.arcade.enable(this.sprite, true);
    this.monsterName = game.add.text(0, 0, this.nick, this.nickStyle);
    this.monsterName.alignTo(this.sprite, Phaser.BOTTOM_CENTER, 0);
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.immovable = true;
    this.sprite.anchor.setTo(0.5, 0.5);

    this.lifebar = new Phaser.Line(game.world.centerX, game.world.centerY, game.world.centerX + 200, game.world.centerY + 200);

    this.weapon = game.add.weapon(100, 'mo-bullet-2');
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.weapon.bulletSpeed = 600;
    this.weapon.fireRate = 85;
    this.weapon.trackSprite(this.sprite, 5, 5, true);
    this.weapon.autofire = true;

    this.healthbar = new HealthBar(game, {width: this.sprite.width, height: 3});
    this.healthbar.height = 3;

  }

  // Moves the player around
  this.move = function(direction, shooting, death, currentPlayer, position){

    if (this.direction != direction && this.sprite.body) {

      if (position) {
          this.sprite.position.x = position.x;
          this.sprite.position.y = position.y;
      }

      switch (direction) {
        case 0:
          this.sprite.body.velocity.x = 0;
          this.sprite.body.velocity.y = 0;
          break;
        case 1:
          this.sprite.body.velocity.x = 0;
          this.sprite.body.velocity.y = -200;
          this.weapon.fireAngle = 270;
          break;
        case 2:
          this.sprite.body.velocity.y = -200; //up
          this.sprite.body.velocity.x = 200; // right
          this.weapon.fireAngle = 315;
          break;
        case 3:
          this.sprite.body.velocity.y = 0;
          this.sprite.body.velocity.x = 200; // right
          this.weapon.fireAngle = 0;
          break;
        case 4:
          this.sprite.body.velocity.y = 200; //down
          this.sprite.body.velocity.x = 200; // right
          this.weapon.fireAngle = 45;
          break;
        case 5:
          this.sprite.body.velocity.x = 0;
          this.sprite.body.velocity.y = 200; //down
          this.weapon.fireAngle = 90;
          break;
        case 6:
          this.sprite.body.velocity.y = 200; //down
          this.sprite.body.velocity.x = -200; // left
          this.weapon.fireAngle = 135;
          break;
        case 7:
          this.sprite.body.velocity.y = 0;
          this.sprite.body.velocity.x = -200; // left
          this.weapon.fireAngle = 180;
          break;
        case 8:
          this.sprite.body.velocity.y = -200; //up
          this.sprite.body.velocity.x = -200; // left
          this.weapon.fireAngle = 225;
          break;
        default:

          break;
      }

      this.direction = direction;
      this.sendMovementData(currentPlayer);

    }

    this.direction = direction;

    if (shooting && !currentPlayer) {
      this.weapon.fire();
      this.shooting = true;
    }else{
      this.shooting = false;
    }

    if (death) {
      this.kill;
    }

  }

  this.kill = function(){
    this.sprite.destroy();
    this.monsterName.destroy();
    this.weapon.destroy();
    this.healthbar.kill();
  }

  this.sendMovementData = function(currentPlayer){
    if (this.id != null && currentPlayer) {
      socket.emit('moData', {
        direction: this.direction,
        shooting: this.shooting,
        nick: this.nick,
        death: this.isDeath,
        position: this.sprite.position,
        lifePoint : this.lifePoints
      });
    }
  }

}
