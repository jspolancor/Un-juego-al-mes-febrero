var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'war-of-the-old-omes',
{ preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('background','assets/floor.jpg');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.spritesheet('ms', 'assets/player/sheet.png', 32, 32);
}

var player;
var cursors;
var playerName;
var text1;
var style = { font: "10px", fill: "#00ff44" };
var weapon;
var fireButton;
var isAuth = false;

function initGame(){

}

function create() {
  game.add.tileSprite(0, 0, 1920, 1920, 'background');
  game.world.setBounds(0, 0, 1920, 1920);
  game.physics.startSystem(Phaser.Physics.P2JS);
  player = game.add.sprite(game.world.centerX, game.world.centerY, 'ms');
  text1 = game.add.text(0, 0, playerName, style);
  player.animations.add('standing', [0,1], false);
  player.animations.add('walk-down', [0,1,2,3,4,5], false);
  player.animations.add('walk-left', [6,7,8,9,10,11], false);
  player.animations.add('walk-right', [12,13,14,15,16,17], false);
  player.animations.add('walk-up', [18,19,20,21,22,23], false);
  player.animations.add('walk-down-left', [24,25,26,27,28,29], false);
  player.animations.add('walk-down-right', [30,31,32,33,34,35], false);
  player.animations.add('walk-up-left', [36,37,38,39,40,41], false);
  player.animations.add('walk-up-right', [42,43,44,45,46,47], false);
  game.physics.p2.enable(player);
  //game.physics.arcade.enable(player);
  player.body.fixedRotation = true;
  weapon = game.add.weapon(8, 'bullet');
  weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
  weapon.bulletSpeed = 600;
  weapon.fireRate = 300;
  weapon.trackSprite(player, 5, 5, false);

  cursors = game.input.keyboard.createCursorKeys();
  game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    firebase.auth().onAuthStateChanged(function(user) {

      if (user) {
        playerName = user.displayName

        console.log(playerName);
        text1.text = playerName;
        $('#modalRegister').modal('hide');
        $('#modalLogin').modal('hide');
      } else {
        $('#modalRegister').modal('toggle');
      }

    });



}

function update() {

    if (!isAuth) {
        //return;
    }

    player.body.setZeroVelocity();

    if (cursors.down.isDown) {
      player.body.moveDown(300);
    }else if(cursors.up.isDown){
      player.body.moveUp(300);
    }

    if (cursors.right.isDown){
      player.body.moveRight(300);
    }else if(cursors.left.isDown){
      player.body.velocity.x = -300;
    }

    if (cursors.left.isDown && !cursors.up.isDown && !cursors.down.isDown && !cursors.right.isDown) {
      player.animations.play('walk-left', 11, false);
      weapon.fireAngle = 180;
    }else if(cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown){
      player.animations.play('walk-right', 11, false);
      weapon.fireAngle = 0;
    }

    if (cursors.down.isDown && cursors.right.isDown){
      player.animations.play('walk-down-right', 11, false);
      weapon.fireAngle = 45;
    }else if(cursors.down.isDown && cursors.left.isDown){
      player.animations.play('walk-down-left', 11, false);
      weapon.fireAngle = 135;
    } else if(cursors.down.isDown){
      player.animations.play('walk-down', 11, false);
      weapon.fireAngle = 90;
    }

    if (cursors.up.isDown && cursors.right.isDown){
      player.animations.play('walk-up-right', 11, false);
      weapon.fireAngle = 315;
    }else if(cursors.up.isDown && cursors.left.isDown){
      player.animations.play('walk-up-left', 11, false);
      weapon.fireAngle = 225;
    } else if(cursors.up.isDown){
      player.animations.play('walk-up', 11, false);
      weapon.fireAngle = 270;
    }

    if (fireButton.isDown)
    {
        weapon.fire();
    }

    text1.alignTo(player, Phaser.BOTTOM_CENTER, 0);

}

function render() {

    game.debug.text("Arrows to move.", 20, 20);

}
