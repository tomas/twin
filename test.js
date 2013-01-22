var twin = require('./');

twin.alive(function(alive){
  if (!alive) {
    console.log('Not alive');

    return twin.guard().on('message', function(msg){
      console.log(msg);
    });
  }

  console.log('Alive!');
  twin.send('Something', function(received){
    console.log(received ? 'Received' : 'Not received.');
  });
});
