function Player (nick) {

  this.id = null;
  this.nick = nick;
  this.sprite = null;
  this.direction = 0;
  this.shooting = false;
  this.isDeath = false;
  this.previusStanding = false;
  this.standing = false;
  this.socketId = null;

  this.lifeBar = 40;
  this.lifePoints = this.lifeBar;

  this.create = function(x, y){

    this.nickStyle = {
        font: "10px",
        fill: "#00ff44"
    };

    if (x && y) {
      this.sprite = game.add.sprite(x, y, 'ms');
    }else{
      this.sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'ms');
    }

    this.sprite.animations.add('standing', [0, 1], false);
    this.sprite.animations.add('walk-down', [0, 1, 2, 3, 4, 5], false);
    this.sprite.animations.add('walk-left', [6, 7, 8, 9, 10, 11], false);
    this.sprite.animations.add('walk-right', [12, 13, 14, 15, 16, 17], false);
    this.sprite.animations.add('walk-up', [18, 19, 20, 21, 22, 23], false);
    this.sprite.animations.add('walk-down-left', [24, 25, 26, 27, 28, 29], false);
    this.sprite.animations.add('walk-down-right', [30, 31, 32, 33, 34, 35], false);
    this.sprite.animations.add('walk-up-left', [36, 37, 38, 39, 40, 41], false);
    this.sprite.animations.add('walk-up-right', [42, 43, 44, 45, 46, 47], false);

    this.playerName = game.add.text(0, 0, this.nick, this.nickStyle);

    this.healthbar = new HealthBar(game, {width: this.sprite.width, height: 3});

    this.weapon = game.add.weapon(15, 'bullet');
    this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
    this.weapon.bulletSpeed = 600;
    this.weapon.fireRate = 100;
    this.weapon.trackSprite(this.sprite, 5, 5, false);

  }

  this.listenMovement = function(){

    this.healthbar.setPosition(this.sprite.position.x + this.sprite.width / 2, this.sprite.position.y - 10);

    if (fireButton.isDown && !this.shooting) {
      //console.log('Fire start');
      this.shooting = true;
      this.weapon.fire();
      //this.move(this.direction, this.shooting, this.isDeath, true);
      this.sendMovementData(true);
    }else if(!fireButton.isDown && this.shooting){
      this.shooting = false;
      //this.move(this.direction, this.shooting, this.isDeath, true);
      this.sendMovementData(true);
      //console.log('fire end');
    }

    if (cursors.left.isDown && !cursors.up.isDown && !cursors.down.isDown && !cursors.right.isDown) {
        this.move(7, this.shooting, this.isDeath, true);
    } else if (cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown) {
        this.move(3, this.shooting, this.isDeath, true);
    }

    if (cursors.down.isDown && cursors.right.isDown) {
        this.move(4, this.shooting, this.isDeath, true);
    } else if (cursors.down.isDown && cursors.left.isDown) {
        this.move(6, this.shooting, this.isDeath, true);
    } else if (cursors.down.isDown) {
        this.move(5, this.shooting, this.isDeath, true);
    }

    if (cursors.up.isDown && cursors.right.isDown) {
        this.move(2, this.shooting, this.isDeath, true);
    } else if (cursors.up.isDown && cursors.left.isDown) {
        this.move(8, this.shooting, this.isDeath, true);
    } else if (cursors.up.isDown) {
        this.move(1, this.shooting, this.isDeath, true);
    }

    // If no arrow keys are pressed, stop the movement
    if(!cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown && !cursors.right.isDown){
      if (this.direction != 0) {
          this.move(0, this.shooting, this.isDeath, true);
      }
    }

  }

  // Moves the player around
  this.move = function(direction, shooting, death, currentPlayer, position){

    if (this.direction != direction && this.sprite.body) {
      this.sprite.body.collideWorldBounds = true;
      this.sprite.body.fixedRotation = true;
      this.sprite.body.static = true;

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
          this.sprite.animations.play('walk-up', 11, true);
          this.weapon.fireAngle = 270;
          break;
        case 2:
          this.sprite.body.velocity.y = -200; //up
          this.sprite.body.velocity.x = 200; // right
          this.sprite.animations.play('walk-up-right', 11, true);
          this.weapon.fireAngle = 315;
          break;
        case 3:
          this.sprite.body.velocity.y = 0;
          this.sprite.body.velocity.x = 200; // right
          this.sprite.animations.play('walk-right', 11, true);
          this.weapon.fireAngle = 0;
          break;
        case 4:
          this.sprite.body.velocity.y = 200; //down
          this.sprite.body.velocity.x = 200; // right
          this.sprite.animations.play('walk-down-right', 11, true);
          this.weapon.fireAngle = 45;
          break;
        case 5:
          this.sprite.body.velocity.x = 0;
          this.sprite.body.velocity.y = 200; //down
          this.sprite.animations.play('walk-down', 11, true);
          this.weapon.fireAngle = 90;
          break;
        case 6:
          this.sprite.body.velocity.y = 200; //down
          this.sprite.body.velocity.x = -200; // left
          this.sprite.animations.play('walk-down-left', 11, true);
          this.weapon.fireAngle = 135;
          break;
        case 7:
          this.sprite.body.velocity.y = 0;
          this.sprite.body.velocity.x = -200; // left
          this.sprite.animations.play('walk-left', 11, true);
          this.weapon.fireAngle = 180;
          break;
        case 8:
          this.sprite.body.velocity.y = -200; //up
          this.sprite.body.velocity.x = -200; // left
          this.sprite.animations.play('walk-up-left', 11, true);
          this.weapon.fireAngle = 225;
          break;
        default:

          break;
      }

      this.direction = direction;
      this.sendMovementData(currentPlayer);

    }

    this.alignName();

    this.direction = direction;
    direction != 0 ? this.standing = false : this.standing = true;

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
    this.playerName.destroy();
    this.weapon.destroy();
    this.healthbar.kill();
  }

  this.alignName = function(position){
    this.playerName.alignTo(this.sprite, Phaser.BOTTOM_CENTER, 0);
  }

  this.sendMovementData = function(currentPlayer){
    if (this.id != null && currentPlayer) {
      socket.emit('playerData', {
        direction: this.direction,
        shooting: this.shooting,
        nick: this.nick,
        death: this.isDeath,
        id: this.id,
        position: this.sprite.position,
        worldPosition: this.sprite.worldPosition,
        lifePoints : this.lifePoints
      });
    }
  }

}
