var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'war-of-the-old-omes', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
    game.load.image('background', 'assets/floor.jpg');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('mo-bullet', 'assets/monsters/mo-bullet.png');
    game.load.image('mo-bullet-2', 'assets/monsters/mo-bullet-2.png');
    game.load.spritesheet('ms', 'assets/player/sheet.png', 32, 32);
    game.load.spritesheet('mo', 'assets/monsters/mo.png', 65, 56);
    game.load.audio('old-one', 'assets/sound/old-one.mp3');
}

var players = [];
var mos = [];
var player;
var cursors;
var fireButton;
var socket;
var playerExists;
var playerIndex;
var mo;
var barConfig;
var music;

function create() {
    barConfig = {width: 100, height: 3};

    socket = io.connect(location.href);

    music = game.add.audio('old-one');

    game.add.tileSprite(0, 0, 2920, 2920, 'background');
    game.world.setBounds(0, 0, 2920, 2920);
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

    socket.emit('getWaveData', {ran: 1});
    
    socket.on('wave', function(data){
      console.log('wave');
      console.log(data);
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
        console.log(data.lifePoints);
        players[playerIndex].move(data.direction, data.shooting, data.death, false, data.position);
        players[playerIndex].lifePoints = data.lifePoints;
        var percentage2 = players[playerIndex].lifePoints * 100 / players[playerIndex].lifeBar;
        players[playerIndex].healthbar.setPercent(percentage2);
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

  for (var i = 0; i < mos.length; i++) {
    game.physics.arcade.collide(mos[i].sprite, player.sprite);
    game.physics.arcade.overlap(player.weapon.bullets, mos[i].sprite, collisionHandler, null, this);
    game.physics.arcade.overlap(mos[i].weapon.bullets, player.sprite, collisionEnemyHandler, null, this);
    mos[i].healthbar.setPosition(mos[i].sprite.position.x + mos[i].sprite.width / 2 - 35, mos[i].sprite.position.y - 40);
    mos[i].monsterName.alignTo(mos[i].sprite, Phaser.BOTTOM_CENTER, 0);
    mos[i].weapon.fire();
    mos[i].sprite.angle += mos[i].angle;
  }

  player.listenMovement();
  for (var i = 0; i < players.length; i++) {
    players[i].alignName();
    players[i].healthbar.setPosition(players[i].sprite.position.x + players[i].sprite.width / 2, players[i].sprite.position.y - 10);
    for (var j = 0; j < mos.length; j++) {
      game.physics.arcade.overlap(players[i].weapon.bullets, mos[j].sprite, collisionHandler, null, this);
      game.physics.arcade.overlap(mos[j].weapon.bullets, players[i].sprite, collisionEnemyHandler, null, this);
    }
  }

}

function start() {
    music.fadeIn(4000);
}

function render(){

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
  player.sendMovementData(true);

  bullet.kill();
}
