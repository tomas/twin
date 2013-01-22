var server,
    net = require('net'),
    Emitter = require('events').EventEmitter;

var port = 91919;

var connect = function(message, cb){

  var done = function(err){
    // var connected = !err || err.code != 'ECONNREFUSED';
    cb(!err);
  }

  var client = net.connect(port, function(){
    if (message) client.write(message);
    client.end();
  });

  client.on('end', done)
  client.on('error', done)
}

exports.port = function(port){
  port = port;
}

exports.guard = function(){

  var emitter = new Emitter();

  server = net.createServer(function(socket){
    socket.on('data', function(x){
      emitter.emit('message', x);
    })
  })

  server.on('error', function(err){
    // console.log(err);
  })

  server.listen(port, '127.0.0.1');

  return emitter;
}

exports.send = function(msg, cb){
  connect(msg, cb);
}

exports.alive = function(cb){
  connect(null, cb);
}

process.on('exit', function(){
  server && server.close();
});
