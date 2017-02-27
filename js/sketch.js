var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'war-of-the-old-omes', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
    game.load.image('background', 'assets/floor.jpg');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.spritesheet('ms', 'assets/player/sheet.png', 32, 32);
    game.load.spritesheet('mo', 'assets/monsters/mo.png', 65, 56);
}

var players = [];
var player;
var cursors;
var fireButton;
var socket;
var playerExists;
var playerIndex;
var mo;
var barConfig;

function create() {
    barConfig = {width: 100, height: 3};

    socket = io.connect(location.href);

    game.add.tileSprite(0, 0, 1920, 1920, 'background');
    game.world.setBounds(0, 0, 1920, 1920);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.restitution = 0.9;
    game.physics.arcade.setBoundsToWorld();

    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    player = new Player('Player');
    player.create(null, null);
    game.physics.arcade.enable(player.sprite, false);

    mo = new Mo('mo');
    mo.create();

    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(player.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    firebase.auth().onAuthStateChanged(function(user) {

        if (user) {

            player.id = user.uid;
            player.nick = user.displayName;
            player.playerName.text = user.displayName;
            $('#modalRegister').modal('hide');
            $('#modalLogin').modal('hide');

        } else {

            $('#modalRegister').modal('toggle');

        }

    });

    // One of the players are moving
    // Move or create new sprite
    socket.on('playerData', function(data){

      playerExists = false;
      for (var i = 0; i < players.length; i++) {
          if (players[i].id == data.id) {
            playerExists = true;
            playerIndex = i;
          }
      }

      if (playerExists) {
        players[playerIndex].move(data.direction, data.shooting, data.death, false, data.position);
      }else{
        var newPlayer = new Player(data.nick);
        newPlayer.create(data.position.x, data.position.y);
        game.physics.arcade.enable(newPlayer.sprite);
        newPlayer.id = data.id;
        newPlayer.socketId = data.socketId;
        newPlayer.move(data.direction, data.shooting, data.death, false);
        players.push(newPlayer);
      }
    });

    // One of the player is disconnected
    // Destroy the sprites and the player
    socket.on('disconnection', function(data){
      for (var i = 0; i < players.length; i++) {
        if(data.socketId == players[i].socketId){
          players[i].kill();
          players.splice(i, 1);
        }
      }
    });

}

function update() {

  game.physics.arcade.collide(mo.sprite, player.sprite);
  game.physics.arcade.overlap(player.weapon.bullets, mo.sprite, collisionHandler, null, this);
  game.physics.arcade.overlap(mo.weapon.bullets, player.sprite, collisionEnemyHandler, null, this);

  player.listenMovement();
  for (var i = 0; i < players.length; i++) {
    players[i].alignName();
    game.physics.arcade.overlap(players[i].weapon.bullets, mo.sprite, collisionHandler, null, this);
    game.physics.arcade.overlap(mo.weapon.bullets, players[i].sprite, collisionEnemyHandler, null, this);
  }

  mo.healthbar.setPosition(mo.sprite.position.x + mo.sprite.width / 2 - 35, mo.sprite.position.y - 40);
  mo.monsterName.alignTo(mo.sprite, Phaser.BOTTOM_CENTER, 0);
  mo.weapon.fire();
  mo.sprite.angle += 2;
}

function render() {
    game.debug.text("Arrows to move.", 20, 20);
}

function collisionHandler(enemy, bullet){
  mo.lifePoints -= 1;
  mo.healthbar.setPercent(mo.lifePoints - 1);

  if (mo.lifePoints == 0) {
    mo.kill();
  }

  bullet.kill();
}

function collisionEnemyHandler(enemy, bullet){
  player.lifePoints -= 1;
  var percentage = player.lifePoints * 100 / player.lifeBar;
  player.healthbar.setPercent(percentage);

  if (player.lifePoints == 0) {
    player.kill();
  }

  bullet.kill();
}
