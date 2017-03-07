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
    game.load.image('deep-1', 'assets/monsters/deep-texture-1.png');
    game.load.image('deep-2', 'assets/monsters/deep-texture-2.png');
    game.load.spritesheet('ms', 'assets/player/sheet.png', 32, 32);
    game.load.spritesheet('mo', 'assets/monsters/mo.png', 65, 56);
    game.load.spritesheet('minion', 'assets/monsters/minion.png', 60, 110);
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
var currentWave = {};
var waveData;
var deepOneText, oldOnesText, servitorsText, minionsText;
var shake;
var deepOneSprites = [];
var snakeHead; //head of snake sprite
var snakeSection = new Array(); //array of sprites that make the snake body sections
var snakePath = new Array(); //arrary of positions(points) that have to be stored for the path the sections follow
var numSnakeSections = 300; //number of snake body sections
var snakeSpacer = 6; //parameter that sets the spacing between sections

function create() {
    barConfig = {width: 100, height: 3};

    socket = io.connect(location.href);
    music = game.add.audio('old-one');

    shake = new Phaser.Plugin.Shake(game);
    game.plugins.add(shake);

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

    //mo = new Mo('mo');
    //mo.create();

    waveData = game.add.text(0, 0, '', { font: "12px Arial", fill: "#f2b51a", align: "left", boundsAlignH: "right",
        boundsAlignV: "top",  });
    waveData.fixedToCamera = true;
    waveData.cameraOffset.setTo(10, 10);
    waveData.setTextBounds(0, 0, window.innerWidth - 20, 0);

    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    cursors = game.input.keyboard.createCursorKeys();

    snakeHead = game.add.sprite(400, 300, 'deep-1');
    snakeHead.anchor.setTo(0.5, 0.5);

    game.physics.enable(snakeHead, Phaser.Physics.ARCADE);

    //  Init snakeSection array
    for (var i = 1; i <= numSnakeSections-1; i++)
    {
        snakeSection[i] = game.add.sprite(400, 300, 'mo');
        snakeSection[i].animations.add('standing', [0, 1], false);
        snakeSection[i].animations.play('standing', 2, true);
        snakeSection[i].anchor.setTo(0.7, 0.7);
    }

    //  Init snakePath array
    for (var i = 0; i <= numSnakeSections * snakeSpacer; i++)
    {
        snakePath[i] = new Phaser.Point(400, 300);
    }

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

    socket.emit('waveData', {});

    socket.on('deepOneTriggered', function(){});

    socket.on('oldOneTriggered', function(){});

    socket.on('servitorTriggered', function(){});

    socket.on('minionsTriggered', function(){});

    socket.on('wave', function(data){
      currentWave = data.wave;
      waveData.setText('Wave 1 \n');
      waveData.setText(waveData.text + 'Deep One: ' + currentWave.deepOne.nick + ' ' + currentWave.deepOne.lifePoints + '\n');
      for (var i = 0; i < currentWave.oldOnes.length; i++) {
        waveData.setText(waveData.text + 'Old One: ' + currentWave.oldOnes[i].nick + ' ' + currentWave.oldOnes[i].lifePoints + '\n');
      }
      for (var i = 0; i < currentWave.servitors.length; i++) {
        waveData.setText(waveData.text + 'Servitor: ' + currentWave.servitors[i].nick + ' ' + currentWave.servitors[i].lifePoints + '\n');
      }
      waveData.setText(waveData.text + 'Minions count: ' + currentWave.minions.length + '\n');
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

  snakeHead.body.velocity.setTo(0, 0);
    snakeHead.body.angularVelocity = 0;

    if (cursors.up.isDown)
    {
        snakeHead.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(snakeHead.angle, 300));

        // Everytime the snake head moves, insert the new location at the start of the array,
        // and knock the last position off the end

        var part = snakePath.pop();

        part.setTo(snakeHead.x, snakeHead.y);

        snakePath.unshift(part);

        for (var i = 1; i <= numSnakeSections - 1; i++)
        {
            snakeSection[i].x = (snakePath[i * snakeSpacer]).x;
            snakeSection[i].y = (snakePath[i * snakeSpacer]).y;
        }
    }

    if (cursors.left.isDown)
    {
        snakeHead.body.angularVelocity = -300;
    }
    else if (cursors.right.isDown)
    {
        snakeHead.body.angularVelocity = 300;
    }

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
