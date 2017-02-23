function Player (id, nick) {

  this.nick = nick;
  this.id = id;
  this.sprite = null;
  this.direction = 0;
  this.firing = false;

  this.create = function(){

    this.nickStyle = {
        font: "10px",
        fill: "#00ff44"
    };

    this.sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'ms');
    this.sprite.animations.add('standing', [0, 1], false);
    this.sprite.animations.add('walk-down', [0, 1, 2, 3, 4, 5], false);
    this.sprite.animations.add('walk-left', [6, 7, 8, 9, 10, 11], false);
    this.sprite.animations.add('walk-right', [12, 13, 14, 15, 16, 17], false);
    this.sprite.animations.add('walk-up', [18, 19, 20, 21, 22, 23], false);
    this.sprite.animations.add('walk-down-left', [24, 25, 26, 27, 28, 29], false);
    this.sprite.animations.add('walk-down-right', [30, 31, 32, 33, 34, 35], false);
    this.sprite.animations.add('walk-up-left', [36, 37, 38, 39, 40, 41], false);
    this.sprite.animations.add('walk-up-right', [42, 43, 44, 45, 46, 47], false);
    //this.sprite.body.fixedRotation = true;

    this.playerName = game.add.text(0, 0, this.nick, this.nickStyle);

    this.weapon = game.add.weapon(8, 'bullet');
    this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
    this.weapon.bulletSpeed = 600;
    this.weapon.fireRate = 300;
    this.weapon.trackSprite(this.sprite, 5, 5, false);

  }

  this.listenMovement = function(){

    this.sprite.body.fixedRotation = true;
    this.sprite.body.setZeroVelocity();
    this.direction = 0;

    if (cursors.down.isDown) {
        this.sprite.body.moveDown(300);
    } else if (cursors.up.isDown) {
        this.sprite.body.moveUp(300);
    }

    if (cursors.right.isDown) {
        this.sprite.body.moveRight(300);
    } else if (cursors.left.isDown) {
        this.sprite.body.velocity.x = -300;
    }

    if (cursors.left.isDown && !cursors.up.isDown && !cursors.down.isDown && !cursors.right.isDown) {
        this.sprite.animations.play('walk-left', 11, false);
        this.weapon.fireAngle = 180;
        this.direction = 7;
    } else if (cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown) {
        this.sprite.animations.play('walk-right', 11, false);
        this.weapon.fireAngle = 0;
        this.direction = 3;
    }

    if (cursors.down.isDown && cursors.right.isDown) {
        this.sprite.animations.play('walk-down-right', 11, false);
        this.weapon.fireAngle = 45;
        this.direction = 4;
    } else if (cursors.down.isDown && cursors.left.isDown) {
        this.sprite.animations.play('walk-down-left', 11, false);
        this.weapon.fireAngle = 135;
        this.direction = 6;
    } else if (cursors.down.isDown) {
        this.sprite.animations.play('walk-down', 11, false);
        this.weapon.fireAngle = 90;
        this.direction = 5;
    }

    if (cursors.up.isDown && cursors.right.isDown) {
        this.sprite.animations.play('walk-up-right', 11, false);
        this.weapon.fireAngle = 315;
        this.direction = 2;
    } else if (cursors.up.isDown && cursors.left.isDown) {
        this.sprite.animations.play('walk-up-left', 11, false);
        this.weapon.fireAngle = 225;
        this.direction = 8;
    } else if (cursors.up.isDown) {
        this.sprite.animations.play('walk-up', 11, false);
        this.weapon.fireAngle = 270;
        this.direction = 1;
    }

    if (fireButton.isDown) {
        this.weapon.fire();
        this.firing = true;
    }

    // If no arrow keys are pressed, stop the movement

  }

  // Moves the player around
  this.move = function(direction, shooting, death){
    switch (direction) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
        break;
      case 8:
        break;
      default:
        break;

    }
    if (death) {
      // Death animation
      this.sprite.destroy();
    }
  }

  this.stopMoving(){
    this.sprite.body.setZeroVelocity();
    this.direction = 0;
  }

  this.alignName = function(){
    this.playerName.alignTo(this.sprite, Phaser.BOTTOM_CENTER, 0);
  }

  this.sendPlayerData = function(direction, shooting, nick, death){
    if (this.id != null) {
      socket.emit('playerMovement', {
        direction: direction,
        shooting: shooting,
        nick: nick,
        death: death,
        id: this.id
      });
    }
  }

}
