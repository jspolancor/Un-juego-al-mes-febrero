var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var port = process.env.PORT || 8080;
var server = http.createServer(handleRequest);
var theWave = createWave();

server.listen(port);

console.log('Our app is running on http://localhost:' + port);

function handleRequest(req, res) {
    // What did we request?
    var pathname = req.url;

    // If blank let's ask for index.html
    if (pathname == '/') {
        pathname = '/index.html';
    }

    var ext = path.extname(pathname);

    var typeExt = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css'
    };

    // What is it?  Default to plain text
    var contentType = typeExt[ext] || 'text/plain';

    // User file system module
    fs.readFile(__dirname + pathname,
        // Callback function for reading
        function(err, data) {
            // if there is an error
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ' + pathname);
            }
            // Otherwise, send the data, the contents of the file
            res.writeHead(200, {
                'Content-Type': contentType
            });
            res.end(data);
        }
    );
}

function createWave() {
    var wave = {};
    // Create the deepOne for the wave
    wave.deepOne = createDeepOne();
    wave.oldOnes = [];
    wave.servitors = [];
    wave.minions = [];
    // Create the old ones of the wave 1-3
    var oldOnesCount = Math.floor((Math.random() * 3) + 1);
    for (var i = 0; i < oldOnesCount; i++) {
        var newOldOne = createOldOne();
        wave.oldOnes.push(newOldOne);
    }
    // Create the servitors of the wave 3-10
    var servitorsCount = Math.floor((Math.random() * 10) + 3);
    for (var i = 0; i < servitorsCount; i++) {
        var newServitor = createServitor();
        wave.servitors.push(newServitor);
    }
    // Create the minions of the wave 20-40
    var minionsCount = Math.floor((Math.random() * 40) + 20);
    for (var i = 0; i < minionsCount; i++) {
        var newMinion = createMinion();
        wave.minions.push(newMinion);
    }
    return wave;
}

function createDeepOne() {
    // Create the name of the deep one
    var mos = ['ch', 'chu', 'chuch', 'chucp', 'th', 'thu', 'thul', 'lh', 'lhu', 'co', 'chio', 'chor', 'cher', 'mhu', 'mu', 'klath', 'kloth', 'klotha', 'klotho', 'plothorc', 'bruthap'];
    var vowels = ['a', 'e', 'i', 'o', 'u', 'á', 'é', 'í', 'ó', 'ú', 'ça', 'çe', 'çí', 'çó', 'çú', 'ä', 'ë', 'ï', 'ö', 'ü'];
    var consonants = ['b', 'c', 'doé', 'có', '¨f', '`p', 'lo', 'ch', 'gl', 'flą', 'flatar', 'mol', 'tr', 'ad', 'dd'];
    var nick = mos[Math.floor((Math.random() * (mos.length - 1)) + 0)] + vowels[Math.floor((Math.random() * (vowels.length - 1)) + 0)] + consonants[Math.floor((Math.random() * (consonants.length - 1)) + 0)]
    var deepOne = {
        nick: nick,
        servitors: [],
        minions: [],
        lifePoints: Math.floor((Math.random() * 20000) + 10000)
    };
    // A deep one can invoque multiple servitors and minions
    // Create the servitors of the wave 1-2
    var servitorsCount = Math.floor((Math.random() * 2) + 1);
    for (var i = 0; i < servitorsCount; i++) {
        var newServitor = createServitor();
        deepOne.servitors.push(newServitor);
    }
    // Create the minions of the deep one 10-20
    var minionsCount = Math.floor((Math.random() * 20) + 10);
    for (var i = 0; i < minionsCount; i++) {
        var newMinion = createMinion();
        deepOne.minions.push(newMinion);
    }
    return deepOne;
}

