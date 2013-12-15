var configs = require('./public/configs')
  , express = require('express')
  , http = require('http')
  , io = require('socket.io')
  , path = require('path')
  , ejs = require('ejs')
  , arduino = require('duino')
  , socketSrv = null
  , board = null
  , leds = [];

// configurem servidor
var app = express();

app.configure(function () {
  app.set('port', configs.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);
});

app.get('/', function (req, res) {
  res.render('index', {});
});

// obrim servidor
socketSrv = http.createServer(app);
socketSrv.listen(app.get('port'), function () {
  console.log("express server listen on port" + app.get('port'));
});

// configurem placa arduino
ledsData = configs.initialLeds;
var board = new arduino.Board({
    //device: "ACM",
    debug: true
    , device: configs.arduino.device
  });
//  , board = new arduino.Board({device: configs.arduino.device});
board.on('ready', function(){
  var i = 0, N = ledsData.length;
  for (; i < N; i += 1) {
    board.pinMode(ledsData[i].pin, "in");
    leds[ledsData[i]["name"]] = new arduino.Led({
      board: board,
      pin: ledsData[i].pin
    });
  }
});

// Configurem socket
io = io.listen(socketSrv);
io.sockets.on('connection', function (socket) {
  var i, N = ledsData.length;

  socket.emit(configs.ledInt.toClient, ledsData);
  socket.on(configs.ledInt.toServer, function (data) {
    console.log(data);
    // en cas de primera conecció demanem les dades
    if (data === undefined || data.length < 1) { data = ledsData; }
    // obrim o tanquem leds
    for (i = 0; i < N; i += 1) {
      if (data[i].value) {
        leds[data[i]["name"]].on();
      } else {
        leds[data[i]["name"]].off();
      }
    }
    // fem el notify a tots els sockets oberts
    io.sockets.emit(configs.ledInt.toClient, data);
  });
});
