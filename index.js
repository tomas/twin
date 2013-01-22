var server,
    net = require('net'),
    Emitter = require('events').EventEmitter;

var port = 91919,
    born = new Date();

var connect = function(message, cb){

  var data = '';

  var done = function(err){
    // var connected = !err || err.code != 'ECONNREFUSED';
    cb(!err, data);
  }

  var client = net.connect(port, function(){
    // console.log('Sending message :' + message);
    if (message) client.write(message);
    client.end();
  });

  client.on('data', function(d){
    data += d;
  })

  client.on('end', done)
  client.on('error', done)
}

exports.port = function(port){
  port = port;
}

exports.guard = function(cb){

  var error, emitter = new Emitter();

  server = net.createServer(function(socket){
    socket.on('data', function(x){
      emitter.emit('message', x.toString());
    })
    var info = {pid: process.pid, since: born};
    socket.write(JSON.stringify(info));
    // socket.end();
  })

  server.on('error', function(err){
    error = err;
  })

  server.on('close', function(err){
    console.log(err);
  })

  server.listen(port, '127.0.0.1');

  process.nextTick(function(){
    cb(error, emitter);
  })
}

exports.send = function(msg, cb){
  connect(msg, cb);
}

exports.alive = function(cb){
  connect(null, function(alive, str){
    var obj = {};
    try { obj = JSON.parse(str); } catch(e) { /*  */ }
    cb(alive, obj);
  });
}

process.on('exit', function(){
  server && server.close();
});