function createOldOne() {
  var mos = ['mh', 'mhu', 'mhumh', 'mhump', 'th', 'thu', 'thul', 'lh', 'lhu', 'mo', 'mhio', 'mhor', 'mher', 'mhu', 'mu', 'klath', 'kloth', 'klotha', 'klotho', 'plothorm', 'brsuthap'];
  var vowels = ['ae', 'ei', 'io', 'ou', 'ua', 'áe', 'éi', 'ío', 'óu', 'aú', 'çae', 'çei', 'çío', 'çóu', 'açú', 'iä', 'ië', 'iï', 'iö', 'üi'];
  var consonants = ['b', 'c', 'doé', 'có', '¨f', '`p', 'lo', 'ch', 'gl', 'flą', 'flatar', 'mol', 'tr', 'ad', 'dd'];
  var nick = mos[Math.floor((Math.random() * (mos.length - 1)) + 0)] + vowels[Math.floor((Math.random() * (vowels.length - 1)) + 0)] + consonants[Math.floor((Math.random() * (consonants.length - 1)) + 0)]
    var oldOne = {
      nick: nick,
      minions: [],
      lifePoints: Math.floor((Math.random() * 10000) + 5000)
    };
    // Create the minions of the old one 1-15
    var minionsCount = Math.floor((Math.random() * 15) + 1);
    for (var i = 0; i < minionsCount; i++) {
        var newMinion = createMinion();
        oldOne.minions.push(newMinion);
    }
    return oldOne;
}

function createServitor() {
  var mos = ['h', 'hu', 'huh', 'hup', 'th', 'thu', 'thul', 'lh', 'lhu', 'o', 'hio', 'hor', 'her', 'hu', 'u', 'klath', 'kloth', 'klotha', 'klotho', 'plothor', 'brsuthap'];
  var vowels = ['ae', 'ei', 'io', 'ou', 'ua', 'áe', 'éi', 'ío', 'óu', 'aú', 'çae', 'çei', 'çío', 'çóu', 'açú', 'iä', 'ië', 'iï', 'iö', 'üi'];
  var consonants = ['b', 'c', 'doé', 'có', '¨f', '`p', 'lo', 'ch', 'gl', 'flą', 'flatar', 'ol', 'tr', 'ad', 'dd'];
  var nick = mos[Math.floor((Math.random() * (mos.length - 1)) + 0)] + vowels[Math.floor((Math.random() * (vowels.length - 1)) + 0)] + consonants[Math.floor((Math.random() * (consonants.length - 1)) + 0)];
  var servitor = {
    nick: nick,
    minions: [],
    lifePoints: Math.floor((Math.random() * 2000) + 1000)
  };
  // Create the minions of the servitor one 1-15
  var minionsCount = Math.floor((Math.random() * 15) + 1);
  for (var i = 0; i < minionsCount; i++) {
      var newMinion = createMinion();
      servitor.minions.push(newMinion);
  }
  return servitor;
}

function createMinion() {
  var mos = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
  var vowels = ['ae', 'ei', 'io', 'ou', 'ua', 'áe', 'éi', 'ío', 'óu', 'aú', 'çae', 'çei', 'çío', 'çóu', 'açú', 'iä', 'ië', 'iï', 'iö', 'üi'];
  var nick = mos[Math.floor((Math.random() * (mos.length - 1)) + 0)] + vowels[Math.floor((Math.random() * (vowels.length - 1)) + 0)] + mos[Math.floor((Math.random() * (mos.length - 1)) + 0)];
    var minion = {
      nick: nick,
      lifePoints: Math.floor((Math.random() * 150) + 50)
    };
    return minion;
}

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connect',
    // We are given a websocket object in our function
    function(socket) {

        console.log("We have a new client: " + socket.id);

        socket.broadcast.emit('wave', {
          wave: theWave
        });

        socket.on('waveData', function(){
          io.emit('wave', {
            wave: theWave
          });
        });

        // When this user emits, client side: socket.emit('otherevent',some data);
        socket.on('playerData',
            function(data) {

                // Send it to all other clients
                socket.broadcast.emit('playerData', {
                    direction: data.direction,
                    shooting: data.shooting,
                    nick: data.nick,
                    death: data.death,
                    id: data.id,
                    position: data.position,
                    worldPosition: data.worldPosition,
                    socketId: socket.id,
                    lifePoints: data.lifePoints
                });

            }
        );

        socket.on('disconnect', function() {
            console.log("Client " + socket.id + " has disconnected");
            socket.broadcast.emit('disconnection', {
                socketId: socket.id
            });
        });

    }
);
