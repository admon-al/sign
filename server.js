const
  http = require('http'),
  app = require('./app'),
  config = require('./config');

app.set('port', config.get('port'));

const server = http.createServer(app);
server.listen(config.get('port'), (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${config.get('port')}`)
});
