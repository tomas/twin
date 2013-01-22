var twin = require('./');

twin.alive(function(alive, running){
  if (!alive) {
    console.log('Not alive');

    twin.guard(function(err, hook){
      if (err) throw(err);

      hook.on('message', function(msg){
        console.log('MESSAGE: ' + msg);
      });
    })
  } else {

    console.log(running.since);
    console.log(running.pid);

    twin.send('Something', function(received){
      console.log(received ? 'OK' : 'Error.');
    });

  }

});
